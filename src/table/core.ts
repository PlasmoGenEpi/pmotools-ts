/**
 * Plain-row tables and the handful of pandas operations the PMO builders rely on.
 *
 * pmotools-python takes pandas DataFrames. Here a table is an array of plain
 * row objects, and these helpers reproduce the pandas semantics that affect
 * builder output: which values count as missing, how group keys are ordered,
 * and which duplicate is kept.
 */

/** One table cell. `null`, `undefined` and `NaN` all mean "missing". */
export type Cell = string | number | boolean | null | undefined;

/** One table row, keyed by column name. */
export type Row = Readonly<Record<string, Cell>>;

/**
 * A table is its rows. Its columns are the union of the rows' keys, so an
 * empty table has no columns.
 */
export type Table = readonly Row[];

/** A cell that holds a value. */
export type PresentCell = string | number | boolean;

/** True for `null`, `undefined` and `NaN`: the values pandas treats as NA. */
export function isMissing(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === "number" && Number.isNaN(value));
}

/** True when the cell holds a value. The inverse of {@link isMissing}. */
export function isPresent(value: Cell): value is PresentCell {
  return !isMissing(value);
}

/** Column names in first-seen order across all rows. */
export function columnNames(table: Table): string[] {
  const seen = new Set<string>();
  for (const row of table) {
    for (const name of Object.keys(row)) seen.add(name);
  }
  return [...seen];
}

/** True when at least one row has the column. */
export function hasColumn(table: Table, name: string): boolean {
  return table.some((row) => Object.hasOwn(row, name));
}

/** The requested columns that no row has, in the order given. */
export function missingColumns(table: Table, names: readonly string[]): string[] {
  const present = new Set(columnNames(table));
  return names.filter((name) => !present.has(name));
}

/** One column's values, top to bottom. Missing cells come back as `null`. */
export function columnValues(table: Table, name: string): (PresentCell | null)[] {
  return table.map((row) => {
    const value = row[name];
    return isPresent(value) ? value : null;
  });
}

/** The dtype pandas would give a column holding these values. */
export type PandasDtype = "int64" | "float64" | "bool" | "object";

/**
 * The dtype pandas would infer for a column. Builders need it in the places
 * where Python output depends on it, mainly whether keys sort numerically or
 * as text.
 *
 * - no rows: `object`
 * - every value missing: `float64`
 * - booleans only, none missing: `bool`
 * - numbers only: `int64` when all are whole and none is missing, else `float64`
 * - anything else: `object`
 */
export function pandasDtype(values: readonly Cell[]): PandasDtype {
  if (values.length === 0) return "object";
  let missing = 0;
  let numbers = 0;
  let booleans = 0;
  let wholeNumbers = 0;
  for (const value of values) {
    if (isMissing(value)) missing += 1;
    else if (typeof value === "number") {
      numbers += 1;
      if (Number.isInteger(value)) wholeNumbers += 1;
    } else if (typeof value === "boolean") booleans += 1;
  }
  if (missing === values.length) return "float64";
  if (booleans === values.length) return "bool";
  if (numbers + missing === values.length) {
    return missing === 0 && wholeNumbers === numbers ? "int64" : "float64";
  }
  return "object";
}

/** Compares two strings by Unicode code point, the way Python orders `str`. */
export function compareCodePoints(a: string, b: string): number {
  const left = Array.from(a);
  const right = Array.from(b);
  const shared = Math.min(left.length, right.length);
  for (let i = 0; i < shared; i += 1) {
    const difference = (left[i]?.codePointAt(0) ?? 0) - (right[i]?.codePointAt(0) ?? 0);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
}

function sortRank(value: PresentCell): number {
  return typeof value === "string" ? 1 : 0;
}

/**
 * Orders two present cells the way pandas orders group keys: numbers and
 * booleans numerically, strings by code point, and numbers before strings
 * when a column mixes them. Never use `localeCompare` for PMO ordering.
 */
export function compareCells(a: PresentCell, b: PresentCell): number {
  const rankDifference = sortRank(a) - sortRank(b);
  if (rankDifference !== 0) return rankDifference;
  if (typeof a === "string" && typeof b === "string") return compareCodePoints(a, b);
  return Number(a) - Number(b);
}

/**
 * A string that is equal for two cell tuples exactly when pandas would treat
 * the tuples as the same key. Missing values equal each other; `1` and `"1"`
 * differ.
 */
export function cellKey(cells: readonly Cell[]): string {
  return cells
    .map((cell) => {
      if (!isPresent(cell)) return "~";
      if (typeof cell === "string") return `s${JSON.stringify(cell)}`;
      return `n${Number(cell)}`;
    })
    .join("|");
}

/**
 * A `Map` key that two cells share exactly when their {@link cellKey}s are
 * equal: missing values become `null`, booleans their number (`cellKey`
 * writes `true` as `n1`), and strings and numbers stay as they are, so `1`
 * and `"1"` still differ.
 */
export function cellMapKey(cell: Cell): string | number | null {
  if (!isPresent(cell)) return null;
  return typeof cell === "boolean" ? Number(cell) : cell;
}

/** Distinct values in first-seen order, like `Series.unique()`. Missing is kept once, as `null`. */
export function uniqueInOrder(values: readonly Cell[]): (PresentCell | null)[] {
  const seen = new Set<string>();
  const result: (PresentCell | null)[] = [];
  for (const value of values) {
    const key = cellKey([value]);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(isPresent(value) ? value : null);
  }
  return result;
}

/** Distinct present values in pandas sort order. Missing values are dropped. */
export function sortedUnique(values: readonly Cell[]): PresentCell[] {
  return uniqueInOrder(values)
    .filter((value): value is PresentCell => value !== null)
    .sort(compareCells);
}

/** One group from {@link groupBySorted}. */
export interface Group {
  /** The group's key, one value per grouping column. */
  readonly key: readonly PresentCell[];
  /** The group's rows, in their original order. */
  readonly rows: readonly Row[];
  /** Positions of those rows in the source table. */
  readonly indices: readonly number[];
}

/**
 * Groups rows like `df.groupby(columns)` with pandas defaults: groups come
 * out sorted by key, rows inside a group keep their original order, and a row
 * with a missing value in any grouping column is dropped.
 */
export function groupBySorted(table: Table, columns: readonly string[]): Group[] {
  const groups = new Map<string, { key: PresentCell[]; rows: Row[]; indices: number[] }>();
  table.forEach((row, index) => {
    const key: PresentCell[] = [];
    for (const column of columns) {
      const value = row[column];
      if (!isPresent(value)) return;
      key.push(value);
    }
    const id = cellKey(key);
    let group = groups.get(id);
    if (group === undefined) {
      group = { key, rows: [], indices: [] };
      groups.set(id, group);
    }
    group.rows.push(row);
    group.indices.push(index);
  });
  return [...groups.values()].sort((a, b) => {
    for (let i = 0; i < columns.length; i += 1) {
      const left = a.key[i];
      const right = b.key[i];
      if (left === undefined || right === undefined) continue;
      const difference = compareCells(left, right);
      if (difference !== 0) return difference;
    }
    return 0;
  });
}

/**
 * Marks repeated rows like `df.duplicated(subset=columns, keep=...)`.
 * With `keep: "first"` the first of each set is left unmarked; with
 * `keep: "none"` every member of a repeated set is marked.
 */
export function duplicatedMask(
  table: Table,
  columns: readonly string[],
  keep: "first" | "none" = "first",
): boolean[] {
  // Each distinct cell of a column gets a number, and a row's key is its
  // numbers, such as "3,0,12". Keys stay short however long the cells are:
  // a key holding each cell's text would hold every sequence of a large
  // allele table a second time.
  const numbering = columns.map(() => new Map<string | number | null, number>());
  const keys = table.map((row) =>
    columns
      .map((column, index) => {
        const numbers = numbering[index] ?? new Map<string | number | null, number>();
        const value = cellMapKey(row[column]);
        let number = numbers.get(value);
        if (number === undefined) {
          number = numbers.size;
          numbers.set(value, number);
        }
        return number;
      })
      .join(","),
  );
  const counts = new Map<string, number>();
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1);
  const seen = new Set<string>();
  return keys.map((key) => {
    if (keep === "none") return (counts.get(key) ?? 0) > 1;
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
}

/** Keeps the first row of each distinct key, like `df.drop_duplicates(subset=columns)`. */
export function dropDuplicates(table: Table, columns: readonly string[]): Row[] {
  const mask = duplicatedMask(table, columns, "first");
  return table.filter((_, index) => mask[index] === false);
}
