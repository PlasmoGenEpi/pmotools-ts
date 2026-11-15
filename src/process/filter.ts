/**
 * Subsetting a PMO: keeping some library samples, specimens or targets, or
 * only the microhaplotypes with enough reads. Ports the filters of
 * pmotools-python's `PMOProcessor`.
 *
 * Every filter returns a new PMO and leaves its argument untouched. Records
 * that stay are renumbered, and every reference to them is updated. Records
 * that are not filtered (panels, runs, projects and so on) are kept whole.
 */
import { PmoError } from "../errors.js";
import type {
  DetectedMicrohaplotypes,
  LibrarySampleInfo,
  PanelInfo,
  ReadCountsByStage,
  ReadCountsByStageForLibrarySample,
  RepresentativeMicrohaplotypesForTarget,
  SpecimenInfo,
  TargetInfo,
} from "../types/pmo.js";
import {
  getLibrarySampleNames,
  getSpecimenNames,
  getTargetNames,
  indexesOfNames,
} from "./names.js";
import { compareCodePoints, type PmoData } from "./table.js";

const copy = <T>(value: T): T => structuredClone(value);

/** The optional sections a filter carries over unchanged, when the PMO has them. */
function optionalSections(pmo: PmoData, keys: readonly (keyof PmoData)[]): Partial<PmoData> {
  const out: Record<string, unknown> = {};
  for (const key of keys) if (key in pmo) out[key] = copy(pmo[key]);
  return out;
}

/** The run id key, copied only when the source has it. */
function runId(
  source: DetectedMicrohaplotypes | ReadCountsByStage,
): { bioinformatics_run_id?: number | null } {
  return "bioinformatics_run_id" in source
    ? { bioinformatics_run_id: source.bioinformatics_run_id ?? null }
    : {};
}

/** Distinct ids, smallest first, after checking each is an index of a list `length` long. */
function checkedIds(
  ids: Iterable<number>,
  length: number,
  section: "library_sample_info" | "specimen_info",
): number[] {
  const unique = [...new Set(ids)].toSorted((a, b) => a - b);
  const bad = unique.filter((id) => !Number.isInteger(id) || id < 0 || id >= length);
  if (bad.length > 0) {
    throw new PmoError(
      `process/${section === "specimen_info" ? "specimen" : "library-sample"}-id-out-of-range`,
      `${bad.join(", ")} ${bad.length === 1 ? "is" : "are"} not an index of ${section}, which has ${length} ${length === 1 ? "entry" : "entries"}.`,
      { ids: bad, length },
    );
  }
  return unique;
}

/**
 * A PMO with only the library samples whose indexes are in `ids`, their
 * specimens, and their detected microhaplotypes and read counts. Library
 * samples and specimens keep their original order. Runs are kept, even when
 * none of their library samples remain.
 *
 * Throws a `PmoError` (`process/library-sample-id-out-of-range`) for an id
 * that is not an index of `library_sample_info`.
 */
export function filterPmoByLibrarySampleIds(pmo: PmoData, ids: Iterable<number>): PmoData {
  const libraryIds = checkedIds(ids, pmo.library_sample_info.length, "library_sample_info");
  const keep = new Set(libraryIds);

  const specimenIds = [
    ...new Set(libraryIds.map((id) => pmo.library_sample_info[id]?.specimen_id ?? -1)),
  ].toSorted((a, b) => a - b);
  const newSpecimenId = new Map(specimenIds.map((id, index) => [id, index]));
  const specimenInfo: SpecimenInfo[] = specimenIds.flatMap((id) => {
    const specimen = pmo.specimen_info[id];
    return specimen === undefined ? [] : [copy(specimen)];
  });

  const newLibraryId = new Map(libraryIds.map((id, index) => [id, index]));
  const librarySampleInfo: LibrarySampleInfo[] = libraryIds.flatMap((id) => {
    const library = pmo.library_sample_info[id];
    if (library === undefined) return [];
    return [{ ...copy(library), specimen_id: newSpecimenId.get(library.specimen_id) ?? -1 }];
  });

  const detected: DetectedMicrohaplotypes[] = pmo.detected_microhaplotypes.map((run) => ({
    library_samples: run.library_samples
      .filter((sample) => keep.has(sample.library_sample_id))
      .map((sample) => ({
        ...copy(sample),
        library_sample_id: newLibraryId.get(sample.library_sample_id) ?? -1,
      })),
    ...runId(run),
  }));

  const out: PmoData = {
    pmo_header: copy(pmo.pmo_header),
    panel_info: copy(pmo.panel_info),
    target_info: copy(pmo.target_info),
    representative_microhaplotypes: copy(pmo.representative_microhaplotypes),
    specimen_info: specimenInfo,
    library_sample_info: librarySampleInfo,
    detected_microhaplotypes: detected,
    ...optionalSections(pmo, [
      "sequencing_info",
      "project_info",
      "bioinformatics_methods_info",
      "bioinformatics_run_info",
      "targeted_genomes",
    ]),
  };
  if ("read_counts_by_stage" in pmo) {
    out.read_counts_by_stage = (pmo.read_counts_by_stage ?? []).map((run) => ({
      read_counts_by_library_sample_by_stage: run.read_counts_by_library_sample_by_stage
        .filter((sample) => keep.has(sample.library_sample_id))
        .map((sample) => ({
          ...copy(sample),
          library_sample_id: newLibraryId.get(sample.library_sample_id) ?? -1,
        })),
      ...runId(run),
    }));
  }
  return out;
}

/** {@link filterPmoByLibrarySampleIds} by name. Throws a `PmoError` (`process/unknown-library-sample-names`) for a name the PMO does not have. */
export function filterPmoByLibrarySampleNames(pmo: PmoData, names: Iterable<string>): PmoData {
  const sorted = [...new Set(names)].toSorted(compareCodePoints);
  return filterPmoByLibrarySampleIds(
    pmo,
    indexesOfNames(getLibrarySampleNames(pmo), sorted, "library-sample"),
  );
}

/**
 * A PMO with only the specimens whose indexes are in `ids`. Specimens are
 * chosen through their library samples, so a specimen with none is not kept.
 *
 * Throws a `PmoError` (`process/specimen-id-out-of-range`) for an id that is
 * not an index of `specimen_info`.
 */
export function filterPmoBySpecimenIds(pmo: PmoData, ids: Iterable<number>): PmoData {
  const keep = new Set(checkedIds(ids, pmo.specimen_info.length, "specimen_info"));
  const libraryIds = pmo.library_sample_info.flatMap((library, index) =>
    keep.has(library.specimen_id) ? [index] : [],
  );
  return filterPmoByLibrarySampleIds(pmo, libraryIds);
}

/** {@link filterPmoBySpecimenIds} by name. Throws a `PmoError` (`process/unknown-specimen-names`) for a name the PMO does not have. */
export function filterPmoBySpecimenNames(pmo: PmoData, names: Iterable<string>): PmoData {
  const sorted = [...new Set(names)].toSorted(compareCodePoints);
  return filterPmoBySpecimenIds(pmo, indexesOfNames(getSpecimenNames(pmo), sorted, "specimen"));
}

/**
 * A PMO with only the targets whose indexes are in `ids`: in `target_info`,
 * the panels' reactions (a reaction left with no target is dropped), the
 * representative and detected microhaplotypes, and the read counts per
 * target. Library samples are all kept, even with no results left.
 *
 * Throws a `PmoError` (`process/target-ids`) when an id is not an index of
 * `target_info`, or when a target has no representative microhaplotypes,
 * which happens to a panel target no sample showed. Every such id is in
 * `details.outOfRange` or `details.withoutMicrohaplotypes`.
 */
export function filterPmoByTargetIds(pmo: PmoData, ids: Iterable<number>): PmoData {
  const targetIds = [...new Set(ids)];
  const keep = new Set(targetIds);
  const length = pmo.target_info.length;
  const outOfRange = targetIds.filter((id) => !Number.isInteger(id) || id < 0 || id >= length);
  const represented = new Set(pmo.representative_microhaplotypes.targets.map((t) => t.target_id));
  const withoutMicrohaplotypes = targetIds.filter((id) => !represented.has(id));
  if (outOfRange.length > 0 || withoutMicrohaplotypes.length > 0) {
    const parts = [
      outOfRange.length === 0
        ? null
        : `${outOfRange.join(", ")} not an index of target_info, which has ${length} entries`,
      withoutMicrohaplotypes.length === 0
        ? null
        : `no representative microhaplotypes for target ${withoutMicrohaplotypes.join(", ")}`,
    ].filter((part) => part !== null);
    throw new PmoError("process/target-ids", `${parts.join("; ")}.`, {
      outOfRange,
      withoutMicrohaplotypes,
    });
  }

  const newTargetId = new Map<number, number>();
  const targetInfo: TargetInfo[] = [];
  pmo.target_info.forEach((target, index) => {
    if (keep.has(index)) {
      newTargetId.set(index, targetInfo.length);
      targetInfo.push(copy(target));
    }
  });

  const panelInfo: PanelInfo[] = pmo.panel_info.map((panel) => ({
    panel_name: panel.panel_name,
    reactions: panel.reactions
      .map((reaction) => ({
        reaction_name: reaction.reaction_name,
        panel_targets: reaction.panel_targets
          .filter((id) => keep.has(id))
          .map((id) => newTargetId.get(id) ?? -1),
      }))
      .filter((reaction) => reaction.panel_targets.length > 0),
  }));

  const newMhapsTargetId = new Map<number, number>();
  const representative: RepresentativeMicrohaplotypesForTarget[] = [];
  pmo.representative_microhaplotypes.targets.forEach((target, index) => {
    if (keep.has(target.target_id)) {
      newMhapsTargetId.set(index, representative.length);
      representative.push({ ...copy(target), target_id: newTargetId.get(target.target_id) ?? -1 });
    }
  });

  const detected: DetectedMicrohaplotypes[] = pmo.detected_microhaplotypes.map((run) => ({
    library_samples: run.library_samples.map((sample) => ({
      library_sample_id: sample.library_sample_id,
      target_results: sample.target_results
        .filter((result) => newMhapsTargetId.has(result.mhaps_target_id))
        .map((result) => ({
          ...copy(result),
          mhaps_target_id: newMhapsTargetId.get(result.mhaps_target_id) ?? -1,
        })),
    })),
    ...runId(run),
  }));

  const out: PmoData = {
    pmo_header: copy(pmo.pmo_header),
    specimen_info: copy(pmo.specimen_info),
    library_sample_info: copy(pmo.library_sample_info),
    target_info: targetInfo,
    ...optionalSections(pmo, [
      "sequencing_info",
      "project_info",
      "bioinformatics_methods_info",
      "bioinformatics_run_info",
      "targeted_genomes",
    ]),
    panel_info: panelInfo,
    representative_microhaplotypes: { targets: representative },
    detected_microhaplotypes: detected,
  };
  if ("read_counts_by_stage" in pmo) {
    out.read_counts_by_stage = (pmo.read_counts_by_stage ?? []).map((run) => ({
      read_counts_by_library_sample_by_stage: run.read_counts_by_library_sample_by_stage.map(
        (sample): ReadCountsByStageForLibrarySample => ({
          library_sample_id: sample.library_sample_id,
          total_raw_count: sample.total_raw_count,
          ...("read_counts_for_targets" in sample
            ? {
                read_counts_for_targets: (sample.read_counts_for_targets ?? [])
                  .filter((target) => keep.has(target.target_id))
                  .map((target) => ({
                    ...copy(target),
                    target_id: newTargetId.get(target.target_id) ?? -1,
                  })),
              }
            : {}),
        }),
      ),
      ...runId(run),
    }));
  }
  return out;
}

/** {@link filterPmoByTargetIds} by name. Throws a `PmoError` (`process/unknown-target-names`) for a name the PMO does not have. */
export function filterPmoByTargetNames(pmo: PmoData, names: Iterable<string>): PmoData {
  const sorted = [...new Set(names)].toSorted(compareCodePoints);
  return filterPmoByTargetIds(pmo, indexesOfNames(getTargetNames(pmo), sorted, "target"));
}

/**
 * A PMO with only the detected microhaplotypes that have at least
 * `readFilter` reads. A target left with none is dropped from that library
 * sample's results, and a library sample left with no targets is dropped from
 * that run. Everything else, including the representative microhaplotypes
 * and the read counts by stage, is kept as it was.
 */
export function extractFromPmoWithReadFilter(pmo: PmoData, readFilter: number): PmoData {
  const detected: DetectedMicrohaplotypes[] = pmo.detected_microhaplotypes.map((run) => ({
    ...runId(run),
    library_samples: run.library_samples.flatMap((sample) => {
      const targetResults = sample.target_results.flatMap((result) => {
        const mhaps = result.mhaps.filter((mhap) => mhap.reads >= readFilter).map(copy);
        return mhaps.length === 0 ? [] : [{ mhaps_target_id: result.mhaps_target_id, mhaps }];
      });
      return targetResults.length === 0
        ? []
        : [{ library_sample_id: sample.library_sample_id, target_results: targetResults }];
    }),
  }));
  return {
    pmo_header: copy(pmo.pmo_header),
    panel_info: copy(pmo.panel_info),
    target_info: copy(pmo.target_info),
    specimen_info: copy(pmo.specimen_info),
    library_sample_info: copy(pmo.library_sample_info),
    representative_microhaplotypes: copy(pmo.representative_microhaplotypes),
    detected_microhaplotypes: detected,
    ...optionalSections(pmo, [
      "sequencing_info",
      "project_info",
      "targeted_genomes",
      "bioinformatics_methods_info",
      "bioinformatics_run_info",
      "read_counts_by_stage",
    ]),
  };
}
