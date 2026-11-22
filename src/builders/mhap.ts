/**
 * Microhaplotype table to PMO fragment. Port of
 * `pmotools.pmo_builder.mhap_table_to_pmo.mhap_table_to_pmo` and its helpers
 * (pmotools-python v1.2.2).
 *
 * The result is the name-keyed fragment Python returns, not final PMO:
 * representative targets carry `target_name`, detected entries carry
 * `library_sample_name` and `bioinformatics_run_name`. The merge step turns
 * those names into indices.
 */
import { PmoError, warn, type WarningOptions, type WarningSink } from "../errors.js";
import {
  cellKey,
  cellMapKey,
  compareCells,
  isPresent,
  type Cell,
  type PresentCell,
  type Row,
  type Table,
} from "../table/core.js";

/** Options for {@link mhapTableToPmo}. Column options name columns of the input table. */
export interface MhapTableToPmoOptions extends WarningOptions {
  /**
   * When this names a column, the table is split per distinct value of that
   * column (first-seen order) and each value becomes a run name. Otherwise
   * it is the literal run name for every row. Omitted: no run name is written.
   */
  readonly bioinformaticsRunName?: string | null;
  /** Default `"library_sample_name"`. */
  readonly librarySampleNameCol?: string;
  /** Default `"target_name"`. */
  readonly targetNameCol?: string;
  /** Default `"seq"`. */
  readonly seqCol?: string;
  /** Default `"reads"`. */
  readonly readsCol?: string;
  /** Genome ID written into `mhap_location`. Default `0`. */
  readonly genomeId?: number;
  readonly umisCol?: string | null;
  /** Location columns: `chromCol`, `startCol` and `endCol` go together. */
  readonly chromCol?: string | null;
  readonly startCol?: string | null;
  readonly endCol?: string | null;
  readonly refSeqCol?: string | null;
  readonly strandCol?: string | null;
  readonly altAnnotationsCol?: string | null;
  /** The three masking columns go together. Each cell is a delimited list of integers. */
  readonly maskingSeqStartCol?: string | null;
  readonly maskingSeqSegmentSizeCol?: string | null;
  readonly maskingReplacementSizeCol?: string | null;
  /** Default `","`. */
  readonly maskingDelim?: string;
  readonly microhaplotypeNameCol?: string | null;
  /** When set, a pseudocigar ref_loc chrom, start and end column must be available. */
  readonly pseudocigarCol?: string | null;
  /** Defaults to `chromCol`. */
  readonly pseudocigarChromCol?: string | null;
  readonly pseudocigarStartCol?: string | null;
  readonly pseudocigarEndCol?: string | null;
  readonly pseudocigarRefSeqCol?: string | null;
  readonly pseudocigarStrandCol?: string | null;
  /** Defaults to `genomeId`. */
  readonly pseudocigarGenomeId?: number | null;
  readonly pseudocigarGenerationDescriptionCol?: string | null;
  readonly qualityCol?: string | null;
  /** Extra columns copied onto each representative microhaplotype (falsy values are left out, as in Python). */
  readonly additionalRepresentativeMhapCols?: readonly string[] | null;
  /**
   * Extra columns copied onto each detected microhaplotype. Named as after
   * renaming, so the reads column is `"reads"`, not `readsCol`.
   */
  readonly additionalMhapDetectedCols?: readonly string[] | null;
}

/** A genomic location built from table cells. */
export interface MhapGenomicLocation {
  readonly genome_id: number;
  readonly chrom: PresentCell;
  readonly start: PresentCell;
  readonly end: PresentCell;
  readonly ref_seq?: PresentCell;
  readonly strand?: PresentCell;
}

/** One masked segment of a representative microhaplotype. */
export interface MhapMasking {
  readonly seq_start: number;
  readonly seq_segment_size: number;
  readonly replacement_size: number;
}

/** A pseudocigar with the location it is relative to. */
export interface MhapPseudocigar {
  readonly pseudocigar_seq: PresentCell;
  readonly ref_loc: MhapGenomicLocation;
  readonly pseudocigar_generation_description?: PresentCell;
}

/** One representative microhaplotype. Extra columns appear as further keys. */
export interface RepresentativeMhap {
  readonly seq: PresentCell;
  readonly alt_annotations?: PresentCell;
  readonly microhaplotype_name?: PresentCell;
  readonly pseudocigar?: MhapPseudocigar;
  readonly quality?: PresentCell;
  readonly masking?: readonly MhapMasking[];
  readonly [column: string]: unknown;
}

/** One target's representative microhaplotypes, keyed by name. */
export interface RepresentativeMhapTarget {
  readonly target_name: string;
  readonly microhaplotypes: readonly RepresentativeMhap[];
  readonly mhap_location?: MhapGenomicLocation;
}

/** One detected microhaplotype. Extra columns appear as further keys. */
export interface DetectedMhap {
  /** Index into the target's `microhaplotypes`. */
  readonly mhap_id: number;
  readonly reads: PresentCell;
  readonly umis?: PresentCell;
  readonly [column: string]: unknown;
}

/** Detected microhaplotypes for one target of one library sample. */
export interface DetectedTargetResult {
  /** Index into `representative_microhaplotypes.targets`, not into the panel. */
  readonly mhaps_target_id: number;
  readonly mhaps: readonly DetectedMhap[];
}

/** One library sample's detected microhaplotypes, keyed by name. */
export interface DetectedLibrarySample {
  readonly library_sample_name: string;
  readonly target_results: readonly DetectedTargetResult[];
}

/** Detected microhaplotypes for one bioinformatics run. */
export interface DetectedMicrohaplotypesRun {
  readonly library_samples: readonly DetectedLibrarySample[];
  /** Absent when no run name was given. */
  readonly bioinformatics_run_name?: string;
}

/** What {@link mhapTableToPmo} returns: the name-keyed fragment pmotools-python returns. */
export interface MhapTableToPmoResult {
  readonly representative_microhaplotypes: { readonly targets: readonly RepresentativeMhapTarget[] };
  readonly detected_microhaplotypes: readonly DetectedMicrohaplotypesRun[];
}

/** An option column name counts as set when it is a non-empty string, like Python's truthiness. */
function given(name: string | null | undefined): name is string {
  return typeof name === "string" && name !== "";
}

/** Python truthiness of a present cell: `0`, `""` and `false` are falsy. */
function truthy(value: Cell): value is PresentCell {
  return isPresent(value) && value !== 0 && value !== "" && value !== false;
}

/** Names (targets, samples, runs) are compared and written as strings. */
function nameOf(value: PresentCell): string {
  return String(value);
}

interface NamedGroup<T> {
  readonly name: string;
  /** First value seen, used to order groups the way pandas orders keys. */
  readonly first: PresentCell;
  readonly rows: T[];
}

/**
 * Groups items by the string form of a cell, sorted as pandas sorts the keys
 * (numbers numerically, text by code point). Items with a missing key are
 * dropped, as `groupby` does.
 */
function groupByName<T>(rows: readonly T[], keyOf: (item: T) => Cell): NamedGroup<T>[] {
  const groups = new Map<string, NamedGroup<T>>();
  for (const row of rows) {
    const value = keyOf(row);
    if (!isPresent(value)) continue;
    const name = nameOf(value);
    let group = groups.get(name);
    if (group === undefined) {
      group = { name, first: value, rows: [] };
      groups.set(name, group);
    }
    group.rows.push(row);
  }
  return [...groups.values()].sort((a, b) => compareCells(a.first, b.first));
}

function requireColumnNames(present: ReadonlySet<string>, columns: readonly string[]): void {
  const missing = columns.filter((column) => !present.has(column));
  if (missing.length > 0) {
    throw new PmoError("mhap/missing-columns", `Columns not found in the microhaplotype table: ${missing.join(", ")}`, {
      columns: missing,
    });
  }
}

function requireAdditionalColumns(columnsPresent: ReadonlySet<string>, wanted: readonly string[]): void {
  const missing = [...new Set(wanted)].filter((column) => !columnsPresent.has(column));
  if (missing.length > 0) {
    throw new PmoError("mhap/missing-additional-columns", `Missing additional columns: ${missing.join(", ")}`, {
      columns: missing,
    });
  }
}

/** Python's `int(str)`: optional surrounding whitespace and sign, digits with single underscores between. */
function parsePythonInt(text: string, column: string): number {
  const match = /^\s*([+-]?)(\d+(?:_\d+)*)\s*$/u.exec(text);
  if (match === null) {
    throw new PmoError("mhap/invalid-masking", `Masking value '${text}' in column ${column} is not an integer`, {
      column,
      value: text,
    });
  }
  const magnitude = Number((match[2] ?? "").replaceAll("_", ""));
  return match[1] === "-" ? -magnitude : magnitude;
}

interface Resolved {
  readonly librarySampleNameCol: string;
  readonly targetNameCol: string;
  readonly seqCol: string;
  readonly readsCol: string;
  readonly genomeId: number;
  readonly umisCol: string | undefined;
  readonly additionalMhapDetectedCols: readonly string[];
}

/**
 * The columns that make a representative microhaplotype distinct: the target,
 * the seq, every optional column that is set, and the additional columns.
 */
function representativeColumns(options: MhapTableToPmoOptions, resolved: Resolved): string[] {
  const chromCol = options.chromCol ?? undefined;
  const pseudocigarChromCol = given(options.pseudocigarChromCol) ? options.pseudocigarChromCol : chromCol;
  const optional = [
    chromCol,
    options.startCol,
    options.endCol,
    options.refSeqCol,
    options.strandCol,
    options.altAnnotationsCol,
    options.microhaplotypeNameCol,
    options.pseudocigarCol,
    pseudocigarChromCol,
    options.pseudocigarStartCol,
    options.pseudocigarEndCol,
    options.pseudocigarRefSeqCol,
    options.pseudocigarStrandCol,
    options.pseudocigarGenerationDescriptionCol,
    options.qualityCol,
    options.maskingSeqStartCol,
    options.maskingSeqSegmentSizeCol,
    options.maskingReplacementSizeCol,
  ].filter(given);
  return [...new Set([resolved.targetNameCol, resolved.seqCol, ...optional, ...(options.additionalRepresentativeMhapCols ?? [])])];
}

/**
 * `create_representative_microhaplotype_dict`, given the table's distinct
 * rows over {@link representativeColumns} (first-seen order), every column
 * any row has, and how many rows there were.
 */
function buildRepresentative(
  unique: readonly Row[],
  columns: ReadonlySet<string>,
  rowCount: number,
  options: MhapTableToPmoOptions,
  resolved: Resolved,
  onWarning: WarningSink | undefined,
): RepresentativeMhapTarget[] {
  const { targetNameCol, seqCol, genomeId } = resolved;
  const chromCol = options.chromCol ?? undefined;
  const startCol = options.startCol ?? undefined;
  const endCol = options.endCol ?? undefined;
  const refSeqCol = options.refSeqCol ?? undefined;
  const strandCol = options.strandCol ?? undefined;
  const altAnnotationsCol = options.altAnnotationsCol ?? undefined;
  const microhaplotypeNameCol = options.microhaplotypeNameCol ?? undefined;
  const pseudocigarCol = options.pseudocigarCol ?? undefined;
  const pseudocigarStartCol = options.pseudocigarStartCol ?? undefined;
  const pseudocigarEndCol = options.pseudocigarEndCol ?? undefined;
  const pseudocigarRefSeqCol = options.pseudocigarRefSeqCol ?? undefined;
  const pseudocigarStrandCol = options.pseudocigarStrandCol ?? undefined;
  const pseudocigarDescriptionCol = options.pseudocigarGenerationDescriptionCol ?? undefined;
  const qualityCol = options.qualityCol ?? undefined;
  const maskingStartCol = options.maskingSeqStartCol ?? undefined;
  const maskingSizeCol = options.maskingSeqSegmentSizeCol ?? undefined;
  const maskingReplacementCol = options.maskingReplacementSizeCol ?? undefined;
  const maskingDelim = options.maskingDelim ?? ",";
  const additional = options.additionalRepresentativeMhapCols ?? [];

  if (additional.length > 0) requireAdditionalColumns(columns, additional);

  const pseudocigarChromCol = given(options.pseudocigarChromCol) ? options.pseudocigarChromCol : chromCol;
  const pseudocigarGenomeId = options.pseudocigarGenomeId ?? genomeId;
  if (given(pseudocigarCol) && !(given(pseudocigarChromCol) && given(pseudocigarStartCol) && given(pseudocigarEndCol))) {
    throw new PmoError(
      "mhap/pseudocigar-ref-loc-columns-unset",
      "pseudocigarCol is set, so a pseudocigar ref_loc must be constructable: set pseudocigarChromCol (or chromCol " +
        "with startCol and endCol), pseudocigarStartCol and pseudocigarEndCol.",
    );
  }

  const maskingCols = [maskingStartCol, maskingSizeCol, maskingReplacementCol];
  if (maskingCols.some(given) && !maskingCols.every(given)) {
    throw new PmoError(
      "mhap/incomplete-masking-columns",
      "If one of maskingSeqStartCol, maskingSeqSegmentSizeCol, maskingReplacementSizeCol is set, all must be.",
    );
  }
  if ([chromCol, startCol, endCol, refSeqCol, strandCol].some(given) && ![chromCol, startCol, endCol].every(given)) {
    throw new PmoError(
      "mhap/incomplete-location-columns",
      "If any location column is set (chromCol, startCol, endCol, refSeqCol, strandCol), chromCol, startCol and endCol must all be.",
    );
  }

  if (rowCount > 0) requireColumnNames(columns, representativeColumns(options, resolved));
  warnIfDuplicatedSeqs(unique, targetNameCol, seqCol, onWarning);

  const extractMasking = (row: Row): MhapMasking[] => {
    if (!given(maskingStartCol) || !given(maskingSizeCol) || !given(maskingReplacementCol)) return [];
    const startCell = row[maskingStartCol];
    const sizeCell = row[maskingSizeCol];
    const replacementCell = row[maskingReplacementCol];
    if (!isPresent(startCell) || !isPresent(sizeCell) || !isPresent(replacementCell)) return [];
    // String(5) is "5" whatever the column dtype; Python's str() of a float
    // column gives "5.0", which int() rejects. pmotools-ts accepts it.
    const starts = String(startCell).split(maskingDelim);
    const sizes = String(sizeCell).split(maskingDelim);
    const replacements = String(replacementCell).split(maskingDelim);
    const masking: MhapMasking[] = [];
    const count = Math.min(starts.length, sizes.length, replacements.length);
    for (let i = 0; i < count; i += 1) {
      const start = starts[i] ?? "";
      const size = sizes[i] ?? "";
      const replacement = replacements[i] ?? "";
      if (start === "" || size === "" || replacement === "") continue;
      masking.push({
        seq_start: parsePythonInt(start, maskingStartCol),
        seq_segment_size: parsePythonInt(size, maskingSizeCol),
        replacement_size: parsePythonInt(replacement, maskingReplacementCol),
      });
    }
    return masking;
  };

  const targets: RepresentativeMhapTarget[] = [];
  for (const group of groupByName(unique, (row) => row[targetNameCol])) {
    const firstRow = group.rows[0];
    let location: MhapGenomicLocation | undefined;
    if (firstRow !== undefined && given(chromCol) && given(startCol) && given(endCol)) {
      const chrom = firstRow[chromCol];
      if (isPresent(chrom)) {
        const start = firstRow[startCol];
        const end = firstRow[endCol];
        if (!isPresent(start) || !isPresent(end)) {
          throw new PmoError(
            "mhap/incomplete-location",
            `Target ${group.name} has a chromosome but no start or end in its first row`,
            { target_name: group.name },
          );
        }
        const loc: { -readonly [K in keyof MhapGenomicLocation]: MhapGenomicLocation[K] } = {
          genome_id: genomeId,
          chrom,
          start,
          end,
        };
        const refSeq = given(refSeqCol) ? firstRow[refSeqCol] : undefined;
        if (isPresent(refSeq)) loc.ref_seq = refSeq;
        const strand = given(strandCol) ? firstRow[strandCol] : undefined;
        if (isPresent(strand)) loc.strand = strand;
        location = loc;
      }
    }

    const microhaplotypes: RepresentativeMhap[] = [];
    for (const row of group.rows) {
      const seq = row[seqCol];
      if (!isPresent(seq)) {
        throw new PmoError("mhap/missing-seq", `A row for target ${group.name} has no seq`, {
          target_name: group.name,
        });
      }
      const mhap: Record<string, unknown> = { seq };
      const optionalValue = (column: string | undefined): PresentCell | undefined => {
        if (!given(column)) return undefined;
        const value = row[column];
        return truthy(value) ? value : undefined;
      };
      const alt = optionalValue(altAnnotationsCol);
      if (alt !== undefined) mhap["alt_annotations"] = alt;
      const name = optionalValue(microhaplotypeNameCol);
      if (name !== undefined) mhap["microhaplotype_name"] = name;
      const pseudocigarSeq = optionalValue(pseudocigarCol);
      if (pseudocigarSeq !== undefined && given(pseudocigarChromCol) && given(pseudocigarStartCol) && given(pseudocigarEndCol)) {
        const chrom = row[pseudocigarChromCol];
        const start = row[pseudocigarStartCol];
        const end = row[pseudocigarEndCol];
        if (!isPresent(chrom) || !isPresent(start) || !isPresent(end)) {
          throw new PmoError(
            "mhap/pseudocigar-ref-loc-missing",
            `pseudocigar present for target ${group.name}, seq ${String(seq)} but its ref_loc chrom/start/end is missing`,
            { target_name: group.name, seq },
          );
        }
        const refLoc: { -readonly [K in keyof MhapGenomicLocation]: MhapGenomicLocation[K] } = {
          genome_id: pseudocigarGenomeId,
          chrom,
          start,
          end,
        };
        const refSeq = given(pseudocigarRefSeqCol) ? row[pseudocigarRefSeqCol] : undefined;
        if (isPresent(refSeq)) refLoc.ref_seq = refSeq;
        const strand = given(pseudocigarStrandCol) ? row[pseudocigarStrandCol] : undefined;
        if (isPresent(strand)) refLoc.strand = strand;
        const pseudocigar: { -readonly [K in keyof MhapPseudocigar]: MhapPseudocigar[K] } = {
          pseudocigar_seq: pseudocigarSeq,
          ref_loc: refLoc,
        };
        const description = given(pseudocigarDescriptionCol) ? row[pseudocigarDescriptionCol] : undefined;
        if (isPresent(description)) pseudocigar.pseudocigar_generation_description = description;
        mhap["pseudocigar"] = pseudocigar;
      }
      const quality = optionalValue(qualityCol);
      if (quality !== undefined) mhap["quality"] = quality;
      for (const column of additional) {
        const value = optionalValue(column);
        if (value !== undefined) mhap[column] = value;
      }
      const masking = extractMasking(row);
      if (masking.length > 0) mhap["masking"] = masking;
      microhaplotypes.push({ ...mhap, seq });
    }

    targets.push(
      location === undefined
        ? { target_name: group.name, microhaplotypes }
        : { target_name: group.name, microhaplotypes, mhap_location: location },
    );
  }
  return targets;
}

function warnIfDuplicatedSeqs(rows: readonly Row[], targetCol: string, seqCol: string, onWarning?: WarningSink): void {
  const counts = new Map<string, { target_name: string; seq: PresentCell; count: number }>();
  for (const row of rows) {
    const target = row[targetCol];
    const seq = row[seqCol];
    if (!isPresent(target) || !isPresent(seq)) continue;
    const key = `${nameOf(target)}\u0000${cellKey([seq])}`;
    const entry = counts.get(key);
    if (entry === undefined) counts.set(key, { target_name: nameOf(target), seq, count: 1 });
    else entry.count += 1;
  }
  const duplicates = [...counts.values()].filter((entry) => entry.count > 1);
  if (duplicates.length > 0) {
    warn(
      onWarning,
      "mhap/duplicate-target-seq",
      `Duplicate (target, seq) combinations found: ${duplicates
        .map((d) => `${d.target_name}/${String(d.seq)} (${d.count})`)
        .join(", ")}. Detected rows will point at the last copy.`,
      { duplicates },
    );
  }
}

/**
 * The detected path renames the input columns to canonical names before
 * reading them. This reads a row as if renamed, without copying it. When a
 * canonical name is also an existing column (pandas would then hold two
 * columns of that name), the renamed source column wins; a source column
 * that was renamed can no longer be read under its old name.
 */
interface RenamedView {
  /** The cell `column` of the renamed row. */
  readonly read: (row: Row, column: string) => Cell;
  /** The renamed table's columns, given the input's. */
  readonly columns: (names: readonly string[]) => string[];
}

function renamedView(resolved: Resolved): RenamedView {
  const renames = new Map<string, string>([
    [resolved.librarySampleNameCol, "library_sample_name"],
    [resolved.targetNameCol, "target_name"],
    [resolved.seqCol, "seq"],
    [resolved.readsCol, "reads"],
  ]);
  if (given(resolved.umisCol)) renames.set(resolved.umisCol, "umis");
  const sources = new Map<string, string>();
  for (const [source, canonical] of renames) sources.set(canonical, source);
  return {
    read: (row, column) => {
      const source = sources.get(column);
      if (source !== undefined && Object.hasOwn(row, source)) return row[source];
      return renames.has(column) ? undefined : row[column];
    },
    columns: (names) => [...new Set(names.map((name) => renames.get(name) ?? name))],
  };
}

/** A growing list of 32-bit integers: 4 bytes a row, where an array of numbers can take 8 or more. */
class IntColumn {
  private data = new Int32Array(1024);
  length = 0;

  push(value: number): void {
    if (this.length === this.data.length) {
      const grown = new Int32Array(this.data.length * 2);
      grown.set(this.data);
      this.data = grown;
    }
    this.data[this.length] = value;
    this.length += 1;
  }

  at(index: number): number {
    return this.data[index] ?? -1;
  }
}

/** Numbers distinct keys in first-seen order. */
class Numbering<K> {
  private readonly ids = new Map<K, number>();
  readonly keys: K[] = [];

  /** The key's number, giving it the next one when it is new. */
  id(key: K): number {
    let id = this.ids.get(key);
    if (id === undefined) {
      id = this.keys.length;
      this.ids.set(key, id);
      this.keys.push(key);
    }
    return id;
  }

  find(key: K): number | undefined {
    return this.ids.get(key);
  }
}

/**
 * Builds the PMO fragment of a microhaplotype table from rows given a chunk
 * at a time, so a table too large to hold at once can be read in pieces and
 * dropped as it goes. Made by {@link createMhapTableBuilder}.
 */
export interface MhapTableBuilder {
  /**
   * Takes the next rows of the table. Rows are read here and not kept,
   * except the first row of each distinct representative microhaplotype.
   *
   * @throws PmoError `mhap/builder-finished` after {@link finish}.
   */
  add(rows: Table): void;
  /**
   * The fragment for every row added, exactly as {@link mhapTableToPmo}
   * gives for the whole table. Checks, warnings and errors all happen here,
   * in the same order as {@link mhapTableToPmo}. Can be called once.
   *
   * @throws PmoError as {@link mhapTableToPmo} does, and
   *   `mhap/builder-finished` when called again.
   */
  finish(): MhapTableToPmoResult;
}

function finishedError(): PmoError {
  return new PmoError("mhap/builder-finished", "This microhaplotype table builder has already finished");
}

/**
 * Starts building the PMO fragment of a microhaplotype table that arrives in
 * chunks. Pass the rows to `add` as they are read, then call `finish`. The
 * result is the same as {@link mhapTableToPmo} gives for all the rows at once,
 * whatever the chunk sizes.
 *
 * Memory grows with the result, not the table: per row the builder keeps a
 * few numbers and the cells of the detected columns, and it keeps the row
 * itself only when it is the first of a distinct representative
 * microhaplotype.
 *
 * @example
 * const builder = createMhapTableBuilder({ librarySampleNameCol: "SampleID" });
 * for await (const rows of chunks) builder.add(rows);
 * const mhapInfo = builder.finish();
 */
export function createMhapTableBuilder(options: MhapTableToPmoOptions = {}): MhapTableBuilder {
  const resolved = resolveOptions(options);
  const read = renamedView(resolved).read;
  const runName = options.bioinformaticsRunName ?? undefined;

  // Representative microhaplotypes: the distinct rows over these columns.
  const distinctColumns = representativeColumns(options, resolved);
  const cellNumbers = distinctColumns.map(() => new Numbering<string | number | null>());
  const seenKeys = new Set<string>();
  let unique: Row[] = [];

  // Every column some row has, by run (-1 for rows without a run value).
  let columnsByRun = new Map<number, Set<string>>();
  let rowCount = 0;
  let rowsWithoutRun = 0;

  // Detected microhaplotypes: per row, the renamed target, seq, sample and run as numbers.
  const runs = new Numbering<string>();
  const targetNames = new Numbering<string>();
  const samples = new Numbering<string>();
  const seqs = new Numbering<string | number | null>();
  let seqCells: Cell[] = [];
  /** The first cell of each sample's name in each run, for sorting as pandas does. */
  let firstSampleCells = new Map<number, Map<number, PresentCell>>();
  let runOf = new IntColumn();
  let targetOf = new IntColumn();
  let seqOf = new IntColumn();
  let sampleOf = new IntColumn();

  // The detected microhaplotype's own columns, as written: mhap_id, reads, umis, then the extras.
  const mhapCols = ["mhap_id", "reads"];
  if (given(resolved.umisCol)) mhapCols.push("umis");
  mhapCols.push(...resolved.additionalMhapDetectedCols);
  const outputCols = [...new Set(mhapCols)];
  const storedCols = outputCols.filter((column) => column !== "mhap_id" && column !== "mhaps_target_id");
  let stored: Cell[][] = storedCols.map(() => []);
  const readsIndex = storedCols.indexOf("reads");

  let finished = false;

  function add(rows: Table): void {
    if (finished) throw finishedError();
    for (const row of rows) {
      let runId = -1;
      if (runName !== undefined) {
        const value = row[runName];
        if (isPresent(value)) runId = runs.id(nameOf(value));
        else rowsWithoutRun += 1;
        runOf.push(runId);
      }
      let columns = columnsByRun.get(runId);
      if (columns === undefined) {
        columns = new Set();
        columnsByRun.set(runId, columns);
      }
      for (const column in row) columns.add(column);

      let key = "";
      distinctColumns.forEach((column, index) => {
        const id = cellNumbers[index]?.id(cellMapKey(row[column])) ?? 0;
        key = index === 0 ? String(id) : `${key},${id}`;
      });
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        unique.push(row);
      }

      const target = read(row, "target_name");
      targetOf.push(isPresent(target) ? targetNames.id(nameOf(target)) : -1);
      const seq = read(row, "seq");
      const seqId = seqs.id(cellMapKey(seq));
      if (seqId === seqCells.length) seqCells.push(seq);
      seqOf.push(seqId);
      const sample = read(row, "library_sample_name");
      if (isPresent(sample)) {
        const sampleId = samples.id(nameOf(sample));
        sampleOf.push(sampleId);
        let firsts = firstSampleCells.get(runId);
        if (firsts === undefined) {
          firsts = new Map();
          firstSampleCells.set(runId, firsts);
        }
        if (!firsts.has(sampleId)) firsts.set(sampleId, sample);
      } else {
        sampleOf.push(-1);
      }
      storedCols.forEach((column, index) => stored[index]?.push(read(row, column)));
      rowCount += 1;
    }
  }

  /** Every column any row has. */
  function allColumns(): Set<string> {
    const all = new Set<string>();
    for (const columns of columnsByRun.values()) for (const column of columns) all.add(column);
    return all;
  }

  /** `create_detected_microhaplotype_dict` for one run: its rows by position, and the columns they have. */
  function buildDetected(
    positions: Int32Array | null,
    columns: ReadonlySet<string>,
    runId: number,
    name: string | undefined,
    lookup: { readonly targetIds: Int32Array; readonly mhapIds: readonly Map<number, number>[] },
    targets: readonly RepresentativeMhapTarget[],
  ): DetectedMicrohaplotypesRun {
    const size = positions === null ? rowCount : positions.length;
    const rowAt = positions === null ? (index: number) => index : (index: number) => positions[index] ?? 0;
    const renamedColumns = new Set(renamedView(resolved).columns([...columns]));
    if (resolved.additionalMhapDetectedCols.length > 0) {
      requireAdditionalColumns(renamedColumns, resolved.additionalMhapDetectedCols);
    }
    const required = ["target_name", "seq", "library_sample_name", "reads"];
    if (given(resolved.umisCol)) required.push("umis");
    if (size > 0) requireColumnNames(renamedColumns, required);

    // get_target_id_in_representative_mhaps and
    // get_mhap_index_in_representative_mhaps, in one pass. Later copies of a
    // seq overwrite earlier ones. A missing target is reported before any
    // missing seq, as Python finds them in that order.
    const mhapOf = new Int32Array(size);
    const missingTargets: (string | null)[] = [];
    const missingSeqs: { target_name: string; seq: Cell }[] = [];
    const missingSeqKeys = new Set<string>();
    for (let index = 0; index < size; index += 1) {
      const row = rowAt(index);
      const nameId = targetOf.at(row);
      const targetId = nameId < 0 ? -1 : (lookup.targetIds[nameId] ?? -1);
      if (targetId < 0) {
        const missing = nameId < 0 ? null : (targetNames.keys[nameId] ?? null);
        if (!missingTargets.includes(missing)) missingTargets.push(missing);
        continue;
      }
      const seqId = seqOf.at(row);
      const mhapId = lookup.mhapIds[targetId]?.get(seqId);
      if (mhapId === undefined) {
        const key = `${targetId},${seqId}`;
        if (!missingSeqKeys.has(key)) {
          missingSeqKeys.add(key);
          const seq = seqCells[seqId];
          missingSeqs.push({ target_name: targets[targetId]?.target_name ?? "", seq: isPresent(seq) ? seq : null });
        }
        continue;
      }
      mhapOf[index] = mhapId;
    }
    if (missingTargets.length > 0) {
      throw new PmoError(
        "mhap/missing-target-names",
        `Missing target_name(s) in representative microhaplotype table: ${missingTargets.map(String).join(", ")}`,
        { target_names: missingTargets },
      );
    }
    if (missingSeqs.length > 0) {
      throw new PmoError(
        "mhap/missing-seqs",
        `Some seq values not found in representative microhaplotype table: ${missingSeqs
          .map((m) => `${m.target_name}/${String(m.seq)}`)
          .join(", ")}`,
        { missing: missingSeqs },
      );
    }

    // build_detected_mhap_dict: library samples sorted as pandas sorts their
    // first cells, rows grouped by sample in their own order. Rows with no
    // library sample name are dropped.
    const firsts = firstSampleCells.get(runId) ?? new Map<number, PresentCell>();
    const counts = new Int32Array(samples.keys.length);
    for (let index = 0; index < size; index += 1) {
      const sample = sampleOf.at(rowAt(index));
      if (sample >= 0) counts[sample] = (counts[sample] ?? 0) + 1;
    }
    const order = [...firsts.entries()]
      .filter(([sample]) => (counts[sample] ?? 0) > 0)
      .sort(([, a], [, b]) => compareCells(a, b))
      .map(([sample]) => sample);
    const starts = new Int32Array(samples.keys.length);
    let offset = 0;
    for (const sample of order) {
      starts[sample] = offset;
      offset += counts[sample] ?? 0;
    }
    const grouped = new Int32Array(offset);
    const filled = new Int32Array(samples.keys.length);
    for (let index = 0; index < size; index += 1) {
      const sample = sampleOf.at(rowAt(index));
      if (sample < 0) continue;
      grouped[(starts[sample] ?? 0) + (filled[sample] ?? 0)] = index;
      filled[sample] = (filled[sample] ?? 0) + 1;
    }

    const plain = outputCols.length === 2;
    const librarySamples: DetectedLibrarySample[] = [];
    for (const sample of order) {
      const sampleName = samples.keys[sample] ?? "";
      const start = starts[sample] ?? 0;
      const end = start + (counts[sample] ?? 0);
      const byTarget = new Map<number, DetectedMhap[]>();
      for (let slot = start; slot < end; slot += 1) {
        const index = grouped[slot] ?? 0;
        const row = rowAt(index);
        const targetId = lookup.targetIds[targetOf.at(row)] ?? 0;
        const mhapId = mhapOf[index] ?? 0;
        const reads = stored[readsIndex]?.[row];
        if (!isPresent(reads)) {
          const seq = seqCells[seqOf.at(row)];
          throw new PmoError("mhap/missing-reads", `A row for library sample ${sampleName} has no read count`, {
            library_sample_name: sampleName,
            target_name: targetNames.keys[targetOf.at(row)] ?? null,
            seq: seq ?? null,
          });
        }
        let mhaps = byTarget.get(targetId);
        if (mhaps === undefined) {
          mhaps = [];
          byTarget.set(targetId, mhaps);
        }
        if (plain) {
          mhaps.push({ mhap_id: mhapId, reads });
          continue;
        }
        const mhap: Record<string, unknown> = {};
        for (const column of outputCols) {
          if (column === "mhap_id") mhap[column] = mhapId;
          else if (column === "mhaps_target_id") mhap[column] = targetId;
          else {
            const value = stored[storedCols.indexOf(column)]?.[row];
            if (isPresent(value)) mhap[column] = value;
          }
        }
        // `outputCols` holds mhap_id and reads, so they keep their places.
        mhaps.push(Object.assign(mhap, { mhap_id: mhapId, reads }));
      }
      const targetResults = [...byTarget.entries()]
        .sort(([a], [b]) => a - b)
        .map(([mhapsTargetId, mhaps]) => ({ mhaps_target_id: mhapsTargetId, mhaps }));
      librarySamples.push({ library_sample_name: sampleName, target_results: targetResults });
    }
    return name === undefined
      ? { library_samples: librarySamples }
      : { library_samples: librarySamples, bioinformatics_run_name: name };
  }

  function finish(): MhapTableToPmoResult {
    if (finished) throw finishedError();
    finished = true;
    const columns = allColumns();
    const targets = buildRepresentative(unique, columns, rowCount, options, resolved, options.onWarning);

    // Where each renamed target name and seq points among the representative microhaplotypes.
    const finalIds = new Map(targets.map((target, index) => [target.target_name, index]));
    const targetIds = Int32Array.from(targetNames.keys, (name) => finalIds.get(name) ?? -1);
    const mhapIds = targets.map((target) => {
      const ids = new Map<number, number>();
      target.microhaplotypes.forEach((mhap, index) => {
        const seqId = seqs.find(cellMapKey(mhap.seq));
        if (seqId !== undefined) ids.set(seqId, index);
      });
      return ids;
    });
    const lookup = { targetIds, mhapIds };

    const detected: DetectedMicrohaplotypesRun[] = [];
    if (runName !== undefined && columns.has(runName)) {
      if (rowsWithoutRun > 0) {
        throw new PmoError("mhap/missing-run-name", `A row has no value in the run column ${runName}`, {
          column: runName,
        });
      }
      // Each run's rows in table order: a counting sort by run.
      const runCounts = new Int32Array(runs.keys.length);
      for (let row = 0; row < rowCount; row += 1) {
        const run = runOf.at(row);
        runCounts[run] = (runCounts[run] ?? 0) + 1;
      }
      const positions = Array.from(runCounts, (count) => new Int32Array(count));
      const filled = new Int32Array(runs.keys.length);
      for (let row = 0; row < rowCount; row += 1) {
        const run = runOf.at(row);
        const list = positions[run];
        if (list !== undefined) list[filled[run] ?? 0] = row;
        filled[run] = (filled[run] ?? 0) + 1;
      }
      runs.keys.forEach((name, run) => {
        detected.push(
          buildDetected(positions[run] ?? null, columnsByRun.get(run) ?? new Set(), run, name, lookup, targets),
        );
      });
    } else {
      detected.push(buildDetected(null, columns, -1, runName, lookup, targets));
    }
    release();
    return { representative_microhaplotypes: { targets }, detected_microhaplotypes: detected };
  }

  /** Lets go of what the rows left behind, so only the result stays in memory. */
  function release(): void {
    unique = [];
    columnsByRun = new Map();
    seqCells = [];
    firstSampleCells = new Map();
    runOf = new IntColumn();
    targetOf = new IntColumn();
    seqOf = new IntColumn();
    sampleOf = new IntColumn();
    stored = [];
  }

  return { add, finish };
}

function resolveOptions(options: MhapTableToPmoOptions): Resolved {
  return {
    librarySampleNameCol: options.librarySampleNameCol ?? "library_sample_name",
    targetNameCol: options.targetNameCol ?? "target_name",
    seqCol: options.seqCol ?? "seq",
    readsCol: options.readsCol ?? "reads",
    genomeId: options.genomeId ?? 0,
    umisCol: options.umisCol ?? undefined,
    additionalMhapDetectedCols: options.additionalMhapDetectedCols ?? [],
  };
}

/**
 * Converts a table of microhaplotype calls into representative and detected
 * microhaplotypes, keyed by name. Port of pmotools-python `mhap_table_to_pmo`.
 *
 * Representative targets are the distinct target names, sorted (numbers
 * numerically, text by code point). Each target's microhaplotypes are the
 * distinct combinations of every selected representative column, in
 * first-seen order, so one seq can appear twice when, say, its annotation
 * differs; detected rows then point at the last copy and a
 * `mhap/duplicate-target-seq` warning is raised. A target's `mhap_location`
 * comes from its first row.
 *
 * Detected entries are grouped by library sample (sorted) and then by
 * `mhaps_target_id`, the index into `representative_microhaplotypes.targets`.
 * Rows with no library sample name are dropped, as in Python.
 *
 * For a table too large to hold at once, use {@link createMhapTableBuilder},
 * which gives the same result from rows added a chunk at a time.
 *
 * @throws PmoError for missing columns, incomplete option groups, missing
 *   target names, seqs, read counts or run names, and unparseable masking.
 */
export function mhapTableToPmo(table: Table, options: MhapTableToPmoOptions = {}): MhapTableToPmoResult {
  const builder = createMhapTableBuilder(options);
  builder.add(table);
  return builder.finish();
}
