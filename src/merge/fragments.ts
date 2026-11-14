/**
 * The inputs {@link mergeToPmo} consumes: PMO sections that refer to each other
 * by name rather than by index.
 *
 * Builder fragments are typed structurally and only as strictly as the merge
 * needs: the name fields it resolves, the containers it walks, and the other
 * keys builders are known to write (typed `unknown`, because the merge copies
 * them through without looking). Any other keys are copied through too. Arrays
 * are `readonly` so builder results with readonly arrays fit.
 *
 * Sequencing, bioinformatics-method, bioinformatics-run and project records are
 * never produced by a builder (the app builds them from forms), so they use the
 * PMO schema types directly: they contain no index that the merge resolves.
 */
import type {
  BioinformaticsMethodInfo,
  BioinformaticsRunInfo,
  ProjectInfo,
  SequencingInfo,
} from "../types/pmo.js";

/**
 * A name one section uses to refer to a record in another. pmotools-ts
 * builders write strings; fragments recorded from pmotools-python may hold
 * numbers. Names are compared as strings, so `101` and `"101"` match.
 */
export type Name = string | number;

/** One panel in `panel_info`. Referenced by `panel_name` from library samples. */
export interface PanelFragment {
  readonly panel_name: Name;
  readonly reactions?: unknown;
}

/** One target in `target_info`. Referenced by `target_name`. */
export interface TargetFragment {
  /** `null` when the panel table had no name in that row; such a target is never matched. */
  readonly target_name: Name | null;
}

/** What `panelInfoTableToPmo` returns. Extra keys such as `targeted_genomes` are copied into the PMO. */
export interface PanelTargetFragment {
  readonly panel_info: readonly PanelFragment[];
  readonly target_info: readonly TargetFragment[];
  readonly targeted_genomes?: unknown;
}

/** One target of `representative_microhaplotypes`, keyed by target name. */
export interface RepresentativeTargetFragment {
  /** Becomes `target_id`, an index into `target_info`. */
  readonly target_name: Name;
  readonly microhaplotypes?: unknown;
  readonly mhap_location?: unknown;
}

/** One library sample's detected microhaplotypes, keyed by name. */
export interface DetectedLibrarySampleFragment {
  /** Becomes `library_sample_id`, an index into `library_sample_info`. */
  readonly library_sample_name: Name;
  /**
   * Left as is. Each `mhaps_target_id` inside is already an index into
   * `representative_microhaplotypes.targets`, not into `target_info`.
   */
  readonly target_results?: unknown;
}

/** Detected microhaplotypes for one bioinformatics run. */
export interface DetectedRunFragment {
  readonly library_samples: readonly DetectedLibrarySampleFragment[];
  /** Becomes `bioinformatics_run_id` when run info is supplied; otherwise left as is. */
  readonly bioinformatics_run_name?: Name;
}

/** What `mhapTableToPmo` returns. */
export interface MhapFragment {
  readonly representative_microhaplotypes: { readonly targets: readonly RepresentativeTargetFragment[] };
  readonly detected_microhaplotypes: readonly DetectedRunFragment[];
}

/** One record from `specimenInfoTableToPmo`. Metadata columns are copied through. */
export interface SpecimenFragment {
  readonly specimen_name: Name;
  /** Becomes `project_id` when project info is supplied. */
  readonly project_name?: Name;
}

/** One record from `librarySampleInfoTableToPmo`. Metadata columns are copied through. */
export interface LibrarySampleFragment {
  readonly library_sample_name: Name;
  /**
   * Becomes `specimen_id`. Required when specimen info is also supplied; when
   * it is not, the merge replaces it with the library sample's own name.
   */
  readonly specimen_name?: Name;
  /** Becomes `panel_id`. The merge throws `merge/missing-name-field` when it is absent. */
  readonly panel_name?: Name;
  /** Becomes `sequencing_info_id` when sequencing info is supplied. */
  readonly sequencing_info_name?: Name;
}

/** Stage counts for one target, keyed by target name. */
export interface TargetReadCountsFragment {
  /** Becomes `target_id`. An entry without one is left without a `target_id`, as in Python. */
  readonly target_name?: Name | null;
  readonly stages?: unknown;
}

/** One library sample's read counts, keyed by name. */
export interface LibrarySampleReadCountsFragment {
  /** Becomes `library_sample_id`. */
  readonly library_sample_name: Name;
  readonly total_raw_count?: unknown;
  readonly read_counts_for_targets?: readonly TargetReadCountsFragment[] | null;
}

/** One entry from `readCountByStageTableToPmo`. */
export interface ReadCountsByStageFragment {
  readonly read_counts_by_library_sample_by_stage: readonly LibrarySampleReadCountsFragment[];
  /** Becomes `bioinformatics_run_id` when run info is supplied; otherwise left as is. */
  readonly bioinformatics_run_name?: Name;
}

/**
 * Everything {@link mergeToPmo} assembles. `mhapInfo` and `panelTargetInfo`
 * are required; leave out (or pass `null` for) any other section you do not
 * have. An empty array is not the same as leaving a section out: it is
 * supplied but has no records, as in Python.
 */
export interface MergeParts {
  readonly mhapInfo: MhapFragment;
  readonly panelTargetInfo: PanelTargetFragment;
  readonly specimenInfo?: readonly SpecimenFragment[] | null;
  readonly librarySampleInfo?: readonly LibrarySampleFragment[] | null;
  readonly sequencingInfo?: readonly SequencingInfo[] | null;
  readonly bioinfoMethodInfo?: readonly BioinformaticsMethodInfo[] | null;
  /** `bioinformatics_methods_id` is already an index into `bioinfoMethodInfo`; the merge does not resolve it. */
  readonly bioinfoRunInfo?: readonly BioinformaticsRunInfo[] | null;
  readonly projectInfo?: readonly ProjectInfo[] | null;
  readonly readCountsByStageInfo?: readonly ReadCountsByStageFragment[] | null;
}
