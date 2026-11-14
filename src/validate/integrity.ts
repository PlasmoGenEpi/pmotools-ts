/**
 * Reference-integrity checks: the rules JSON Schema cannot express.
 *
 * PMO sections point at each other with 0-based integer indexes (`*_id`
 * fields). {@link checkPmoIntegrity} checks that every such index resolves,
 * and flags softer inconsistencies that real published files contain.
 * pmotools-python has no equivalent check; it fails with an `IndexError` or
 * `KeyError` (or silently reads the wrong entry) when it dereferences.
 */
import type { IssueDetails } from "../errors.js";
import type { PortableMicrohaplotypeObject } from "../types/pmo.js";
import { formatPath, type PathSegment } from "./path.js";

/** `"error"`: the file cannot be interpreted correctly. `"warning"`: suspicious, but seen in published files. */
export type IntegritySeverity = "error" | "warning";

/** Stable codes for {@link IntegrityIssue}. */
export type IntegrityCode =
  /** Error: an index is not a whole number (or not a number at all). */
  | "integrity/index-not-integer"
  /** Error: an index is negative or past the end of the section it points into (or that section is absent). */
  | "integrity/index-out-of-range"
  /** Warning: two entries of a section share a name (for genomes, name and version). */
  | "integrity/duplicate-name"
  /** Warning: two representative targets share a `target_id`. */
  | "integrity/duplicate-representative-target"
  /** Warning: two representative microhaplotypes of one target share a `seq`. */
  | "integrity/duplicate-representative-seq"
  /** Warning: one target result lists the same `mhap_id` twice. */
  | "integrity/duplicate-mhap-id"
  /** Warning: one library sample lists the same `mhaps_target_id` twice. */
  | "integrity/duplicate-target-result"
  /** Warning: one detected-microhaplotypes run lists the same `library_sample_id` twice. */
  | "integrity/duplicate-library-sample-result"
  /** Warning: a detected target is not in the panel of that library sample. */
  | "integrity/target-not-in-panel"
  /** Warning: a genomic location has `end < start`. */
  | "integrity/end-before-start";

/** One integrity problem. */
export interface IntegrityIssue {
  readonly code: IntegrityCode;
  readonly severity: IntegritySeverity;
  /** A sentence for people, naming the location. Wording may change. */
  readonly message: string;
  /** Where in the PMO, as keys and array indexes. */
  readonly path: readonly PathSegment[];
  /** Structured context. Always has `field`, the kind of reference or name checked. */
  readonly details: IssueDetails;
  /**
   * Present only on a summary issue: the number of further issues of the
   * same code and `details.field` that were not listed. Its `path` is the
   * first of those.
   */
  readonly omitted?: number;
}

/** Options for {@link checkPmoIntegrity}. */
export interface CheckPmoIntegrityOptions {
  /**
   * Most issues listed per kind (same code and `details.field`); the rest are
   * counted in one summary issue. Default 20.
   */
  readonly maxIssuesPerKind?: number;
}

type Rec = Readonly<Record<string, unknown>>;

function isRec(value: unknown): value is Rec {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rec(value: unknown): Rec | undefined {
  return isRec(value) ? value : undefined;
}

function arr(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function isIndex(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

interface Kind {
  readonly code: IntegrityCode;
  readonly severity: IntegritySeverity;
  readonly field: string;
  count: number;
  firstOmittedPath?: PathSegment[];
}

class Collector {
  readonly issues: IntegrityIssue[] = [];
  private readonly kinds = new Map<string, Kind>();

  constructor(private readonly cap: number) {}

  /** Records an issue. `build` runs only if the issue will be listed. */
  report(
    code: IntegrityCode,
    severity: IntegritySeverity,
    field: string,
    path: () => PathSegment[],
    build: (where: string) => { message: string; details?: Record<string, unknown> },
  ): void {
    const key = `${code}\u0000${field}`;
    let kind = this.kinds.get(key);
    if (kind === undefined) {
      kind = { code, severity, field, count: 0 };
      this.kinds.set(key, kind);
    }
    kind.count += 1;
    if (kind.count > this.cap) {
      kind.firstOmittedPath ??= path();
      return;
    }
    const at = path();
    const { message, details } = build(formatPath(at));
    this.issues.push({ code, severity, message, path: at, details: { field, ...details } });
  }

  finish(): IntegrityIssue[] {
    for (const kind of this.kinds.values()) {
      const omitted = kind.count - this.cap;
      if (omitted <= 0 || kind.firstOmittedPath === undefined) continue;
      this.issues.push({
        code: kind.code,
        severity: kind.severity,
        message: `${omitted} more ${kind.code} issue(s) for ${kind.field} not listed, starting at ${formatPath(kind.firstOmittedPath)}`,
        path: kind.firstOmittedPath,
        details: { field: kind.field, total: kind.count },
        omitted,
      });
    }
    return this.issues;
  }
}

/**
 * Checks that every index in a PMO resolves, and reports softer
 * inconsistencies.
 *
 * Errors (`severity: "error"`), the file cannot be read correctly:
 * - an index that is not a whole number, or is out of range, for every
 *   reference: `specimen_id`, `panel_id`, `sequencing_info_id`, `project_id`,
 *   `panel_targets[]`, representative `target_id`, `bioinformatics_run_id`,
 *   `bioinformatics_methods_id`, `library_sample_id`, read-count `target_id`,
 *   `mhaps_target_id` (into `representative_microhaplotypes.targets`),
 *   `mhap_id` (into that target's `microhaplotypes`), and `genome_id` in every
 *   genomic location. A reference into an absent optional section is out of
 *   range.
 *
 * Warnings, found in published files: duplicate names within a section,
 * duplicate representative `target_id`, duplicate `seq` within a
 * representative target, duplicate `mhap_id` within a target result,
 * duplicate target or library sample results, a detected target outside the
 * library sample's panel, and `end < start` in a location.
 *
 * Unknown or schema-invalid shapes are skipped, not reported; run
 * {@link validatePmo} for those. Runs in one pass over the detected
 * microhaplotypes without copying them, so files with millions of entries
 * are fine. Repeated issues are capped per kind (see
 * {@link CheckPmoIntegrityOptions.maxIssuesPerKind}).
 */
export function checkPmoIntegrity(
  pmo: PortableMicrohaplotypeObject,
  options: CheckPmoIntegrityOptions = {},
): IntegrityIssue[] {
  const out = new Collector(Math.max(0, options.maxIssuesPerKind ?? 20));
  const root: Rec = pmo;

  const specimens = arr(root["specimen_info"]);
  const libraries = arr(root["library_sample_info"]);
  const panels = arr(root["panel_info"]);
  const targets = arr(root["target_info"]);
  const repTargets = arr(rec(root["representative_microhaplotypes"])?.["targets"]);
  const sizes: Record<string, number | undefined> = {
    specimen_info: specimens.length,
    library_sample_info: libraries.length,
    panel_info: panels.length,
    target_info: targets.length,
    "representative_microhaplotypes.targets": repTargets.length,
  };
  for (const optional of [
    "sequencing_info",
    "project_info",
    "targeted_genomes",
    "bioinformatics_run_info",
    "bioinformatics_methods_info",
  ]) {
    sizes[optional] = Array.isArray(root[optional]) ? arr(root[optional]).length : undefined;
  }

  /**
   * Checks one index. `field` names the reference, `section` what it points
   * into (a key of `sizes`, or a description with an explicit `length`).
   * Returns whether the index resolves. `null`/`undefined` (an absent
   * optional reference) is not checked and returns false.
   */
  const checkIndex = (
    value: unknown,
    field: string,
    section: string,
    path: () => PathSegment[],
    length: number | undefined = sizes[section],
  ): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value !== "number" || !Number.isInteger(value)) {
      out.report("integrity/index-not-integer", "error", field, path, (where) => ({
        message: `${where} is ${JSON.stringify(value) ?? String(value)}, not a whole-number index into ${section}`,
        details: { value, section },
      }));
      return false;
    }
    const size = length ?? 0;
    if (value < 0 || value >= size) {
      out.report("integrity/index-out-of-range", "error", field, path, (where) => ({
        message:
          length === undefined
            ? `${where} is ${value}, but ${section} is absent`
            : `${where} is ${value}, but ${section} has ${size} entr${size === 1 ? "y" : "ies"}`,
        details: { value, section, length: size, sectionMissing: length === undefined },
      }));
      return false;
    }
    return true;
  };

  const checkLocation = (location: unknown, base: () => PathSegment[]): void => {
    const loc = rec(location);
    if (loc === undefined) return;
    checkIndex(loc["genome_id"], "GenomicLocation.genome_id", "targeted_genomes", () => [...base(), "genome_id"]);
    const start = loc["start"];
    const end = loc["end"];
    if (typeof start === "number" && typeof end === "number" && end < start) {
      out.report("integrity/end-before-start", "warning", "GenomicLocation", base, (where) => ({
        message: `${where} ends (${end}) before it starts (${start})`,
        details: { start, end },
      }));
    }
  };

  // Duplicate names within a section.
  const names: [section: string, key: (entry: Rec) => unknown, label: string][] = [
    ["specimen_info", (e) => e["specimen_name"], "specimen_name"],
    ["library_sample_info", (e) => e["library_sample_name"], "library_sample_name"],
    ["target_info", (e) => e["target_name"], "target_name"],
    ["panel_info", (e) => e["panel_name"], "panel_name"],
    ["sequencing_info", (e) => e["sequencing_info_name"], "sequencing_info_name"],
    ["project_info", (e) => e["project_name"], "project_name"],
    ["bioinformatics_run_info", (e) => e["bioinformatics_run_name"], "bioinformatics_run_name"],
    [
      "targeted_genomes",
      (e) =>
        typeof e["name"] === "string" && typeof e["genome_version"] === "string"
          ? `${e["name"]} ${e["genome_version"]}`
          : undefined,
      "name and genome_version",
    ],
  ];
  for (const [section, key, label] of names) {
    const first = new Map<string, number>();
    arr(root[section]).forEach((entry, index) => {
      const e = rec(entry);
      const name = e === undefined ? undefined : key(e);
      if (typeof name !== "string") return;
      const earlier = first.get(name);
      if (earlier === undefined) {
        first.set(name, index);
        return;
      }
      out.report("integrity/duplicate-name", "warning", `${section}.${label}`, () => [section, index], (where) => ({
        message: `${where} has ${label} ${JSON.stringify(name)}, already used by ${section}[${earlier}]`,
        details: { name, firstIndex: earlier },
      }));
    });
  }

  // Specimens and library samples.
  specimens.forEach((entry, i) => {
    checkIndex(rec(entry)?.["project_id"], "SpecimenInfo.project_id", "project_info", () => [
      "specimen_info",
      i,
      "project_id",
    ]);
  });
  libraries.forEach((entry, i) => {
    const e = rec(entry);
    if (e === undefined) return;
    checkIndex(e["specimen_id"], "LibrarySampleInfo.specimen_id", "specimen_info", () => [
      "library_sample_info",
      i,
      "specimen_id",
    ]);
    checkIndex(e["panel_id"], "LibrarySampleInfo.panel_id", "panel_info", () => [
      "library_sample_info",
      i,
      "panel_id",
    ]);
    checkIndex(e["sequencing_info_id"], "LibrarySampleInfo.sequencing_info_id", "sequencing_info", () => [
      "library_sample_info",
      i,
      "sequencing_info_id",
    ]);
  });

  // Panels: targets per panel, for the panel-membership check below.
  const panelTargets: (Set<number> | undefined)[] = panels.map((panel, p) => {
    const set = new Set<number>();
    arr(rec(panel)?.["reactions"]).forEach((reaction, r) => {
      arr(rec(reaction)?.["panel_targets"]).forEach((target, t) => {
        if (
          checkIndex(target, "ReactionInfo.panel_targets", "target_info", () => [
            "panel_info",
            p,
            "reactions",
            r,
            "panel_targets",
            t,
          ]) &&
          isIndex(target)
        ) {
          set.add(target);
        }
      });
    });
    return set;
  });

  // Targets and their locations.
  targets.forEach((entry, i) => {
    const e = rec(entry);
    if (e === undefined) return;
    checkLocation(e["insert_location"], () => ["target_info", i, "insert_location"]);
    checkLocation(rec(e["forward_primer"])?.["location"], () => ["target_info", i, "forward_primer", "location"]);
    checkLocation(rec(e["reverse_primer"])?.["location"], () => ["target_info", i, "reverse_primer", "location"]);
    arr(e["markers_of_interest"]).forEach((marker, m) => {
      checkLocation(rec(marker)?.["marker_location"], () => [
        "target_info",
        i,
        "markers_of_interest",
        m,
        "marker_location",
      ]);
    });
  });

  // Genomes: nothing points out of them. Bioinformatics runs -> methods.
  arr(root["bioinformatics_run_info"]).forEach((entry, i) => {
    checkIndex(
      rec(entry)?.["bioinformatics_methods_id"],
      "BioinformaticsRunInfo.bioinformatics_methods_id",
      "bioinformatics_methods_info",
      () => ["bioinformatics_run_info", i, "bioinformatics_methods_id"],
    );
  });

  // Representative microhaplotypes. Keep each target's microhaplotype count
  // for the mhap_id check.
  const repBase = (k: number): PathSegment[] => ["representative_microhaplotypes", "targets", k];
  const repTargetIds: (number | undefined)[] = [];
  const repSizes: number[] = [];
  const firstRepForTarget = new Map<number, number>();
  repTargets.forEach((entry, k) => {
    const e = rec(entry);
    const microhaplotypes = arr(e?.["microhaplotypes"]);
    repSizes.push(microhaplotypes.length);
    const targetId = e?.["target_id"];
    const ok = checkIndex(targetId, "RepresentativeMicrohaplotypesForTarget.target_id", "target_info", () => [
      ...repBase(k),
      "target_id",
    ]);
    repTargetIds.push(ok && isIndex(targetId) ? targetId : undefined);
    if (isIndex(targetId)) {
      const earlier = firstRepForTarget.get(targetId);
      if (earlier === undefined) firstRepForTarget.set(targetId, k);
      else {
        out.report(
          "integrity/duplicate-representative-target",
          "warning",
          "RepresentativeMicrohaplotypesForTarget.target_id",
          () => [...repBase(k), "target_id"],
          (where) => ({
            message: `${where} is ${targetId}, already used by representative_microhaplotypes.targets[${earlier}]`,
            details: { value: targetId, firstIndex: earlier },
          }),
        );
      }
    }
    if (e === undefined) return;
    checkLocation(e["mhap_location"], () => [...repBase(k), "mhap_location"]);
    const seqs = new Map<string, number>();
    microhaplotypes.forEach((mhap, m) => {
      const h = rec(mhap);
      if (h === undefined) return;
      const mBase = (): PathSegment[] => [...repBase(k), "microhaplotypes", m];
      const seq = h["seq"];
      if (typeof seq === "string") {
        const earlier = seqs.get(seq);
        if (earlier === undefined) seqs.set(seq, m);
        else {
          out.report(
            "integrity/duplicate-representative-seq",
            "warning",
            "RepresentativeMicrohaplotype.seq",
            () => [...mBase(), "seq"],
            (where) => ({
              message: `${where} repeats the sequence of microhaplotypes[${earlier}] in the same target`,
              details: { firstIndex: earlier },
            }),
          );
        }
      }
      checkLocation(rec(h["pseudocigar"])?.["ref_loc"], () => [...mBase(), "pseudocigar", "ref_loc"]);
      arr(h["associated_protein_variants"]).forEach((variant, v) => {
        const pv = rec(variant);
        checkLocation(pv?.["protein_location"], () => [...mBase(), "associated_protein_variants", v, "protein_location"]);
        checkLocation(pv?.["codon_genomic_location"], () => [
          ...mBase(),
          "associated_protein_variants",
          v,
          "codon_genomic_location",
        ]);
      });
      arr(h["associated_seq_variants"]).forEach((variant, v) => {
        checkLocation(variant, () => [...mBase(), "associated_seq_variants", v]);
      });
    });
  });

  // Detected microhaplotypes: the large section. Loop with plain indexes and
  // reuse the scratch sets, so no per-entry allocation happens unless an
  // issue is reported.
  const seenLibraries = new Map<number, number>();
  const seenTargets = new Map<number, number>();
  const seenMhaps = new Map<number, number>();
  const detected = arr(root["detected_microhaplotypes"]);
  for (let r = 0; r < detected.length; r++) {
    const run = rec(detected[r]);
    if (run === undefined) continue;
    checkIndex(run["bioinformatics_run_id"], "DetectedMicrohaplotypes.bioinformatics_run_id", "bioinformatics_run_info", () => [
      "detected_microhaplotypes",
      r,
      "bioinformatics_run_id",
    ]);
    const samples = arr(run["library_samples"]);
    seenLibraries.clear();
    for (let s = 0; s < samples.length; s++) {
      const sample = rec(samples[s]);
      if (sample === undefined) continue;
      const sBase = (): PathSegment[] => ["detected_microhaplotypes", r, "library_samples", s];
      const libraryId = sample["library_sample_id"];
      let panel: Set<number> | undefined;
      if (
        checkIndex(libraryId, "DetectedMicrohaplotypesForSample.library_sample_id", "library_sample_info", () => [
          ...sBase(),
          "library_sample_id",
        ]) &&
        isIndex(libraryId)
      ) {
        const earlier = seenLibraries.get(libraryId);
        if (earlier === undefined) seenLibraries.set(libraryId, s);
        else {
          out.report(
            "integrity/duplicate-library-sample-result",
            "warning",
            "DetectedMicrohaplotypesForSample.library_sample_id",
            () => [...sBase(), "library_sample_id"],
            (where) => ({
              message: `${where} is ${libraryId}, already listed at library_samples[${earlier}] of the same run`,
              details: { value: libraryId, firstIndex: earlier },
            }),
          );
        }
        const panelId = rec(libraries[libraryId])?.["panel_id"];
        if (isIndex(panelId)) panel = panelTargets[panelId];
      }
      const results = arr(sample["target_results"]);
      seenTargets.clear();
      for (let t = 0; t < results.length; t++) {
        const result = rec(results[t]);
        if (result === undefined) continue;
        const tBase = (): PathSegment[] => [...sBase(), "target_results", t];
        const mhapsTargetId = result["mhaps_target_id"];
        if (
          !checkIndex(
            mhapsTargetId,
            "DetectedMicrohaplotypesForTarget.mhaps_target_id",
            "representative_microhaplotypes.targets",
            () => [...tBase(), "mhaps_target_id"],
          ) ||
          !isIndex(mhapsTargetId)
        ) {
          continue; // its mhap_ids cannot be resolved
        }
        const earlier = seenTargets.get(mhapsTargetId);
        if (earlier === undefined) seenTargets.set(mhapsTargetId, t);
        else {
          out.report(
            "integrity/duplicate-target-result",
            "warning",
            "DetectedMicrohaplotypesForTarget.mhaps_target_id",
            () => [...tBase(), "mhaps_target_id"],
            (where) => ({
              message: `${where} is ${mhapsTargetId}, already listed at target_results[${earlier}] of the same library sample`,
              details: { value: mhapsTargetId, firstIndex: earlier },
            }),
          );
        }
        const targetId = repTargetIds[mhapsTargetId];
        if (panel !== undefined && targetId !== undefined && !panel.has(targetId)) {
          out.report(
            "integrity/target-not-in-panel",
            "warning",
            "DetectedMicrohaplotypesForTarget.mhaps_target_id",
            () => [...tBase(), "mhaps_target_id"],
            (where) => ({
              message: `${where} refers to target_info[${targetId}], which is not in the panel of library_sample_info[${String(libraryId)}]`,
              details: { targetId, librarySampleId: libraryId },
            }),
          );
        }
        const mhaps = arr(result["mhaps"]);
        const size = repSizes[mhapsTargetId] ?? 0;
        seenMhaps.clear();
        for (let m = 0; m < mhaps.length; m++) {
          const mhapId = rec(mhaps[m])?.["mhap_id"];
          if (isIndex(mhapId) && mhapId < size) {
            const first = seenMhaps.get(mhapId);
            if (first === undefined) seenMhaps.set(mhapId, m);
            else {
              out.report(
                "integrity/duplicate-mhap-id",
                "warning",
                "MicrohaplotypeForTarget.mhap_id",
                () => [...tBase(), "mhaps", m, "mhap_id"],
                (where) => ({
                  message: `${where} is ${mhapId}, already listed at mhaps[${first}] of the same target result`,
                  details: { value: mhapId, firstIndex: first },
                }),
              );
            }
            continue;
          }
          checkIndex(
            mhapId,
            "MicrohaplotypeForTarget.mhap_id",
            `representative_microhaplotypes.targets[${mhapsTargetId}].microhaplotypes`,
            () => [...tBase(), "mhaps", m, "mhap_id"],
            size,
          );
        }
      }
    }
  }

  // Read counts by stage.
  arr(root["read_counts_by_stage"]).forEach((entry, i) => {
    const e = rec(entry);
    if (e === undefined) return;
    checkIndex(e["bioinformatics_run_id"], "ReadCountsByStage.bioinformatics_run_id", "bioinformatics_run_info", () => [
      "read_counts_by_stage",
      i,
      "bioinformatics_run_id",
    ]);
    arr(e["read_counts_by_library_sample_by_stage"]).forEach((libEntry, j) => {
      const l = rec(libEntry);
      if (l === undefined) return;
      const lBase = (): PathSegment[] => ["read_counts_by_stage", i, "read_counts_by_library_sample_by_stage", j];
      checkIndex(l["library_sample_id"], "ReadCountsByStageForLibrarySample.library_sample_id", "library_sample_info", () => [
        ...lBase(),
        "library_sample_id",
      ]);
      arr(l["read_counts_for_targets"]).forEach((targetEntry, k) => {
        checkIndex(rec(targetEntry)?.["target_id"], "ReadCountsByStageForTarget.target_id", "target_info", () => [
          ...lBase(),
          "read_counts_for_targets",
          k,
          "target_id",
        ]);
      });
    });
  });

  return out.finish();
}
