/**
 * Panel information builder: turns a one-row-per-target table into the PMO
 * `panel_info`, `target_info` and `targeted_genomes` sections.
 *
 * Port of `pmotools/pmo_builder/panel_information_to_pmo.py` (pmotools-python
 * v1.2.2): `panel_info_table_to_pmo`, `check_genome_info` and
 * `merge_panel_info_dicts`. Deliberate differences from Python are recorded in
 * the oracle cases under `conformance/cases/panel/` (field `divergence`).
 */
import { PmoError, warn, type WarningOptions } from "../errors.js";
import {
  cellKey,
  columnNames,
  columnValues,
  isPresent,
  pandasDtype,
  type Cell,
  type PandasDtype,
  type PresentCell,
  type Row,
  type Table,
} from "../table/core.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * One reference genome as the caller supplies it. Must have `name`,
 * `genome_version`, `taxon_id` and `url`; other keys are copied through.
 */
export type GenomeInfoInput = Readonly<Record<string, unknown>>;

/** A genomic location on a target's insert or primer. `genome_id` indexes `targeted_genomes`. */
export interface LocationFragment {
  genome_id: number;
  chrom: PresentCell;
  start: number;
  end: number;
  strand?: PresentCell;
  ref_seq?: PresentCell;
}

/** A primer: its sequence and, when known, its location. */
export interface PrimerFragment {
  /** `null` when the table cell was missing; the schema will reject it. */
  seq: PresentCell | null;
  location?: LocationFragment;
}

/**
 * One `target_info` entry. Additional target columns appear as extra keys,
 * which is why the type allows any key.
 */
export interface TargetFragment {
  /** Written as a string; `null` when the table cell was missing. */
  target_name: string | null;
  gene_name?: PresentCell;
  target_attributes?: string[];
  insert_location?: LocationFragment;
  forward_primer: PrimerFragment;
  reverse_primer: PrimerFragment;
  [key: string]: unknown;
}

/** One reaction of a panel. `panel_targets` index `target_info`. */
export interface ReactionFragment {
  reaction_name: string;
  panel_targets: number[];
}

/** One `panel_info` entry. */
export interface PanelFragment {
  panel_name: string;
  reactions: ReactionFragment[];
}

/**
 * What {@link panelInfoTableToPmo} and {@link mergePanelInfoDicts} return: the
 * panel part of a PMO, with `targeted_genomes` only when genome info was
 * given. Indexes in it (`panel_targets`, `genome_id`) refer to this
 * fragment's own lists.
 */
export interface PanelInfoFragment {
  panel_info: PanelFragment[];
  target_info: TargetFragment[];
  targeted_genomes?: GenomeInfoInput[];
}

/** Options for {@link panelInfoTableToPmo}. Column options name columns of the table. */
export interface PanelInfoOptions extends WarningOptions {
  /** Name given to the panel. */
  readonly panelName: string;
  /** Reference genome(s) that location columns refer to. Required if any location is written. */
  readonly genomeInfo?: GenomeInfoInput | readonly GenomeInfoInput[] | null;
  /** Default `"target_name"`. */
  readonly targetNameCol?: string;
  /** Default `"fwd_primer"`. */
  readonly forwardPrimersSeqCol?: string;
  /** Default `"rev_primer"`. */
  readonly reversePrimersSeqCol?: string;
  /** Column naming each target's reaction(s). Without it every target goes in one reaction, `full`. */
  readonly reactionNameCol?: string | null;
  /**
   * Splits the reaction column. Default `","`. As in pandas, a delimiter
   * longer than one character is a regular expression.
   */
  readonly reactionNameColDelimiter?: string;
  readonly forwardPrimersStartCol?: string | null;
  readonly forwardPrimersEndCol?: string | null;
  readonly reversePrimersStartCol?: string | null;
  readonly reversePrimersEndCol?: string | null;
  readonly insertStartCol?: string | null;
  readonly insertEndCol?: string | null;
  /** Required when any location column is set. */
  readonly chromCol?: string | null;
  readonly strandCol?: string | null;
  readonly refSeqCol?: string | null;
  readonly geneNameCol?: string | null;
  /** Column giving each target's index into `genomeInfo`. Default: genome 0. */
  readonly genomeIdCol?: string | null;
  readonly targetAttributesCol?: string | null;
  /** Splits the attributes column, literally. Default `","`. */
  readonly targetAttributesColDelimiter?: string;
  /** Extra columns copied as-is into each target. */
  readonly additionalTargetInfoCols?: readonly string[] | null;
}

// ---------------------------------------------------------------------------
// Python-compatible value helpers
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Python's `repr(float)`. */
function pyFloatRepr(value: number): string {
  if (Number.isNaN(value)) return "nan";
  if (!Number.isFinite(value)) return value > 0 ? "inf" : "-inf";
  if (value === 0) return Object.is(value, -0) ? "-0.0" : "0.0";
  const magnitude = Math.abs(value);
  if (magnitude >= 1e16 || magnitude < 1e-4) {
    const [mantissa = "", exponent = ""] = value.toExponential().split("e");
    const sign = exponent.startsWith("-") ? "-" : "+";
    const digits = exponent.replace(/^[+-]/, "").padStart(2, "0");
    return `${mantissa}e${sign}${digits}`;
  }
  const text = String(value);
  return text.includes(".") ? text : `${text}.0`;
}

/** Python's `str()` of a cell, given the pandas dtype of its column. */
function pyStr(value: PresentCell, dtype: PandasDtype): string {
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "True" : "False";
  if (dtype === "float64" || !Number.isInteger(value)) return pyFloatRepr(value);
  return String(value);
}

// Python's str.strip() whitespace, which differs slightly from JavaScript's \s.
const PY_SPACE = "\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
const PY_STRIP = new RegExp(`^[${PY_SPACE}]+|[${PY_SPACE}]+$`, "g");

function pyStrip(text: string): string {
  return text.replace(PY_STRIP, "");
}

/** Python's literal `str.split(sep)`. */
function pySplit(text: string, separator: string, code: string): string[] {
  if (separator === "") throw new PmoError(code, "The delimiter cannot be an empty string.");
  return text.split(separator);
}

/** Python's `re.split(pattern, text)`, including its handling of empty matches. */
function pyReSplit(text: string, pattern: RegExp): string[] {
  const parts: string[] = [];
  let last = 0;
  let position = 0;
  let mustAdvance = false;
  while (position <= text.length) {
    pattern.lastIndex = position;
    let match = pattern.exec(text);
    if (match !== null && mustAdvance && match.index === position && match[0].length === 0) {
      if (position + 1 > text.length) break;
      pattern.lastIndex = position + 1;
      match = pattern.exec(text);
    }
    if (match === null) break;
    parts.push(text.slice(last, match.index));
    const end = match.index + match[0].length;
    mustAdvance = match[0].length === 0;
    last = end;
    position = end;
  }
  parts.push(text.slice(last));
  return parts;
}

/**
 * pandas `Series.str.split(pat)`: a one-character pattern splits literally,
 * anything else is compiled as a regular expression.
 */
function makePandasSplitter(delimiter: string): (text: string) => string[] {
  if (delimiter.length === 1) return (text) => text.split(delimiter);
  let pattern: RegExp;
  try {
    pattern = new RegExp(delimiter, "g");
  } catch (error) {
    throw new PmoError(
      "panel/invalid-delimiter",
      `The reaction delimiter ${JSON.stringify(delimiter)} is treated as a regular expression and is not valid: ${String(error)}`,
      { delimiter },
    );
  }
  return (text) => pyReSplit(text, pattern);
}

/** Python's `int()` applied to a cell. */
function pyInt(value: Cell, column: string, targetName: string | null): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string" && /^\s*[+-]?\d+(?:_\d+)*\s*$/.test(value)) {
    return Number(value.trim().replace(/_/g, ""));
  }
  throw new PmoError(
    "panel/invalid-integer",
    `Column ${column} for target ${String(targetName)} must hold an integer, but holds ${JSON.stringify(value ?? null)}.`,
    { column, target: targetName, value: value ?? null },
  );
}

/** The emptiness test of `remove_optional_null_values`. */
function isEmptyOptional(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (Array.isArray(value)) return value.length === 0;
  return isRecord(value) && Object.keys(value).length === 0;
}

/** `remove_optional_null_values`: drops listed keys whose value is empty. */
function removeOptionalNullValues(items: readonly Record<string, unknown>[], keys: readonly string[]): void {
  for (const item of items) {
    for (const key of keys) {
      if (Object.hasOwn(item, key) && isEmptyOptional(item[key])) delete item[key];
    }
  }
}

/** Python truthiness for the values `genome_info` can plausibly hold. */
function pyTruthy(value: unknown): boolean {
  if (value === null || value === undefined || value === false || value === 0 || value === "") return false;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (Array.isArray(value)) return value.length > 0;
  if (isRecord(value)) return Object.keys(value).length > 0;
  return true;
}

function cellOut(value: Cell): PresentCell | null {
  return isPresent(value) ? value : null;
}

function describe(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// ---------------------------------------------------------------------------
// check_genome_info
// ---------------------------------------------------------------------------

const REQUIRED_GENOME_KEYS = ["name", "genome_version", "taxon_id", "url"] as const;

/**
 * Checks that genome info is a genome object, or a non-empty list of them,
 * each with `name`, `genome_version`, `taxon_id` and `url`. Values are not
 * checked. Throws `panel/invalid-genome-info` otherwise.
 */
export function checkGenomeInfo(genomeInfo: unknown): asserts genomeInfo is GenomeInfoInput | GenomeInfoInput[] {
  const checkOne = (genome: Record<string, unknown>, label: string): void => {
    const missing = REQUIRED_GENOME_KEYS.filter((key) => !Object.hasOwn(genome, key));
    if (missing.length > 0) {
      throw new PmoError("panel/invalid-genome-info", `${label} missing required keys: ${missing.join(", ")}`, {
        missing,
      });
    }
  };
  if (isRecord(genomeInfo)) {
    checkOne(genomeInfo, "genome_info");
    return;
  }
  if (Array.isArray(genomeInfo)) {
    if (genomeInfo.length === 0) {
      throw new PmoError("panel/invalid-genome-info", "genome_info list cannot be empty");
    }
    genomeInfo.forEach((genome: unknown, index) => {
      if (!isRecord(genome)) {
        throw new PmoError(
          "panel/invalid-genome-info",
          `genome_info[${index}] must be an object, but got ${describe(genome)}`,
          { index },
        );
      }
      checkOne(genome, `genome_info[${index}]`);
    });
    return;
  }
  throw new PmoError(
    "panel/invalid-genome-info",
    `genome_info must be an object or a list, but got ${describe(genomeInfo)}`,
  );
}

// ---------------------------------------------------------------------------
// panel_info_table_to_pmo
// ---------------------------------------------------------------------------

interface ResolvedOptions {
  panelName: string;
  targetNameCol: string;
  forwardPrimersSeqCol: string;
  reversePrimersSeqCol: string;
  reactionNameCol: string | null;
  reactionNameColDelimiter: string;
  forwardPrimersStartCol: string | null;
  forwardPrimersEndCol: string | null;
  reversePrimersStartCol: string | null;
  reversePrimersEndCol: string | null;
  insertStartCol: string | null;
  insertEndCol: string | null;
  chromCol: string | null;
  strandCol: string | null;
  refSeqCol: string | null;
  geneNameCol: string | null;
  genomeIdCol: string | null;
  targetAttributesCol: string | null;
  targetAttributesColDelimiter: string;
  additionalTargetInfoCols: readonly string[];
}

function resolveOptions(options: PanelInfoOptions): ResolvedOptions {
  return {
    panelName: options.panelName,
    targetNameCol: options.targetNameCol ?? "target_name",
    forwardPrimersSeqCol: options.forwardPrimersSeqCol ?? "fwd_primer",
    reversePrimersSeqCol: options.reversePrimersSeqCol ?? "rev_primer",
    reactionNameCol: options.reactionNameCol ?? null,
    reactionNameColDelimiter: options.reactionNameColDelimiter ?? ",",
    forwardPrimersStartCol: options.forwardPrimersStartCol ?? null,
    forwardPrimersEndCol: options.forwardPrimersEndCol ?? null,
    reversePrimersStartCol: options.reversePrimersStartCol ?? null,
    reversePrimersEndCol: options.reversePrimersEndCol ?? null,
    insertStartCol: options.insertStartCol ?? null,
    insertEndCol: options.insertEndCol ?? null,
    chromCol: options.chromCol ?? null,
    strandCol: options.strandCol ?? null,
    refSeqCol: options.refSeqCol ?? null,
    geneNameCol: options.geneNameCol ?? null,
    genomeIdCol: options.genomeIdCol ?? null,
    targetAttributesCol: options.targetAttributesCol ?? null,
    targetAttributesColDelimiter: options.targetAttributesColDelimiter ?? ",",
    additionalTargetInfoCols: options.additionalTargetInfoCols ?? [],
  };
}

/** `PMOPanelBuilder.check_location_columns`. Returns the set location columns, or `null` when none is. */
function checkLocationColumns(o: ResolvedOptions): (string | null)[] | null {
  const locationCols = [
    o.forwardPrimersStartCol,
    o.forwardPrimersEndCol,
    o.reversePrimersStartCol,
    o.reversePrimersEndCol,
    o.insertStartCol,
    o.insertEndCol,
    o.chromCol,
    o.strandCol,
    o.refSeqCol,
  ];
  // Python tests column names for truthiness here, so "" counts as unset.
  if (!locationCols.some((col) => col !== null && col !== "")) return null;
  const problems: string[] = [];
  if (!o.chromCol) {
    problems.push("If including location information, chromCol must be set.");
  }
  if ((o.forwardPrimersStartCol === null) !== (o.forwardPrimersEndCol === null)) {
    problems.push("If one of forwardPrimersStartCol or forwardPrimersEndCol is set, then both must be.");
  }
  if ((o.reversePrimersStartCol === null) !== (o.reversePrimersEndCol === null)) {
    problems.push("If one of reversePrimersStartCol or reversePrimersEndCol is set, then both must be.");
  }
  if ((o.insertStartCol === null) !== (o.insertEndCol === null)) {
    problems.push("If one of insertStartCol or insertEndCol is set, then both must be.");
  }
  if (problems.length > 0) {
    throw new PmoError(
      "panel/invalid-location-columns",
      `Errors with location column configuration:\n- ${problems.join("\n- ")}`,
      { problems },
    );
  }
  return locationCols;
}

/** Normalises `genomeInfo` the way Python does: falsy means none, a single genome becomes a list. */
function normaliseGenomeInfo(genomeInfo: unknown): GenomeInfoInput[] | null {
  if (!pyTruthy(genomeInfo)) return null;
  const list: unknown = isRecord(genomeInfo) ? [genomeInfo] : genomeInfo;
  checkGenomeInfo(list);
  if (!Array.isArray(list)) return null; // unreachable: checkGenomeInfo accepted a list
  return list.map((genome) => structuredClone(genome));
}

class TableReader {
  private readonly columns: ReadonlySet<string>;
  private readonly dtypes = new Map<string, PandasDtype>();

  constructor(private readonly table: Table) {
    this.columns = new Set(columnNames(table));
  }

  require(...names: (string | null)[]): void {
    const missing = names.filter((name): name is string => name !== null && !this.columns.has(name));
    if (missing.length > 0) {
      throw new PmoError("panel/missing-columns", `Columns not in the table: ${missing.join(", ")}`, {
        columns: [...new Set(missing)],
      });
    }
  }

  cell(row: Row, column: string): Cell {
    this.require(column);
    return row[column];
  }

  dtype(column: string): PandasDtype {
    let dtype = this.dtypes.get(column);
    if (dtype === undefined) {
      dtype = pandasDtype(columnValues(this.table, column));
      this.dtypes.set(column, dtype);
    }
    return dtype;
  }

  /** A cell as Python's `str()` would write it, or `null` when missing. */
  text(row: Row, column: string): string | null {
    const value = this.cell(row, column);
    return isPresent(value) ? pyStr(value, this.dtype(column)) : null;
  }
}

function nameKey(name: string | null): string {
  return name === null ? "\u0000missing" : `s${name}`;
}

/** `check_target_names_are_unique`: names compared as strings; two missing names are duplicates. */
function checkTargetNamesAreUnique(names: readonly (string | null)[]): void {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(nameKey(name), (counts.get(nameKey(name)) ?? 0) + 1);
  const duplicated: (string | null)[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const key = nameKey(name);
    if ((counts.get(key) ?? 0) > 1 && !seen.has(key)) {
      seen.add(key);
      duplicated.push(name);
    }
  }
  if (duplicated.length > 0) {
    throw new PmoError(
      "panel/duplicate-target-names",
      `The following target names are duplicated: ${duplicated.map(String).join(", ")}`,
      { targets: duplicated },
    );
  }
}

/**
 * `check_unique_target_info`: targets that share every value in `columns`.
 * Rows with a missing value in any of them are skipped, as pandas groupby
 * drops missing keys.
 */
function checkUniqueTargetInfo(table: Table, names: readonly (string | null)[], columns: readonly string[]): void {
  const groups = new Map<string, { values: PresentCell[]; targets: (string | null)[] }>();
  table.forEach((row, index) => {
    const values: PresentCell[] = [];
    for (const column of columns) {
      const value = row[column];
      if (!isPresent(value)) return;
      values.push(value);
    }
    const key = cellKey(values);
    let group = groups.get(key);
    if (group === undefined) {
      group = { values, targets: [] };
      groups.set(key, group);
    }
    group.targets.push(names[index] ?? null);
  });
  const duplicated = [...groups.values()].filter((group) => group.targets.length > 1);
  if (duplicated.length > 0) {
    const lines = duplicated.map((group) => {
      const info = columns.map((column, i) => `${column}=${String(group.values[i])}`).join(", ");
      return `targets: ${group.targets.map(String).join(", ")} → ${info}`;
    });
    throw new PmoError(
      "panel/duplicate-target-info",
      `The following targets have duplicated information:\n${lines.join("\n")}`,
      {
        columns: [...columns],
        groups: duplicated.map((group) => ({ targets: group.targets, values: group.values })),
      },
    );
  }
}

interface LocationColumns {
  start: string;
  end: string;
}

function buildLocation(
  reader: TableReader,
  row: Row,
  o: ResolvedOptions,
  chromCol: string,
  columns: LocationColumns,
  name: string | null,
  endFirst: boolean,
): LocationFragment {
  const genomeId = o.genomeIdCol ? pyInt(reader.cell(row, o.genomeIdCol), o.genomeIdCol, name) : 0;
  const chrom = reader.cell(row, chromCol);
  if (!isPresent(chrom)) throw new PmoError("panel/internal", "chrom was checked to be present");
  const start = pyInt(reader.cell(row, columns.start), columns.start, name);
  const end = pyInt(reader.cell(row, columns.end), columns.end, name);
  // Python writes the reverse primer's end before its start.
  const location: LocationFragment = endFirst
    ? { genome_id: genomeId, chrom, end, start }
    : { genome_id: genomeId, chrom, start, end };
  return location;
}

function addStrand(location: LocationFragment, reader: TableReader, row: Row, strandCol: string | null): void {
  if (!strandCol) return;
  const strand = reader.cell(row, strandCol);
  if (isPresent(strand)) location.strand = strand;
}

/** `build_target_info_dict` plus the missing-location summary it runs first. */
function buildTargetInfo(table: Table, reader: TableReader, o: ResolvedOptions, onWarning: PanelInfoOptions["onWarning"]): TargetFragment[] {
  reader.require(o.targetNameCol);
  const names = table.map((row) => reader.text(row, o.targetNameCol));
  checkTargetNamesAreUnique(names);

  const locationCols = [
    o.forwardPrimersStartCol,
    o.forwardPrimersEndCol,
    o.reversePrimersStartCol,
    o.reversePrimersEndCol,
    o.insertStartCol,
    o.insertEndCol,
    o.chromCol,
    o.strandCol,
    o.refSeqCol,
  ].filter((col): col is string => Boolean(col));
  const infoColumns = [...new Set([o.forwardPrimersSeqCol, o.reversePrimersSeqCol, ...locationCols])];
  reader.require(...infoColumns);
  checkUniqueTargetInfo(table, names, infoColumns);

  // summarise_targets_missing_optional_info
  const chromCol = o.chromCol ?? "";
  const missingRows = (label: string, start: string | null, end: string | null): Set<number> | null => {
    if (!start || end === null) return null;
    const indices = new Set<number>();
    table.forEach((row, index) => {
      if ([chromCol, start, end].some((column) => !isPresent(row[column]))) indices.add(index);
    });
    if (indices.size > 0) {
      const targets = [...indices].map((index) => names[index] ?? null);
      warn(
        onWarning,
        "panel/missing-location",
        `${label} location information was not added for the following targets that had empty fields: ${targets.map(String).join(", ")}`,
        { location: label, targets },
      );
    }
    return indices;
  };
  const missingInsert = missingRows("Insert", o.insertStartCol, o.insertEndCol);
  const missingForward = missingRows("Forward primer", o.forwardPrimersStartCol, o.forwardPrimersEndCol);
  const missingReverse = missingRows("Reverse primer", o.reversePrimersStartCol, o.reversePrimersEndCol);

  const attributeDtype = o.targetAttributesCol ? reader.dtype(o.targetAttributesCol) : "object";

  return table.map((row, index) => {
    const name = names[index] ?? null;

    let geneName: PresentCell | null = null;
    if (o.geneNameCol) geneName = cellOut(reader.cell(row, o.geneNameCol));

    let attributes: string[] | null = null;
    if (o.targetAttributesCol) {
      const value = reader.cell(row, o.targetAttributesCol);
      if (isPresent(value)) {
        const text = pyStr(value, attributeDtype);
        if (pyStrip(text) !== "") {
          attributes = pySplit(text, o.targetAttributesColDelimiter, "panel/invalid-delimiter");
        }
      }
    }

    const additional: Record<string, PresentCell | null> = {};
    for (const column of o.additionalTargetInfoCols) additional[column] = cellOut(row[column]);

    let insertLocation: LocationFragment | null = null;
    if (o.insertStartCol && o.insertEndCol && missingInsert !== null && !missingInsert.has(index)) {
      insertLocation = buildLocation(reader, row, o, chromCol, { start: o.insertStartCol, end: o.insertEndCol }, name, false);
      addStrand(insertLocation, reader, row, o.strandCol);
      if (o.refSeqCol) {
        const refSeq = reader.cell(row, o.refSeqCol);
        if (isPresent(refSeq)) insertLocation.ref_seq = refSeq;
      }
    }

    const forward: PrimerFragment = { seq: cellOut(row[o.forwardPrimersSeqCol]) };
    const reverse: PrimerFragment = { seq: cellOut(row[o.reversePrimersSeqCol]) };
    if (o.forwardPrimersStartCol && o.forwardPrimersEndCol && missingForward !== null && !missingForward.has(index)) {
      const location = buildLocation(
        reader,
        row,
        o,
        chromCol,
        { start: o.forwardPrimersStartCol, end: o.forwardPrimersEndCol },
        name,
        false,
      );
      addStrand(location, reader, row, o.strandCol);
      forward.location = location;
    }
    if (o.reversePrimersStartCol && o.reversePrimersEndCol && missingReverse !== null && !missingReverse.has(index)) {
      const location = buildLocation(
        reader,
        row,
        o,
        chromCol,
        { start: o.reversePrimersStartCol, end: o.reversePrimersEndCol },
        name,
        true,
      );
      addStrand(location, reader, row, o.strandCol);
      reverse.location = location;
    }

    // Key order follows Python's dict insertion order. An additional column
    // with the same name as a built-in key overwrites it in place, as in Python.
    const target: TargetFragment = {
      target_name: name,
      ...(o.geneNameCol && !isEmptyOptional(geneName) && geneName !== null ? { gene_name: geneName } : {}),
      ...(attributes !== null ? { target_attributes: attributes } : {}),
      ...additional,
      ...(insertLocation !== null ? { insert_location: insertLocation } : {}),
      forward_primer: forward,
      reverse_primer: reverse,
    };
    return target;
  });
}

/** `build_panel_info_dict`. Target names are unique by now, so a row's target index is its row index. */
function buildPanelInfo(table: Table, reader: TableReader, o: ResolvedOptions): PanelFragment {
  const reactionCol = o.reactionNameCol;
  if (!reactionCol) {
    return { panel_name: o.panelName, reactions: [{ reaction_name: "full", panel_targets: table.map((_, i) => i) }] };
  }
  reader.require(reactionCol);
  const split = makePandasSplitter(o.reactionNameColDelimiter);
  // Python cannot split non-text cells (.str gives NaN or raises); here they
  // are read as text. Missing cells belong to no reaction.
  const pieces = table.map((row) => {
    const text = reader.text(row, reactionCol);
    return text === null ? null : split(text).map(pyStrip);
  });
  const reactionNames: string[] = [];
  const seen = new Set<string>();
  for (const rowPieces of pieces) {
    for (const piece of rowPieces ?? []) {
      if (!seen.has(piece)) {
        seen.add(piece);
        reactionNames.push(piece);
      }
    }
  }
  return {
    panel_name: o.panelName,
    reactions: reactionNames.map((reaction) => ({
      reaction_name: reaction,
      panel_targets: pieces.flatMap((rowPieces, index) => (rowPieces?.includes(reaction) ? [index] : [])),
    })),
  };
}

/**
 * Builds the panel part of a PMO from a table with one row per target.
 *
 * Port of `panel_info_table_to_pmo`. Throws `PmoError` for an unusable table
 * or configuration (codes `panel/...`), and reports targets whose location
 * cells are incomplete through `onWarning` (`panel/missing-location`); those
 * targets are written without that location.
 *
 * Differences from Python: target and reaction names are written as strings;
 * a missing reaction cell puts the target in no reaction instead of creating
 * a reaction with no name; the table is never modified.
 *
 * @example
 * const fragment = panelInfoTableToPmo(rows, {
 *   panelName: "mad4hatter",
 *   targetNameCol: "amplicon",
 *   genomeInfo: { name: "3D7", genome_version: "3", taxon_id: 5833, url: "https://..." },
 * });
 */
export function panelInfoTableToPmo(table: Table, options: PanelInfoOptions): PanelInfoFragment {
  if (!Array.isArray(table)) throw new PmoError("panel/invalid-table", "The target table must be an array of rows.");
  const o = resolveOptions(options);

  if (o.additionalTargetInfoCols.length > 0) {
    const present = new Set(columnNames(table));
    const missing = [...new Set(o.additionalTargetInfoCols)].filter((column) => !present.has(column));
    if (missing.length > 0) {
      throw new PmoError("panel/missing-additional-columns", `Missing additional columns: ${missing.join(", ")}`, {
        columns: missing,
      });
    }
  }
  checkLocationColumns(o);
  const genomes = normaliseGenomeInfo(options.genomeInfo);

  // Python fails on an empty table too (inside pandas).
  if (table.length === 0) throw new PmoError("panel/empty-table", "The target table has no rows.");

  const reader = new TableReader(table);
  const targets = buildTargetInfo(table, reader, o, options.onWarning);
  if (genomes === null) {
    for (const target of targets) {
      const kind = target.insert_location
        ? "insert_location"
        : target.forward_primer.location
          ? "forward primer location"
          : target.reverse_primer.location
            ? "reverse primer location"
            : null;
      if (kind !== null) {
        throw new PmoError(
          "panel/location-without-genome",
          `${kind} is provided for ${String(target.target_name)} but genomeInfo is not.`,
          { target: target.target_name },
        );
      }
    }
  }
  const panel = buildPanelInfo(table, reader, o);
  removeOptionalNullValues(targets, ["gene_name", "insert_location", "markers_of_interest", "target_attributes"]);
  const fragment: PanelInfoFragment = { panel_info: [panel], target_info: targets };
  if (genomes !== null) {
    fragment.targeted_genomes = genomes;
    // Python runs this on target_info too; it only matters for additional
    // columns that happen to be named chromosomes or gff_url.
    removeOptionalNullValues(targets, ["chromosomes", "gff_url"]);
  }
  return fragment;
}

// ---------------------------------------------------------------------------
// merge_panel_info_dicts
// ---------------------------------------------------------------------------

/** JSON with object keys sorted, used as a genome's identity (Python: `json.dumps(sort_keys=True)`). */
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (isRecord(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return canonicalJson(a) === canonicalJson(b);
}

function remapGenomeIds(target: Record<string, unknown>, mapping: ReadonlyMap<number, number>): void {
  const remap = (location: unknown): void => {
    if (!isRecord(location) || !Object.hasOwn(location, "genome_id")) return;
    const old = location["genome_id"];
    if (typeof old === "number") {
      const next = mapping.get(old);
      if (next !== undefined) location["genome_id"] = next;
    }
  };
  remap(target["insert_location"]);
  for (const key of ["forward_primer", "reverse_primer"]) {
    const primer = target[key];
    if (isRecord(primer)) remap(primer["location"]);
  }
}

function nameText(name: unknown): string {
  if (typeof name === "string") return name;
  if (typeof name === "number" || typeof name === "boolean") return pyStr(name, "object");
  return canonicalJson(name);
}

function isPrimer(value: unknown): value is PrimerFragment {
  return isRecord(value);
}

function toTargetFragment(record: Record<string, unknown>, name: string): TargetFragment {
  const forward = record["forward_primer"];
  const reverse = record["reverse_primer"];
  if (!isPrimer(forward) || !isPrimer(reverse)) {
    throw new PmoError(
      "panel/malformed-target",
      `Target ${name} must have forward_primer and reverse_primer objects.`,
      { target: name },
    );
  }
  return { ...record, target_name: name, forward_primer: forward, reverse_primer: reverse };
}

function malformed(message: string, details: Record<string, unknown> = {}): PmoError {
  return new PmoError("panel/malformed-panel-info", message, details);
}

/**
 * Merges several panel fragments, as made by {@link panelInfoTableToPmo},
 * into one.
 *
 * Port of `merge_panel_info_dicts`. Targets are combined by name (names are
 * compared as strings); the first definition of a name wins. When a later
 * panel defines the same name differently, the later definition is dropped as
 * in Python, and pmotools-ts also reports `panel/conflicting-target-definition`
 * through `onWarning`. Identical genomes are merged and `genome_id`s
 * renumbered. The input is not modified.
 *
 * Takes `unknown` entries because saved panels usually come back from
 * storage; anything that is not a usable fragment throws `PmoError`.
 */
export function mergePanelInfoDicts(panels: readonly unknown[], options: WarningOptions = {}): PanelInfoFragment {
  if (!Array.isArray(panels) || panels.length === 0) {
    throw new PmoError("panel/no-panels", "At least one panel is needed to merge.");
  }

  const mergedTargets: TargetFragment[] = [];
  const nameToIndex = new Map<string, number>();
  const mergedPanels: PanelFragment[] = [];
  const mergedGenomes: GenomeInfoInput[] = [];
  const genomeIndex = new Map<string, number>();

  panels.forEach((panelDict: unknown, panelIndex) => {
    if (!isRecord(panelDict)) throw malformed(`Panel ${panelIndex} is not an object.`, { panel: panelIndex });

    const hasGenomes = Object.hasOwn(panelDict, "targeted_genomes");
    const mapping = new Map<number, number>();
    if (hasGenomes) {
      const genomes = panelDict["targeted_genomes"];
      if (!Array.isArray(genomes)) throw malformed(`Panel ${panelIndex} targeted_genomes is not a list.`, { panel: panelIndex });
      genomes.forEach((genome: unknown, index) => {
        if (!isRecord(genome)) throw malformed(`Panel ${panelIndex} genome ${index} is not an object.`, { panel: panelIndex });
        const signature = canonicalJson(genome);
        let merged = genomeIndex.get(signature);
        if (merged === undefined) {
          merged = mergedGenomes.length;
          genomeIndex.set(signature, merged);
          mergedGenomes.push(structuredClone(genome));
        }
        mapping.set(index, merged);
      });
    }

    const targetInfo = panelDict["target_info"];
    if (!Object.hasOwn(panelDict, "target_info")) {
      throw new PmoError("panel/missing-target-info", `Panel ${panelIndex} is missing target_info.`, { panel: panelIndex });
    }
    if (!Array.isArray(targetInfo)) throw malformed(`Panel ${panelIndex} target_info is not a list.`, { panel: panelIndex });

    const localNames: string[] = targetInfo.map((target: unknown) => {
      if (!isRecord(target)) throw malformed(`Panel ${panelIndex} has a target that is not an object.`, { panel: panelIndex });
      const rawName = target["target_name"];
      if (rawName === null || rawName === undefined) {
        throw new PmoError("panel/missing-target-name", "Each target_info entry must include a target_name.", {
          panel: panelIndex,
        });
      }
      const name = nameText(rawName);
      const copy = structuredClone(target);
      if (hasGenomes) {
        remapGenomeIds(copy, mapping);
      }
      const existing = nameToIndex.get(name);
      if (existing === undefined) {
        if (!hasGenomes) {
          const forward = copy["forward_primer"];
          const reverse = copy["reverse_primer"];
          if (!isRecord(forward) || !isRecord(reverse)) {
            throw new PmoError("panel/malformed-target", `Target ${name} must have forward_primer and reverse_primer objects.`, {
              target: name,
            });
          }
          const kind = Object.hasOwn(copy, "insert_location")
            ? "insert_location"
            : Object.hasOwn(forward, "location")
              ? "forward primer location"
              : Object.hasOwn(reverse, "location")
                ? "reverse primer location"
                : null;
          if (kind !== null) {
            throw new PmoError(
              "panel/location-without-genome",
              `Target ${name} has ${kind} but its panel has no targeted_genomes.`,
              { target: name, panel: panelIndex },
            );
          }
        }
        nameToIndex.set(name, mergedTargets.length);
        mergedTargets.push(toTargetFragment(copy, name));
      } else {
        const kept = mergedTargets[existing];
        if (!deepEqual({ ...copy, target_name: name }, kept)) {
          warn(
            options.onWarning,
            "panel/conflicting-target-definition",
            `Target ${name} in panel ${panelIndex} differs from its first definition; the first definition is kept.`,
            { target: name, panel: panelIndex },
          );
        }
      }
      return name;
    });

    const panelInfo = Object.hasOwn(panelDict, "panel_info") ? panelDict["panel_info"] : [];
    if (!Array.isArray(panelInfo)) throw malformed(`Panel ${panelIndex} panel_info is not a list.`, { panel: panelIndex });
    for (const panel of panelInfo) {
      if (!isRecord(panel) || !Object.hasOwn(panel, "panel_name")) {
        throw malformed(`Panel ${panelIndex} has a panel_info entry without panel_name.`, { panel: panelIndex });
      }
      const panelName = panel["panel_name"];
      const reactions = Object.hasOwn(panel, "reactions") ? panel["reactions"] : [];
      if (!Array.isArray(reactions)) throw malformed(`Panel ${panelIndex} reactions is not a list.`, { panel: panelIndex });
      mergedPanels.push({
        panel_name: typeof panelName === "string" ? panelName : nameText(panelName),
        reactions: reactions.map((reaction: unknown) => {
          if (!isRecord(reaction) || !Array.isArray(reaction["panel_targets"]) || !Object.hasOwn(reaction, "reaction_name")) {
            throw malformed(`Panel ${panelIndex} has a reaction without reaction_name or panel_targets.`, { panel: panelIndex });
          }
          const reactionName = reaction["reaction_name"];
          return {
            reaction_name: typeof reactionName === "string" ? reactionName : nameText(reactionName),
            panel_targets: reaction["panel_targets"].map((targetIndex: unknown) => {
              // Python list indexing: negative indexes count from the end.
              const position =
                typeof targetIndex === "number" && Number.isInteger(targetIndex)
                  ? targetIndex < 0
                    ? localNames.length + targetIndex
                    : targetIndex
                  : -1;
              const name = localNames[position];
              const merged = name === undefined ? undefined : nameToIndex.get(name);
              if (merged === undefined) {
                throw new PmoError(
                  "panel/invalid-target-index",
                  `Panel ${panelIndex} reaction refers to target index ${String(targetIndex)}, which does not exist.`,
                  { panel: panelIndex, index: targetIndex },
                );
              }
              return merged;
            }),
          };
        }),
      });
    }
  });

  const result: PanelInfoFragment = { panel_info: mergedPanels, target_info: mergedTargets };
  if (mergedGenomes.length > 0) result.targeted_genomes = mergedGenomes;
  return result;
}
