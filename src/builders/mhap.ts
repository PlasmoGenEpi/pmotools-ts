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
  columnNames,
  compareCells,
  dropDuplicates,
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

interface NamedGroup {
  readonly name: string;
  /** First value seen, used to order groups the way pandas orders keys. */
  readonly first: PresentCell;
  readonly rows: Row[];
}

/**
 * Groups rows by the string form of one column, sorted as pandas sorts the
 * keys (numbers numerically, text by code point). Rows with a missing key
 * are dropped, as `groupby` does.
 */
function groupByName(rows: readonly Row[], column: string): NamedGroup[] {
  const groups = new Map<string, NamedGroup>();
  for (const row of rows) {
    const value = row[column];
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

function requireColumns(table: Table, columns: readonly string[]): void {
  if (table.length === 0) return;
  const present = new Set(columnNames(table));
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

/** `create_representative_microhaplotype_dict`. */
function buildRepresentative(
  table: Table,
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

  if (additional.length > 0) requireAdditionalColumns(new Set(columnNames(table)), additional);

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

  const optional = [
    chromCol,
    startCol,
    endCol,
    refSeqCol,
    strandCol,
    altAnnotationsCol,
    microhaplotypeNameCol,
    pseudocigarCol,
    pseudocigarChromCol,
    pseudocigarStartCol,
    pseudocigarEndCol,
    pseudocigarRefSeqCol,
    pseudocigarStrandCol,
    pseudocigarDescriptionCol,
    qualityCol,
    ...maskingCols,
  ].filter(given);
  const allCols = [...new Set([targetNameCol, seqCol, ...optional, ...additional])];
  requireColumns(table, allCols);

  const unique = dropDuplicates(table, allCols);
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
  for (const group of groupByName(unique, targetNameCol)) {
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
 * reading them. This reproduces that view of a row. When a canonical name is
 * also an existing column (pandas would then hold two columns of that name),
 * the renamed source column wins.
 */
function renamer(resolved: Resolved): (row: Row) => Row {
  const mapping = new Map<string, string>([
    [resolved.librarySampleNameCol, "library_sample_name"],
    [resolved.targetNameCol, "target_name"],
    [resolved.seqCol, "seq"],
    [resolved.readsCol, "reads"],
  ]);
  if (given(resolved.umisCol)) mapping.set(resolved.umisCol, "umis");
  return (row) => {
    const renamed: Record<string, Cell> = {};
    for (const [column, value] of Object.entries(row)) {
      if (!mapping.has(column)) renamed[column] = value;
    }
    for (const [column, value] of Object.entries(row)) {
      const target = mapping.get(column);
      if (target !== undefined) renamed[target] = value;
    }
    return renamed;
  };
}

/** A seq as a Map key that matches exactly when `cellKey([seq])` does. */
function seqKey(seq: Cell): string | number | null {
  if (!isPresent(seq)) return null;
  return typeof seq === "boolean" ? Number(seq) : seq;
}

interface Located {
  readonly row: Row;
  readonly targetId: number;
  readonly mhapId: number;
}

/** `create_detected_microhaplotype_dict` for one run's rows. */
function buildDetected(
  rows: readonly Row[],
  targets: readonly RepresentativeMhapTarget[],
  runName: string | undefined,
  resolved: Resolved,
): DetectedMicrohaplotypesRun {
  const rename = renamer(resolved);
  const renamedRows = rows.map(rename);
  const mhapCols = ["mhap_id", "reads"];
  if (given(resolved.umisCol)) mhapCols.push("umis");

  const additional = resolved.additionalMhapDetectedCols;
  if (additional.length > 0) {
    requireAdditionalColumns(new Set(columnNames(renamedRows)), additional);
    mhapCols.push(...additional);
  }
  const outputCols = [...new Set(mhapCols)];

  const required = ["target_name", "seq", "library_sample_name", "reads"];
  if (given(resolved.umisCol)) required.push("umis");
  requireColumns(renamedRows, required);

  // get_target_id_in_representative_mhaps
  const targetIds = new Map(targets.map((target, index) => [target.target_name, index]));
  const missingTargets: (string | null)[] = [];
  const withTargetIds = renamedRows.map((row) => {
    const target = row["target_name"];
    const id = isPresent(target) ? targetIds.get(nameOf(target)) : undefined;
    if (id === undefined) {
      const name = isPresent(target) ? nameOf(target) : null;
      if (!missingTargets.includes(name)) missingTargets.push(name);
    }
    return { row, targetId: id ?? -1 };
  });
  if (missingTargets.length > 0) {
    throw new PmoError(
      "mhap/missing-target-names",
      `Missing target_name(s) in representative microhaplotype table: ${missingTargets.map(String).join(", ")}`,
      { target_names: missingTargets },
    );
  }

  // get_mhap_index_in_representative_mhaps: later copies of a seq overwrite earlier ones.
  // One map per target, keyed by the seq itself: Map keys compare like
  // cellKey once missing values and booleans are normalised.
  const mhapIds = targets.map((target) => {
    const ids = new Map<string | number | null, number>();
    target.microhaplotypes.forEach((mhap, index) => ids.set(seqKey(mhap.seq), index));
    return ids;
  });
  const missingSeqs: { target_name: string; seq: Cell }[] = [];
  const located: Located[] = withTargetIds.map(({ row, targetId }) => {
    const seq = row["seq"];
    const mhapId = mhapIds[targetId]?.get(seqKey(seq));
    if (mhapId === undefined) {
      const targetName = targets[targetId]?.target_name ?? "";
      if (!missingSeqs.some((m) => m.target_name === targetName && cellKey([m.seq]) === cellKey([seq]))) {
        missingSeqs.push({ target_name: targetName, seq: isPresent(seq) ? seq : null });
      }
    }
    return { row, targetId, mhapId: mhapId ?? -1 };
  });
  if (missingSeqs.length > 0) {
    throw new PmoError(
      "mhap/missing-seqs",
      `Some seq values not found in representative microhaplotype table: ${missingSeqs
        .map((m) => `${m.target_name}/${String(m.seq)}`)
        .join(", ")}`,
      { missing: missingSeqs },
    );
  }

  // build_detected_mhap_dict
  const byRow = new Map(located.map((entry) => [entry.row, entry]));
  const librarySamples: DetectedLibrarySample[] = [];
  for (const sample of groupByName(renamedRows, "library_sample_name")) {
    const byTarget = new Map<number, DetectedMhap[]>();
    for (const row of sample.rows) {
      const entry = byRow.get(row);
      if (entry === undefined) continue;
      const mhaps = byTarget.get(entry.targetId) ?? [];
      byTarget.set(entry.targetId, mhaps);
      mhaps.push(detectedMhap(entry, outputCols, sample.name));
    }
    const targetResults = [...byTarget.entries()]
      .sort(([a], [b]) => a - b)
      .map(([mhapsTargetId, mhaps]) => ({ mhaps_target_id: mhapsTargetId, mhaps }));
    librarySamples.push({ library_sample_name: sample.name, target_results: targetResults });
  }
  return runName === undefined
    ? { library_samples: librarySamples }
    : { library_samples: librarySamples, bioinformatics_run_name: runName };
}

function detectedMhap({ row, targetId, mhapId }: Located, columns: readonly string[], sample: string): DetectedMhap {
  const reads = row["reads"];
  if (!isPresent(reads)) {
    throw new PmoError("mhap/missing-reads", `A row for library sample ${sample} has no read count`, {
      library_sample_name: sample,
      target_name: isPresent(row["target_name"]) ? nameOf(row["target_name"]) : null,
      seq: row["seq"] ?? null,
    });
  }
  const mhap: Record<string, unknown> = {};
  for (const column of columns) {
    if (column === "mhap_id") mhap[column] = mhapId;
    else if (column === "mhaps_target_id") mhap[column] = targetId;
    else {
      const value = row[column];
      if (isPresent(value)) mhap[column] = value;
    }
  }
  return { ...mhap, mhap_id: mhapId, reads };
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
 * @throws PmoError for missing columns, incomplete option groups, missing
 *   target names, seqs, read counts or run names, and unparseable masking.
 */
export function mhapTableToPmo(table: Table, options: MhapTableToPmoOptions = {}): MhapTableToPmoResult {
  const resolved: Resolved = {
    librarySampleNameCol: options.librarySampleNameCol ?? "library_sample_name",
    targetNameCol: options.targetNameCol ?? "target_name",
    seqCol: options.seqCol ?? "seq",
    readsCol: options.readsCol ?? "reads",
    genomeId: options.genomeId ?? 0,
    umisCol: options.umisCol ?? undefined,
    additionalMhapDetectedCols: options.additionalMhapDetectedCols ?? [],
  };
  const targets = buildRepresentative(table, options, resolved, options.onWarning);

  const runName = options.bioinformaticsRunName ?? undefined;
  const detected: DetectedMicrohaplotypesRun[] = [];
  if (runName !== undefined && columnNames(table).includes(runName)) {
    const runs = new Map<string, Row[]>();
    for (const row of table) {
      const value = row[runName];
      if (!isPresent(value)) {
        throw new PmoError("mhap/missing-run-name", `A row has no value in the run column ${runName}`, {
          column: runName,
        });
      }
      const name = nameOf(value);
      const rows = runs.get(name) ?? [];
      runs.set(name, rows);
      rows.push(row);
    }
    for (const [name, rows] of runs) detected.push(buildDetected(rows, targets, name, resolved));
  } else {
    detected.push(buildDetected(table, targets, runName, resolved));
  }

  return { representative_microhaplotypes: { targets }, detected_microhaplotypes: detected };
}
