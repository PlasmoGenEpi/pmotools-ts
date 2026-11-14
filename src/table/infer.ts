/**
 * Column type inference that matches `pd.read_csv(..., engine="python")`.
 *
 * The PMO Builder app reads uploads with pandas, which turns text into
 * numbers, booleans and missing values column by column before any builder
 * sees the table. A browser CSV parser yields strings only; this module types
 * those strings the way pandas would, so builders get the same input.
 *
 * Inference is per column. In order:
 *
 * 1. Text columns (option) keep their strings; NA strings become missing.
 * 2. Numeric: every cell is missing, an NA string, or a number by pandas'
 *    parser. Ints give `int64` (or `uint64` above the int64 range), anything
 *    fractional, exponent-bearing or missing gives `float64`.
 * 3. A `uint64` value beside a negative int or a missing cell: the column is
 *    left as the original strings, NA strings included (pandas quirk).
 * 4. Otherwise NA strings become missing and, if every remaining cell is one
 *    of the six boolean spellings, they become booleans; else the column is
 *    text holding the original strings.
 */

import type { Cell, Row, Table } from "./core.js";

/** pandas' default NA strings (`pandas._libs.parsers.STR_NA_VALUES`). */
export const DEFAULT_NA_VALUES: readonly string[] = [
  "",
  "#N/A",
  "#N/A N/A",
  "#NA",
  "-1.#IND",
  "-1.#QNAN",
  "-NaN",
  "-nan",
  "1.#IND",
  "1.#QNAN",
  "<NA>",
  "N/A",
  "NA",
  "NULL",
  "NaN",
  "None",
  "n/a",
  "nan",
  "null",
];

/** A raw cell from a CSV parser. `null` and `undefined` are always missing. */
export type RawCell = string | null | undefined;

/** A row of raw cells, keyed by column name. */
export type RawRow = Readonly<Record<string, RawCell>>;

/** The dtype pandas gives a column read by `read_csv`. */
export type InferredDtype = "int64" | "uint64" | "float64" | "bool" | "object";

/** Options for {@link inferColumnTypes}. */
export interface InferOptions {
  /**
   * Strings that mean "missing". Replaces the defaults; spread
   * {@link DEFAULT_NA_VALUES} to extend them. Default: pandas' list.
   * Like pandas, an NA string that is a number also matches equal numbers
   * while the column is numeric (`"0"` matches `"00"`), and an NA string that
   * is a whole number also matches its `"N.0"` and `"N"` forms anywhere.
   */
  readonly naValues?: readonly string[];
  /** Columns to keep as text, like `dtype={col: str}`. NA strings still become missing. */
  readonly textColumns?: readonly string[];
}

/** What {@link inferColumns} returns. */
export interface InferResult {
  /** The typed table. Every row has every column; absent cells are `null`. */
  readonly table: Table;
  /** pandas' dtype for each column, in column order. */
  readonly dtypes: Readonly<Record<string, InferredDtype>>;
}

const INT64_MIN = -(2n ** 63n);
const INT64_MAX = 2n ** 63n - 1n;
const UINT64_MAX = 2n ** 64n - 1n;

/** Powers of ten as correctly rounded doubles, like the C literal table pandas uses. */
const POWERS_OF_TEN: readonly number[] = Array.from({ length: 309 }, (_, k) => Number(`1e${k}`));

function powerOfTen(exponent: number): number {
  return POWERS_OF_TEN[exponent] ?? Number.NaN;
}

function isAsciiSpace(code: number): boolean {
  return code === 32 || (code >= 9 && code <= 13);
}

function isAsciiDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

interface ParsedNumber {
  readonly value: number;
  /** No decimal point and no exponent: pandas then reads the cell as an int. */
  readonly maybeInt: boolean;
}

/**
 * Port of pandas' `precise_xstrtod` (via `to_double`): keeps at most 17
 * digits, scales by a power-of-ten table, rejects exponents above 308, and
 * accumulates the exponent in a wrapping 32-bit int. Returns `null` where
 * pandas reports an error or trailing characters.
 */
function preciseXstrtod(text: string): ParsedNumber | null {
  const maxDigits = 17;
  let p = 0;
  const at = (index: number): number => (index < text.length ? text.charCodeAt(index) : 0);
  while (isAsciiSpace(at(p))) p += 1;
  let negative = false;
  if (at(p) === 45) {
    negative = true;
    p += 1;
  } else if (at(p) === 43) p += 1;

  let maybeInt = true;
  let number = 0;
  let exponent = 0;
  let numDigits = 0;
  let numDecimals = 0;
  while (isAsciiDigit(at(p))) {
    if (numDigits < maxDigits) {
      number = number * 10 + (at(p) - 48);
      numDigits += 1;
    } else {
      exponent += 1;
    }
    p += 1;
  }
  if (at(p) === 46) {
    maybeInt = false;
    p += 1;
    while (numDigits < maxDigits && isAsciiDigit(at(p))) {
      number = number * 10 + (at(p) - 48);
      p += 1;
      numDigits += 1;
      numDecimals += 1;
    }
    if (numDigits >= maxDigits) while (isAsciiDigit(at(p))) p += 1;
    exponent -= numDecimals;
  }
  if (numDigits === 0) return null;
  if (negative) number = -number;

  if (at(p) === 69 || at(p) === 101) {
    maybeInt = false;
    p += 1;
    let negativeExponent = false;
    if (at(p) === 45) {
      negativeExponent = true;
      p += 1;
    } else if (at(p) === 43) p += 1;
    let expDigits = 0;
    let n = 0;
    while (expDigits < maxDigits && isAsciiDigit(at(p))) {
      n = (Math.imul(n, 10) + (at(p) - 48)) | 0;
      expDigits += 1;
      p += 1;
    }
    exponent = negativeExponent ? (exponent - n) | 0 : (exponent + n) | 0;
    if (expDigits === 0) p -= 1;
  }

  if (exponent > 308) return null;
  if (exponent > 0) number *= powerOfTen(exponent);
  else if (exponent < -308) {
    if (exponent < -616) number = 0;
    else {
      number /= powerOfTen(-308 - exponent);
      number /= powerOfTen(308);
    }
  } else number /= powerOfTen(-exponent);

  if (number === Infinity || number === -Infinity) return null;
  while (isAsciiSpace(at(p))) p += 1;
  if (p !== text.length) return null;
  return { value: number, maybeInt };
}

const POSITIVE_INFINITY_SPELLINGS = new Set(["inf", "+inf", "infinity", "+infinity"]);
const NEGATIVE_INFINITY_SPELLINGS = new Set(["-inf", "-infinity"]);

/** pandas' `floatify`: the C parser, then an infinity fallback (exact, any case). */
function floatify(text: string): ParsedNumber | null {
  const parsed = preciseXstrtod(text);
  if (parsed !== null) return parsed;
  const lower = text.toLowerCase();
  if (POSITIVE_INFINITY_SPELLINGS.has(lower)) return { value: Infinity, maybeInt: false };
  if (NEGATIVE_INFINITY_SPELLINGS.has(lower)) return { value: -Infinity, maybeInt: false };
  return null;
}

/** Python `int(text)` for a string `preciseXstrtod` accepted as an int. */
function parseInteger(text: string): bigint {
  let body = text.trim();
  let sign = 1n;
  if (body.startsWith("-")) {
    sign = -1n;
    body = body.slice(1);
  } else if (body.startsWith("+")) body = body.slice(1);
  return sign * BigInt(body);
}

const PY_FLOAT_PATTERN =
  /^[+-]?(?:(?:\d(?:_?\d)*)?\.\d(?:_?\d)*|\d(?:_?\d)*\.?)(?:[eE][+-]?\d(?:_?\d)*)?$/;
const PY_SPECIAL_PATTERN = /^[+-]?(?:inf|infinity|nan)$/i;

/** Python `float(text)`, or `null` where Python raises. */
function pythonFloat(text: string): number | null {
  const body = text.trim();
  if (PY_SPECIAL_PATTERN.test(body)) {
    const lower = body.toLowerCase();
    if (lower.includes("nan")) return Number.NaN;
    return lower.startsWith("-") ? -Infinity : Infinity;
  }
  if (!PY_FLOAT_PATTERN.test(body)) return null;
  return Number(body.replaceAll("_", ""));
}

interface NaSets {
  readonly strings: ReadonlySet<string>;
  readonly numbers: ReadonlySet<number>;
}

/** pandas' `_stringify_na_values` plus `_floatify_na_values`. */
function buildNaSets(naValues: readonly string[]): NaSets {
  const strings = new Set<string>();
  const numbers = new Set<number>();
  for (const value of naValues) {
    strings.add(value);
    const asFloat = pythonFloat(value);
    if (asFloat === null || Number.isNaN(asFloat)) continue;
    numbers.add(asFloat);
    if (Number.isFinite(asFloat) && Number.isInteger(asFloat)) {
      const whole = BigInt(asFloat).toString();
      strings.add(`${whole}.0`);
      strings.add(whole);
    }
  }
  return { strings, numbers };
}

type NumericOutcome =
  | { readonly kind: "fail" }
  | { readonly kind: "uint64-conflict" }
  | { readonly kind: "ok"; readonly dtype: "int64" | "uint64" | "float64"; readonly values: Cell[] };

/** pandas' `maybe_convert_numeric` over one column. */
function convertNumeric(cells: readonly (string | null)[], na: NaSets): NumericOutcome {
  let sawNull = false;
  let sawFloat = false;
  let sawInt = false;
  let sawSigned = false;
  let sawUnsigned = false;
  const floats: number[] = [];
  // Exact while within int64/uint64; converted to numbers as pandas' values would be read here.
  const ints: (number | null)[] = [];
  for (const cell of cells) {
    if (cell === null || na.strings.has(cell)) {
      sawNull = true;
      floats.push(Number.NaN);
      ints.push(null);
      continue;
    }
    if (cell === "") return { kind: "fail" };
    const parsed = floatify(cell);
    if (parsed === null) return { kind: "fail" };
    if (na.numbers.has(parsed.value)) {
      sawNull = true;
      floats.push(Number.NaN);
      ints.push(null);
      continue;
    }
    floats.push(parsed.value);
    if (!parsed.maybeInt) {
      sawFloat = true;
      ints.push(null);
      continue;
    }
    // Fast path: at most 17 characters means at most 17 digits, which the
    // parser accumulated exactly, so a safe integer is the cell's exact value.
    if (cell.length <= 17 && Number.isSafeInteger(parsed.value)) {
      const integer = parsed.value === 0 ? 0 : parsed.value;
      if (na.numbers.has(integer)) {
        sawNull = true;
        floats[floats.length - 1] = Number.NaN;
        ints.push(null);
        continue;
      }
      sawInt = true;
      if (integer < 0) sawSigned = true;
      ints.push(integer);
      continue;
    }
    const integer = parseInteger(cell);
    if (na.numbers.has(Number(integer))) {
      sawNull = true;
      floats[floats.length - 1] = Number.NaN;
      ints.push(null);
      continue;
    }
    if (integer < INT64_MIN || integer > UINT64_MAX) return { kind: "fail" };
    sawInt = true;
    if (integer < 0n) sawSigned = true;
    if (integer > INT64_MAX) sawUnsigned = true;
    ints.push(Number(integer));
  }
  if (sawUnsigned && (sawNull || sawSigned)) return { kind: "uint64-conflict" };
  if (sawFloat || sawNull) {
    return { kind: "ok", dtype: "float64", values: floats.map((v) => (Number.isNaN(v) ? null : v)) };
  }
  if (sawInt) {
    return {
      kind: "ok",
      dtype: sawUnsigned ? "uint64" : "int64",
      values: ints,
    };
  }
  return { kind: "ok", dtype: "float64", values: [] };
}

const TRUE_SPELLINGS = new Set(["True", "TRUE", "true"]);
const FALSE_SPELLINGS = new Set(["False", "FALSE", "false"]);

/** pandas' `maybe_convert_bool`: all cells boolean spellings or missing, else `null`. */
function convertBool(cells: readonly (string | null)[]): Cell[] | null {
  const result: Cell[] = [];
  for (const cell of cells) {
    if (cell === null) result.push(null);
    else if (TRUE_SPELLINGS.has(cell)) result.push(true);
    else if (FALSE_SPELLINGS.has(cell)) result.push(false);
    else return null;
  }
  return result;
}

function inferColumn(
  cells: readonly (string | null)[],
  na: NaSets,
  asText: boolean,
): { dtype: InferredDtype; values: Cell[] } {
  const sanitize = (): (string | null)[] => cells.map((cell) => (cell === null || na.strings.has(cell) ? null : cell));
  if (asText) return { dtype: "object", values: sanitize() };
  if (cells.length === 0) return { dtype: "object", values: [] };
  const numeric = convertNumeric(cells, na);
  if (numeric.kind === "ok") return { dtype: numeric.dtype, values: numeric.values };
  if (numeric.kind === "uint64-conflict") return { dtype: "object", values: [...cells] };
  const sanitized = sanitize();
  const booleans = convertBool(sanitized);
  if (booleans !== null) {
    return { dtype: sanitized.includes(null) ? "object" : "bool", values: booleans };
  }
  return { dtype: "object", values: sanitized };
}

/**
 * Types a string grid the way `pd.read_csv` (python engine, default
 * settings) would, and reports each column's pandas dtype.
 *
 * @example
 * const { table, dtypes } = inferColumns([{ n: "001", flag: "TRUE" }, { n: "NA", flag: "false" }]);
 * // table: [{ n: 1, flag: true }, { n: null, flag: false }]
 * // dtypes: { n: "float64", flag: "bool" }
 */
export function inferColumns(rows: readonly RawRow[], options: InferOptions = {}): InferResult {
  const na = buildNaSets(options.naValues ?? DEFAULT_NA_VALUES);
  const textColumns = new Set(options.textColumns ?? []);
  const columns = rowKeysInOrder(rows);
  const dtypes: Record<string, InferredDtype> = {};
  const typed = columns.map((name) => {
    // Read own keys only: a row without a "__proto__" column would otherwise
    // yield Object.prototype as its cell.
    const cells =
      name === "__proto__"
        ? rows.map((row) => (Object.hasOwn(row, name) ? (row[name] ?? null) : null))
        : rows.map((row) => row[name] ?? null);
    const { dtype, values } = inferColumn(cells, na, textColumns.has(name));
    dtypes[name] = dtype;
    return values;
  });
  return { table: assembleRows(rows.length, columns, typed), dtypes };
}

/** Column names in first-seen order across all rows. */
function rowKeysInOrder(rows: readonly RawRow[]): string[] {
  const columns: string[] = [];
  const seen = new Set<string>();
  let previous: string[] | undefined;
  for (const row of rows) {
    const keys = Object.keys(row);
    // Rows from a CSV parser nearly always share one key list; skip the set
    // lookups when this row's keys match the previous row's.
    if (previous !== undefined && sameKeys(keys, previous)) continue;
    previous = keys;
    for (const name of keys) {
      if (!seen.has(name)) {
        seen.add(name);
        columns.push(name);
      }
    }
  }
  return columns;
}

function sameKeys(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

/** Builds each output row with its keys in column order; absent cells are `null`. */
function assembleRows(count: number, columns: readonly string[], typed: readonly (readonly Cell[])[]): Row[] {
  const table: Row[] = new Array<Row>(count);
  // Plain assignment would set the prototype for a "__proto__" column; keep
  // Object.fromEntries, which defines it as an own key, for that rare case.
  if (columns.includes("__proto__")) {
    for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
      table[rowIndex] = Object.fromEntries(
        columns.map((name, columnIndex) => [name, typed[columnIndex]?.[rowIndex] ?? null]),
      );
    }
    return table;
  }
  for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
    const row: Record<string, Cell> = {};
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      const name = columns[columnIndex];
      if (name !== undefined) row[name] = typed[columnIndex]?.[rowIndex] ?? null;
    }
    table[rowIndex] = row;
  }
  return table;
}

/**
 * Types a string grid the way `pd.read_csv` (python engine, default
 * settings) would. Shorthand for `inferColumns(rows, options).table`.
 */
export function inferColumnTypes(rows: readonly RawRow[], options: InferOptions = {}): Table {
  return inferColumns(rows, options).table;
}
