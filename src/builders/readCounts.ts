/**
 * Read counts by stage: port of pmotools-python
 * `pmo_builder/read_count_by_stage_table_to_pmo.py`.
 *
 * Turns a table of total raw reads per library sample, and optionally a table
 * of reads per sample, target and pipeline stage, into the PMO
 * `read_counts_by_stage` section. The output still uses names where final PMO
 * uses indexes; merging resolves them.
 */
import { PmoError, warn, type WarningOptions } from "../errors.js";
import { hasColumn, isPresent, missingColumns, type Cell, type PresentCell, type Row, type Table } from "../table/core.js";

const MODULE = "read-counts";

/** Options for {@link readCountByStageTableToPmo}. Defaults match pmotools-python. */
export interface ReadCountByStageOptions extends WarningOptions {
  /**
   * Table of reads per library sample, target and stage. In long format it has
   * one stage column; in wide format one column per stage (see `stageCol`).
   * Omit it to record total raw counts only.
   */
  readonly readsByStageTable?: Table | null;
  /**
   * The run name to record. When it is also a column of the total-raw-count
   * table, the tables are split on that column instead and each distinct value
   * becomes one run; the reads table is split too if it has the column, and is
   * otherwise shared by every run.
   */
  readonly bioinformaticsRunName?: string | null;
  /** Library sample name column, in both tables. Default `library_sample_name`. */
  readonly librarySampleNameCol?: string;
  /** Target name column in the reads table. Default `target_name`. */
  readonly targetNameCol?: string;
  /** Total raw count column in the total-raw-count table. Default `total_raw_count`. */
  readonly totalRawCountCol?: string;
  /**
   * Stage column (long format), or the list of per-stage count columns (wide
   * format, reshaped like `pd.melt`, stages in list order). Default `stage`.
   */
  readonly stageCol?: string | readonly string[];
  /** Read count column in long format, and the melted value name in wide format. Default `read_count`. */
  readonly readCountCol?: string;
  /** Total-raw-count columns copied onto each library sample entry when present. */
  readonly additionalLibrarySampleCols?: readonly string[] | null;
  /** Reads columns copied onto each stage entry when present. */
  readonly additionalTargetCols?: readonly string[] | null;
}

/** Reads for one stage. Additional target columns are added as extra keys. */
export interface StageReadCountsByName {
  stage: string;
  reads: number;
  [column: string]: unknown;
}

/** Stage counts for one target, named rather than indexed. */
export interface TargetReadCountsByName {
  target_name: string;
  stages: StageReadCountsByName[];
}

/**
 * Counts for one library sample. Additional library sample columns are added
 * as extra keys; as in Python, one named like a built-in key replaces it.
 */
export interface LibrarySampleReadCountsByName {
  library_sample_name: string;
  total_raw_count: number;
  read_counts_for_targets?: TargetReadCountsByName[];
  [column: string]: unknown;
}

/** One run's `read_counts_by_stage` entry, with names instead of PMO indexes. */
export interface ReadCountsByStageByName {
  read_counts_by_library_sample_by_stage: LibrarySampleReadCountsByName[];
  bioinformatics_run_name?: string;
}

/** What {@link readCountByStageTableToPmo} returns: one entry per run. */
export type ReadCountByStageResult = ReadCountsByStageByName[];

/** A reads-table row together with its position in the caller's table. */
interface SourceRow {
  readonly row: Row;
  readonly index: number;
}

interface SampleInfo {
  readonly name: string;
  readonly totalRawCount: number;
  readonly extras: readonly (readonly [string, PresentCell])[];
}

interface StageEntry {
  readonly stage: string | null;
  data: StageReadCountsByName;
}

interface TargetEntry {
  readonly target: string | null;
  readonly stages: Map<string | null, StageEntry>;
}

type ReadsData = Map<string | null, Map<string | null, TargetEntry>>;

interface DuplicateStage {
  readonly library_sample_name: string | null;
  readonly target_name: string | null;
  readonly stage: string | null;
}

interface Columns {
  readonly sample: string;
  readonly target: string;
  readonly totalRawCount: string;
  readonly stage: string | readonly string[];
  readonly readCount: string;
  readonly additionalSample: readonly string[];
  readonly additionalTarget: readonly string[];
}

function fail(reason: string, message: string, details: Record<string, unknown> = {}): never {
  throw new PmoError(`${MODULE}/${reason}`, message, details);
}

/** Names are compared and written as strings. Missing names are `null`. */
function nameOf(value: Cell): string | null {
  return isPresent(value) ? String(value) : null;
}

/** Sets an own enumerable key, even `__proto__`. An existing key keeps its position. */
function setKey(target: object, key: string, value: unknown): void {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}

function withoutColumn(row: Row, column: string): Row {
  return Object.fromEntries(Object.entries(row).filter(([key]) => key !== column));
}

/**
 * Python's `int(value)`: truncates numbers, maps booleans to 1 and 0, and
 * parses integer strings. Missing values and anything else throw.
 */
function toInt(value: Cell, column: string, table: string, row: number): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value) + 0;
  if (typeof value === "string") {
    const text = value.trim();
    if (/^[+-]?\d+(?:_\d+)*$/.test(text)) return Number(text.replace(/_/g, "")) + 0;
  }
  return fail("invalid-count", `${table} column ${column} needs a whole number in row ${row + 1}, got ${String(value)}.`, {
    table,
    column,
    row,
    value: isPresent(value) ? value : null,
  });
}

/** Required columns, checked only on tables with rows: an empty `Table` has no columns. */
function requireColumns(table: Table, columns: readonly string[], label: string): void {
  if (table.length === 0) return;
  const missing = missingColumns(table, columns);
  if (missing.length > 0) {
    fail("missing-columns", `Missing required columns in ${label}: ${missing.join(", ")}`, {
      table: label,
      columns: missing,
    });
  }
}

function requireAdditionalColumns(table: Table, columns: readonly string[], label: string): void {
  if (table.length === 0) return;
  const missing = missingColumns(table, columns);
  if (missing.length > 0) {
    fail("missing-additional-columns", `Missing additional columns in ${label}: ${missing.join(", ")}`, {
      table: label,
      columns: missing,
    });
  }
}

/** Port of `_process_total_raw_count_table`. Keys are library sample names. */
function processTotals(table: Table, columns: Columns): Map<string, SampleInfo> {
  const label = "total_raw_count_table";
  requireColumns(table, [columns.sample, columns.totalRawCount], label);

  const counts = new Map<string | null, number>();
  for (const row of table) {
    const name = nameOf(row[columns.sample]);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const duplicates = [...counts].filter(([, count]) => count > 1).map(([name]) => name);
  if (duplicates.length > 0) {
    fail(
      "duplicate-library-sample-names",
      `Duplicate library sample names found in ${label}: ${duplicates.map(String).join(", ")}`,
      { names: duplicates },
    );
  }

  const samples = new Map<string, SampleInfo>();
  table.forEach((row, index) => {
    const name = nameOf(row[columns.sample]);
    if (name === null) {
      fail("missing-name", `${label} row ${index + 1} has no library sample name in column ${columns.sample}.`, {
        table: label,
        column: columns.sample,
        row: index,
      });
    }
    const totalRawCount = toInt(row[columns.totalRawCount], columns.totalRawCount, label, index);
    const extras: (readonly [string, PresentCell])[] = [];
    for (const column of columns.additionalSample) {
      const value = row[column];
      if (Object.hasOwn(row, column) && isPresent(value)) extras.push([column, value]);
    }
    samples.set(name, { name, totalRawCount, extras });
  });
  return samples;
}

/** One long-format record, from a long row or one melted cell of a wide row. */
interface LongRecord {
  readonly sample: Cell;
  readonly target: Cell;
  readonly stage: Cell;
  readonly count: Cell;
  readonly source: SourceRow;
}

/** The long-format records `pd.melt` would produce, in the same order. */
function meltWide(rows: readonly SourceRow[], stageColumns: readonly string[], columns: Columns): LongRecord[] {
  const label = "reads_by_stage_table";
  const table = rows.map((source) => source.row);
  const idColumns = [columns.sample, columns.target, ...columns.additionalTarget];
  if (table.length > 0) {
    const missing = missingColumns(table, [...idColumns, ...stageColumns]);
    if (missing.length > 0) {
      fail("missing-columns", `Missing required columns in ${label}: ${missing.join(", ")}`, {
        table: label,
        columns: missing,
      });
    }
    if (hasColumn(table, columns.readCount)) {
      fail(
        "column-conflict",
        `Wide-format ${label} already has a column named ${columns.readCount}, the read count column name.`,
        { table: label, column: columns.readCount },
      );
    }
    const repeated = idColumns.filter((column, index) => idColumns.indexOf(column) !== index);
    if (repeated.length > 0) {
      fail("column-conflict", `Wide-format ${label} lists these columns twice: ${repeated.join(", ")}`, {
        table: label,
        columns: repeated,
      });
    }
  }

  const valueColumns = [...new Set(stageColumns)].filter((column) => !idColumns.includes(column));
  const records: LongRecord[] = [];
  for (const stage of valueColumns) {
    for (const source of rows) {
      records.push({
        sample: source.row[columns.sample],
        target: source.row[columns.target],
        stage,
        count: source.row[stage],
        source,
      });
    }
  }
  if (records.length > 0 && (idColumns.includes("stage") || columns.readCount === "stage")) {
    fail("column-conflict", `Wide-format ${label} cannot use the column name stage, which melting creates.`, {
      table: label,
      column: "stage",
    });
  }
  return records;
}

/** Port of `_process_reads_by_stage_table`. */
function processReads(
  rows: readonly SourceRow[],
  columns: Columns,
  duplicates: Map<string, DuplicateStage>,
): ReadsData {
  const label = "reads_by_stage_table";
  let records: LongRecord[];
  if (typeof columns.stage === "string") {
    const stageColumn = columns.stage;
    requireColumns(
      rows.map((source) => source.row),
      [columns.sample, columns.target, stageColumn, columns.readCount],
      label,
    );
    records = rows.map((source) => ({
      sample: source.row[columns.sample],
      target: source.row[columns.target],
      stage: source.row[stageColumn],
      count: source.row[columns.readCount],
      source,
    }));
  } else {
    records = meltWide(rows, columns.stage, columns);
  }

  const data: ReadsData = new Map();
  for (const record of records) {
    const sample = nameOf(record.sample);
    const target = nameOf(record.target);
    const stage = nameOf(record.stage);
    const reads = toInt(record.count, columns.readCount, label, record.source.index);

    let targets = data.get(sample);
    if (targets === undefined) {
      targets = new Map();
      data.set(sample, targets);
    }
    let targetEntry = targets.get(target);
    if (targetEntry === undefined) {
      targetEntry = { target, stages: new Map() };
      targets.set(target, targetEntry);
    }

    const stageData: StageReadCountsByName = { stage: stage ?? "", reads };
    for (const column of columns.additionalTarget) {
      const value = record.source.row[column];
      if (Object.hasOwn(record.source.row, column) && isPresent(value)) setKey(stageData, column, value);
    }

    const existing = targetEntry.stages.get(stage);
    if (existing === undefined) {
      targetEntry.stages.set(stage, { stage, data: stageData });
    } else {
      // Python overwrites the dict value: the stage keeps its first position, the last row wins.
      existing.data = stageData;
      const duplicate = { library_sample_name: sample, target_name: target, stage };
      duplicates.set(JSON.stringify(duplicate), duplicate);
    }
  }
  return data;
}

/** Port of `_build_read_counts_by_stage_output`. */
function buildOutput(
  samples: Map<string, SampleInfo>,
  reads: ReadsData | null,
  runName: string | null,
): ReadCountsByStageByName {
  const entries: LibrarySampleReadCountsByName[] = [];
  for (const [name, info] of samples) {
    const entry: LibrarySampleReadCountsByName = { library_sample_name: name, total_raw_count: info.totalRawCount };
    for (const [column, value] of info.extras) setKey(entry, column, value);

    const targets: TargetReadCountsByName[] = [];
    for (const targetEntry of reads?.get(name)?.values() ?? []) {
      if (targetEntry.target === null) {
        fail("missing-name", `reads_by_stage_table has a row for library sample ${name} with no target name.`, {
          library_sample_name: name,
        });
      }
      const stages: StageReadCountsByName[] = [];
      for (const stageEntry of targetEntry.stages.values()) {
        if (stageEntry.stage === null) {
          fail(
            "missing-name",
            `reads_by_stage_table has a row for library sample ${name}, target ${targetEntry.target} with no stage.`,
            { library_sample_name: name, target_name: targetEntry.target },
          );
        }
        stages.push(stageEntry.data);
      }
      targets.push({ target_name: targetEntry.target, stages });
    }
    if (targets.length > 0) setKey(entry, "read_counts_for_targets", targets);
    entries.push(entry);
  }

  const output: ReadCountsByStageByName = { read_counts_by_library_sample_by_stage: entries };
  if (runName !== null) output.bioinformatics_run_name = runName;
  return output;
}

function isTable(value: unknown): value is Table {
  return Array.isArray(value) && value.every((row) => typeof row === "object" && row !== null && !Array.isArray(row));
}

/**
 * Builds the PMO `read_counts_by_stage` section from a total-raw-count table
 * and, optionally, a reads-by-stage table. Port of pmotools-python
 * `read_count_by_stage_table_to_pmo`.
 *
 * Always returns a list: one entry, or one per run when
 * `bioinformaticsRunName` names a column of the total-raw-count table.
 * Library samples come in total-table order; targets and stages in order of
 * first appearance (wide format: stages in `stageCol` order).
 *
 * Throws {@link PmoError} for missing columns, duplicate library sample names,
 * counts that are not whole numbers, and missing names that would be written.
 * Warns through `onWarning` when reads rows are dropped because their sample
 * (`read-counts/unmatched-library-samples`) or run
 * (`read-counts/unmatched-runs`) is not in the totals, and when a repeated
 * sample, target and stage replaces an earlier count
 * (`read-counts/duplicate-stages`).
 *
 * @example
 * const [run] = readCountByStageTableToPmo(rawCounts, {
 *   readsByStageTable: readsPerStage,
 *   bioinformaticsRunName: "run1",
 *   librarySampleNameCol: "sample",
 *   totalRawCountCol: "raw_count",
 *   targetNameCol: "target",
 *   readCountCol: "reads",
 * });
 */
export function readCountByStageTableToPmo(
  totalRawCountTable: Table,
  options: ReadCountByStageOptions = {},
): ReadCountByStageResult {
  if (!isTable(totalRawCountTable)) {
    fail("invalid-table", "total_raw_count_table must be a table (an array of rows).");
  }
  const readsTable = options.readsByStageTable ?? null;
  if (readsTable !== null && !isTable(readsTable)) {
    fail("invalid-table", "reads_by_stage_table must be a table (an array of rows) or omitted.");
  }

  const columns: Columns = {
    sample: options.librarySampleNameCol ?? "library_sample_name",
    target: options.targetNameCol ?? "target_name",
    totalRawCount: options.totalRawCountCol ?? "total_raw_count",
    stage: options.stageCol ?? "stage",
    readCount: options.readCountCol ?? "read_count",
    additionalSample: options.additionalLibrarySampleCols ?? [],
    additionalTarget: options.additionalTargetCols ?? [],
  };
  requireAdditionalColumns(totalRawCountTable, columns.additionalSample, "total_raw_count_table");
  if (readsTable !== null) requireAdditionalColumns(readsTable, columns.additionalTarget, "reads_by_stage_table");

  const readsRows: SourceRow[] = (readsTable ?? []).map((row, index) => ({ row, index }));
  const runName = options.bioinformaticsRunName ?? null;
  const duplicates = new Map<string, DuplicateStage>();
  const considered = new Set<number>();
  const matched = new Set<number>();
  const output: ReadCountByStageResult = [];

  const runOne = (totals: Table, reads: readonly SourceRow[] | null, name: string | null): void => {
    const samples = processTotals(totals, columns);
    const data = reads === null ? null : processReads(reads, columns, duplicates);
    output.push(buildOutput(samples, data, name));
    for (const source of reads ?? []) {
      considered.add(source.index);
      const sample = nameOf(source.row[columns.sample]);
      if (sample !== null && samples.has(sample)) matched.add(source.index);
    }
  };

  const runColumn = runName !== null && hasColumn(totalRawCountTable, runName) ? runName : null;
  if (runColumn === null) {
    runOne(totalRawCountTable, readsTable === null ? null : readsRows, runName);
  } else {
    const runs: string[] = [];
    totalRawCountTable.forEach((row, index) => {
      const run = nameOf(row[runColumn]);
      if (run === null) {
        fail("missing-name", `total_raw_count_table row ${index + 1} has no run name in column ${runColumn}.`, {
          table: "total_raw_count_table",
          column: runColumn,
          row: index,
        });
      }
      if (!runs.includes(run)) runs.push(run);
    });
    const readsSplit = readsTable !== null && hasColumn(readsTable, runColumn);
    for (const run of runs) {
      const totals = totalRawCountTable
        .filter((row) => nameOf(row[runColumn]) === run)
        .map((row) => withoutColumn(row, runColumn));
      let reads: SourceRow[] | null = null;
      if (readsTable !== null) {
        reads = readsSplit
          ? readsRows
              .filter((source) => nameOf(source.row[runColumn]) === run)
              .map((source) => ({ row: withoutColumn(source.row, runColumn), index: source.index }))
          : readsRows;
      }
      runOne(totals, reads, run);
    }
    if (readsSplit) {
      const unknownRuns = [
        ...new Set(readsRows.filter((source) => !considered.has(source.index)).map((source) => nameOf(source.row[runColumn]))),
      ];
      if (unknownRuns.length > 0) {
        warn(
          options.onWarning,
          `${MODULE}/unmatched-runs`,
          `Dropped reads_by_stage_table rows whose ${runColumn} is not a run in total_raw_count_table: ${unknownRuns.map(String).join(", ")}`,
          { column: runColumn, runs: unknownRuns },
        );
      }
    }
  }

  const unmatchedSamples = [
    ...new Set(
      readsRows
        .filter((source) => considered.has(source.index) && !matched.has(source.index))
        .map((source) => nameOf(source.row[columns.sample])),
    ),
  ];
  if (unmatchedSamples.length > 0) {
    warn(
      options.onWarning,
      `${MODULE}/unmatched-library-samples`,
      `Dropped reads_by_stage_table rows for library samples not in total_raw_count_table: ${unmatchedSamples.map(String).join(", ")}`,
      { names: unmatchedSamples },
    );
  }
  if (duplicates.size > 0) {
    const list = [...duplicates.values()];
    warn(
      options.onWarning,
      `${MODULE}/duplicate-stages`,
      `Repeated library sample, target and stage in reads_by_stage_table; the last count was kept for ${list.length} of them.`,
      { duplicates: list },
    );
  }
  return output;
}
