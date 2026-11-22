/**
 * Port of `pmotools.pmo_builder.merge_to_pmo` (pmotools-python v1.2.2), with
 * `create_minimum_library_specimen_dict_from_mhap_table` from
 * `mhap_table_to_pmo` for the records the merge creates.
 *
 * The builders each turn one table into a fragment that refers to other
 * sections by name. The merge creates any missing specimen and library-sample
 * records, replaces every name with the index the PMO format uses, reports
 * names that do not resolve, and adds the header.
 *
 * Deliberate differences from Python (each recorded as a `divergence` in
 * `conformance/cases/merge`):
 *
 * - Names are compared as strings on both sides. Python calls `str()` on the
 *   referring record but not on the referenced one, so numeric names never
 *   resolve there. Records the merge creates carry names as strings.
 * - When library-sample records are created from the detected
 *   microhaplotypes, duplicate names are an error only within one run. One
 *   library sample analysed in several runs gets one record (Python raises).
 * - Specimens added for library samples missing from `specimenInfo` are
 *   appended in first-seen order (Python uses set order, which varies).
 * - Malformed input (a missing name key, an empty `panel_info`) throws
 *   `PmoError` where Python crashes with `KeyError` or `IndexError`.
 */
import { PmoError, warn, type WarningOptions } from "../errors.js";
import { compareCodePoints } from "../table/core.js";
import type { PortableMicrohaplotypeObject } from "../types/pmo.js";
import type { MergeParts } from "./fragments.js";

/** The version of pmotools-ts written into `pmo_header.generation_method`. */
export const PMOTOOLS_TS_VERSION = "0.1.0";

/** The PMO schema version the merge writes as `pmo_header.pmo_version`, as pmotools-python does. */
export const PMO_SCHEMA_VERSION = "1.1.0";

/** Options for {@link mergeToPmo}. */
export interface MergeToPmoOptions extends WarningOptions {
  /**
   * `pmo_header.creation_date`, normally `YYYY-MM-DD`. Defaults to today's
   * local date in that form, as Python's `date.today().isoformat()` writes it.
   */
  readonly creationDate?: string;
  /**
   * Share each representative target's `microhaplotypes` and each detected
   * library sample's `target_results` with `mhapInfo` instead of copying
   * them. They hold nearly all of a large PMO and the merge never changes
   * them, so sharing halves the memory a large merge needs. Then treat
   * `mhapInfo` and the result as read-only, since a change to one shows in
   * the other. Default `false`: the result shares nothing with the inputs.
   */
  readonly shareMicrohaplotypes?: boolean;
}

type Rec = Record<string, unknown>;

/** The ten kinds of reference the merge resolves, in the order Python reports them. */
const REFERENCE_KINDS = [
  ["projects", "Project names in Specimen Info not in Project Info"],
  ["sequencing", "Sequencing names in Library Sample Info not in Sequencing Info"],
  ["specimens", "Specimen names in Library Sample Info not in Specimen Info"],
  ["panels", "Panel names in Library Sample Info not in Panel Info"],
  ["targets", "Target names in Representative Microhaplotypes not in Target Info"],
  ["bioinformaticsRuns", "Bioinformatics run names in Detected Microhaplotypes not in Bioinformatic Run Info"],
  ["librarySamples", "Library Sample names in Detected Microhaplotypes not in Library Sample Info"],
  ["readCountsBioinformaticsRuns", "Bioinformatics run names in Read Counts by Stage not in Bioinformatic Run Info"],
  ["readCountsLibrarySamples", "Library Sample names in Read Counts by Stage not in Library Sample Info"],
  ["readCountsTargets", "Target names in Read Counts by Stage not in Target Info"],
] as const;

/** One kind of reference the merge resolves. */
export type ReferenceKind = (typeof REFERENCE_KINDS)[number][0];

/** How many example records {@link MissingNameField} lists. */
const MAX_EXAMPLES = 5;

/** A record that lacks a name field, identified by position and, when it has one, its own name. */
export type MissingNameExample = {
  /**
   * Position in the part's list: `specimenInfo`, `librarySampleInfo`,
   * `readCountsByStageInfo`, or `mhapInfo.detected_microhaplotypes`.
   */
  readonly index: number;
  /** The record's own `specimen_name` or `library_sample_name`. Absent for runs, which have no other name. */
  readonly name?: string;
};

/** One set of records that lack a name field the merge needs to link them to a supplied part. */
export type MissingNameField = {
  /** The part whose records lack the field. For `mhapInfo` the records are `detected_microhaplotypes`. */
  readonly part: "specimenInfo" | "librarySampleInfo" | "mhapInfo" | "readCountsByStageInfo";
  /** The missing field, such as `project_name`. */
  readonly field: "project_name" | "sequencing_info_name" | "bioinformatics_run_name";
  /** The supplied part the field would link to: `projectInfo`, `sequencingInfo` or `bioinfoRunInfo`. */
  readonly linksTo: "projectInfo" | "sequencingInfo" | "bioinfoRunInfo";
  /** How many records lack it. */
  readonly count: number;
  /** Up to five of those records, first first. */
  readonly examples: readonly MissingNameExample[];
};

/** `details` of the `merge/incomplete-name-fields` error. */
export type IncompleteNameFieldsDetails = {
  /** One entry per problem, in the order of the lines in the message. */
  readonly missing: readonly MissingNameField[];
  /** The message's lines, one per problem. Prefer `missing`. */
  readonly problems: readonly string[];
};

/**
 * Assembles builder fragments into one Portable Microhaplotype Object.
 *
 * `mhapInfo` and `panelTargetInfo` are required. When neither specimen nor
 * library-sample info is given, one library sample and one specimen are
 * created per library sample in the detected microhaplotypes (only allowed
 * with a single panel). With specimen info alone, library samples are created
 * the same way and assigned to the first panel; library samples without a
 * specimen get a bare specimen record and a warning. With library-sample info
 * alone, each library sample becomes its own specimen.
 *
 * Every name is then replaced by the index of the record it names. Names that
 * do not resolve are collected across all sections and reported together.
 *
 * The inputs are never modified, and the result shares no objects with them
 * unless `shareMicrohaplotypes` is set.
 * The merge resolves references; it does not check the rest of the content
 * against the schema. Validate the result for that.
 *
 * @throws {PmoError} `merge/missing-required-fields`, `merge/runs-without-methods`,
 *   `merge/several-panels-without-sample-info`, `merge/no-panels`,
 *   `merge/duplicate-library-sample-names`, `merge/missing-name-field`,
 *   `merge/malformed-input`, `merge/incomplete-name-fields` (details:
 *   {@link IncompleteNameFieldsDetails}) or `merge/unresolved-names` (details:
 *   one array of names per {@link ReferenceKind}).
 *
 * @example
 * const pmo = mergeToPmo(
 *   { mhapInfo, panelTargetInfo, specimenInfo },
 *   { onWarning: (w) => console.warn(w.message) },
 * );
 */
export function mergeToPmo(parts: MergeParts, options: MergeToPmoOptions = {}): PortableMicrohaplotypeObject {
  const { onWarning } = options;
  // Clone up front, as Python deep-copies: everything below edits the copies.
  const mhapInfo = options.shareMicrohaplotypes === true
    ? requireRecord(cloneSharing(parts.mhapInfo, SHARED_PATHS), "mhapInfo")
    : cloneRecord(parts.mhapInfo, "mhapInfo");
  const panelTargetInfo = cloneRecord(parts.panelTargetInfo, "panelTargetInfo");
  let specimenInfo = cloneList(parts.specimenInfo, "specimenInfo");
  let librarySampleInfo = cloneList(parts.librarySampleInfo, "librarySampleInfo");
  const sequencingInfo = cloneList(parts.sequencingInfo, "sequencingInfo");
  const bioinfoMethodInfo = cloneList(parts.bioinfoMethodInfo, "bioinfoMethodInfo");
  const bioinfoRunInfo = cloneList(parts.bioinfoRunInfo, "bioinfoRunInfo");
  const projectInfo = cloneList(parts.projectInfo, "projectInfo");
  const readCountsByStageInfo = cloneList(parts.readCountsByStageInfo, "readCountsByStageInfo");

  const missingFields: string[] = [];
  if (!Object.hasOwn(panelTargetInfo, "panel_info")) missingFields.push("panel_info");
  if (!Object.hasOwn(panelTargetInfo, "target_info")) missingFields.push("target_info");
  if (!Object.hasOwn(mhapInfo, "representative_microhaplotypes")) missingFields.push("representative_microhaplotypes");
  if (!Object.hasOwn(mhapInfo, "detected_microhaplotypes")) missingFields.push("detected_microhaplotypes");
  if (missingFields.length > 0) {
    throw new PmoError(
      "merge/missing-required-fields",
      `Missing required fields for panelTargetInfo or mhapInfo: ${missingFields.join(", ")}`,
      { fields: missingFields },
    );
  }

  if (bioinfoRunInfo !== null && bioinfoMethodInfo === null) {
    throw new PmoError(
      "merge/runs-without-methods",
      "bioinfoMethodInfo must be provided if bioinfoRunInfo is provided",
      { part: "bioinfoMethodInfo", requiredBy: "bioinfoRunInfo" },
    );
  }

  const panels = recordList(panelTargetInfo["panel_info"], "panel_info");
  const detected = recordList(mhapInfo["detected_microhaplotypes"], "detected_microhaplotypes");

  if (specimenInfo !== null && librarySampleInfo === null) {
    librarySampleInfo = minimumLibrarySampleInfo(detected, firstPanelName(panels));
    const specimens = specimenInfo;
    const libraryNames = librarySampleInfo.map((library) => library["library_sample_name"]);
    const specimenNames = specimens.map((specimen, index) =>
      requireField(specimen, "specimen_name", `specimenInfo[${index}]`),
    );
    const specimenKeys = new Set(specimenNames.map(nameKey));
    const libraryKeys = new Set(libraryNames.map(nameKey));
    const missingInSpecimen = libraryNames.filter((name) => !specimenKeys.has(nameKey(name)));
    const missingInLibrary = uniqueNames(specimenNames.filter((name) => !libraryKeys.has(nameKey(name))));
    for (const name of missingInSpecimen) specimens.push({ specimen_name: nameText(name) });
    if (missingInSpecimen.length > 0) {
      const names = sortedDisplay(missingInSpecimen);
      warn(
        onWarning,
        "merge/specimens-added",
        `Library sample names in the detected microhaplotypes have no matching specimen_name: ${names.join(", ")}. ` +
          "They were added to specimen info with no metadata.",
        { names },
      );
    }
    if (missingInLibrary.length > 0) {
      const names = sortedDisplay(missingInLibrary);
      warn(
        onWarning,
        "merge/specimens-without-library-samples",
        `Specimen names were supplied that have no matching library sample in the detected microhaplotypes: ${names.join(", ")}`,
        { names },
      );
    }
  }

  if (specimenInfo === null && librarySampleInfo === null) {
    if (panels.length > 1) {
      throw new PmoError(
        "merge/several-panels-without-sample-info",
        "With several panels, specimen info and library sample info must also be provided to say which panel " +
          `each library sample used. Otherwise provide a single panel. Panels found: ${panels.length}`,
        { panelCount: panels.length },
      );
    }
    librarySampleInfo = minimumLibrarySampleInfo(detected, firstPanelName(panels));
    specimenInfo = minimumSpecimenInfo(librarySampleInfo);
  } else if (specimenInfo === null && librarySampleInfo !== null) {
    // Library-sample info alone: each library sample is its own specimen.
    const libraries = librarySampleInfo;
    libraries.forEach((library, index) => {
      library["specimen_name"] = requireField(library, "library_sample_name", `librarySampleInfo[${index}]`);
    });
    specimenInfo = libraries.map((library) => ({ specimen_name: nameText(library["library_sample_name"]) }));
  }
  if (specimenInfo === null || librarySampleInfo === null) {
    // Unreachable: every branch above fills both. Kept so the types narrow.
    throw new PmoError("merge/malformed-input", "Specimen and library sample info could not be determined");
  }

  replaceNamesWithIds({
    specimenInfo,
    librarySampleInfo,
    panelTargetInfo,
    mhapInfo,
    detected,
    projectInfo,
    sequencingInfo,
    bioinfoRunInfo,
    readCountsByStageInfo,
  });

  const pmo: Rec = {
    pmo_header: pmoHeader(options.creationDate ?? today()),
    library_sample_info: librarySampleInfo,
    specimen_info: specimenInfo,
    ...panelTargetInfo,
    ...mhapInfo,
  };
  if (sequencingInfo !== null && sequencingInfo.length > 0) pmo["sequencing_info"] = sequencingInfo;
  if (bioinfoMethodInfo !== null && bioinfoMethodInfo.length > 0) pmo["bioinformatics_methods_info"] = bioinfoMethodInfo;
  if (bioinfoRunInfo !== null && bioinfoRunInfo.length > 0) pmo["bioinformatics_run_info"] = bioinfoRunInfo;
  if (projectInfo !== null && projectInfo.length > 0) pmo["project_info"] = projectInfo;
  if (readCountsByStageInfo !== null) pmo["read_counts_by_stage"] = readCountsByStageInfo;
  // Every reference is now an index. The remaining content is the builders'
  // and is not re-checked here; schema validation is a separate step.
  return pmo as PortableMicrohaplotypeObject;
}

/** The header Python writes, naming pmotools-ts as the program. */
function pmoHeader(creationDate: string): Rec {
  return {
    pmo_version: PMO_SCHEMA_VERSION,
    creation_date: creationDate,
    generation_method: { program_name: "pmotools-ts", program_version: PMOTOOLS_TS_VERSION },
  };
}

/** Today's local date as `YYYY-MM-DD`. */
function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Records the merge creates
// ---------------------------------------------------------------------------

function firstPanelName(panels: readonly Rec[]): unknown {
  const first = panels[0];
  if (first === undefined) {
    throw new PmoError("merge/no-panels", "panel_info has no panels, so library samples cannot be assigned one", {
      part: "panelTargetInfo",
      field: "panel_info",
    });
  }
  return requireField(first, "panel_name", "panel_info[0]");
}

/**
 * Port of `create_minimum_library_specimen_dict_from_mhap_table` with its
 * defaults (no library-to-specimen key): one library sample per distinct name
 * in the detected microhaplotypes, each its own specimen, all on one panel.
 */
function minimumLibrarySampleInfo(detected: readonly Rec[], panelName: unknown): Rec[] {
  const runs = detected.map((run, runIndex) =>
    Object.hasOwn(run, "library_samples")
      ? recordList(run["library_samples"], `detected_microhaplotypes[${runIndex}].library_samples`)
      : [],
  );
  const unnamed: number[] = [];
  let position = 0;
  for (const samples of runs) {
    for (const sample of samples) {
      if (!Object.hasOwn(sample, "library_sample_name")) unnamed.push(position);
      position += 1;
    }
  }
  if (unnamed.length > 0) {
    throw new PmoError(
      "merge/missing-name-field",
      `Detected library samples at positions ${unnamed.join(", ")} have no library_sample_name`,
      { field: "library_sample_name", section: "detected_microhaplotypes", positions: unnamed },
    );
  }

  // Divergence: duplicates are checked within each run, not across runs.
  const duplicates: unknown[] = [];
  for (const samples of runs) {
    const seen = new Set<string>();
    for (const sample of samples) {
      const name = sample["library_sample_name"];
      const key = nameKey(name) ?? String(name);
      if (seen.has(key)) duplicates.push(name);
      seen.add(key);
    }
  }
  if (duplicates.length > 0) {
    const names = sortedDisplay(uniqueNames(duplicates));
    throw new PmoError(
      "merge/duplicate-library-sample-names",
      `Duplicate library sample names found within one bioinformatics run: ${names.join(", ")}`,
      { names },
    );
  }

  const libraries: Rec[] = [];
  const seen = new Set<string>();
  for (const samples of runs) {
    for (const sample of samples) {
      const name = sample["library_sample_name"];
      const key = nameKey(name) ?? String(name);
      if (seen.has(key)) continue;
      seen.add(key);
      libraries.push({ library_sample_name: nameText(name), panel_name: panelName, specimen_name: nameText(name) });
    }
  }
  return libraries;
}

/** One specimen per distinct `specimen_name` of the created library samples, first seen first. */
function minimumSpecimenInfo(libraries: readonly Rec[]): Rec[] {
  return uniqueNames(libraries.map((library) => library["specimen_name"])).map((name) => ({ specimen_name: name }));
}

// ---------------------------------------------------------------------------
// Name-to-index replacement
// ---------------------------------------------------------------------------

interface Sections {
  readonly specimenInfo: Rec[];
  readonly librarySampleInfo: Rec[];
  readonly panelTargetInfo: Rec;
  readonly mhapInfo: Rec;
  readonly detected: readonly Rec[];
  readonly projectInfo: Rec[] | null;
  readonly sequencingInfo: Rec[] | null;
  readonly bioinfoRunInfo: Rec[] | null;
  readonly readCountsByStageInfo: Rec[] | null;
}

/** Port of `_replace_names_with_IDs`: edits the (cloned) sections in place, then reports. */
function replaceNamesWithIds(sections: Sections): void {
  const { specimenInfo, librarySampleInfo, panelTargetInfo, mhapInfo, detected } = sections;
  const { projectInfo, sequencingInfo, bioinfoRunInfo, readCountsByStageInfo } = sections;
  const missing = new Map<ReferenceKind, string[]>(REFERENCE_KINDS.map(([kind]) => [kind, []]));
  const report = (kind: ReferenceKind, names: readonly string[]): void => {
    missing.get(kind)?.push(...names);
  };

  // Specimens: project_name -> project_id, only when every specimen has one.
  const missingProjectNames =
    projectInfo === null ? null : missingNameField("specimenInfo", specimenInfo, "project_name", "projectInfo", "specimen_name");
  const anyMissingProjectNames = missingProjectNames !== null;
  if (projectInfo !== null && !anyMissingProjectNames) {
    report("projects", replaceKeyWithId(specimenInfo, "specimenInfo", projectInfo, "project_name", "project_id"));
  }

  // Library samples: specimen_name, panel_name, then sequencing_info_name.
  const panels = recordList(panelTargetInfo["panel_info"], "panel_info");
  report("specimens", replaceKeyWithId(librarySampleInfo, "librarySampleInfo", specimenInfo, "specimen_name", "specimen_id"));
  report("panels", replaceKeyWithId(librarySampleInfo, "librarySampleInfo", panels, "panel_name", "panel_id"));
  const missingSequencingNames =
    sequencingInfo === null
      ? null
      : missingNameField("librarySampleInfo", librarySampleInfo, "sequencing_info_name", "sequencingInfo", "library_sample_name");
  const anyMissingSequencingNames = missingSequencingNames !== null;
  if (sequencingInfo !== null && !anyMissingSequencingNames) {
    report(
      "sequencing",
      replaceKeyWithId(librarySampleInfo, "librarySampleInfo", sequencingInfo, "sequencing_info_name", "sequencing_info_id"),
    );
  }

  // Representative targets: target_name -> target_id, an index into target_info.
  // mhaps_target_id in the detected results indexes these targets and is not touched.
  const targetInfo = recordList(panelTargetInfo["target_info"], "target_info");
  const representative = requireRecord(mhapInfo["representative_microhaplotypes"], "representative_microhaplotypes");
  const representativeTargets = recordList(
    requireContainer(representative, "targets", "representative_microhaplotypes"),
    "representative_microhaplotypes.targets",
  );
  const targetLookup = makeLookup(targetInfo, "target_info", "target_name");
  report(
    "targets",
    replaceKeyWithId(representativeTargets, "representative_microhaplotypes.targets", targetInfo, "target_name", "target_id", targetLookup),
  );

  // Detected microhaplotypes: bioinformatics_run_name, then library_sample_name.
  const missingRunNames =
    bioinfoRunInfo === null ? null : missingNameField("mhapInfo", detected, "bioinformatics_run_name", "bioinfoRunInfo");
  const anyMissingRunNames = missingRunNames !== null;
  if (bioinfoRunInfo !== null && !anyMissingRunNames) {
    report(
      "bioinformaticsRuns",
      replaceKeyWithId(detected, "detected_microhaplotypes", bioinfoRunInfo, "bioinformatics_run_name", "bioinformatics_run_id"),
    );
  }
  const libraryLookup = makeLookup(librarySampleInfo, "librarySampleInfo", "library_sample_name");
  detected.forEach((run, index) => {
    const where = `detected_microhaplotypes[${index}]`;
    const samples = recordList(requireContainer(run, "library_samples", where), `${where}.library_samples`);
    report(
      "librarySamples",
      replaceKeyWithId(samples, `${where}.library_samples`, librarySampleInfo, "library_sample_name", "library_sample_id", libraryLookup),
    );
  });

  // Read counts by stage.
  let readCountsMissingRunNames: MissingNameField | null = null;
  let anyReadCountsMissingRunNames = false;
  if (readCountsByStageInfo !== null) {
    readCountsMissingRunNames = missingNameField(
      "readCountsByStageInfo",
      readCountsByStageInfo,
      "bioinformatics_run_name",
      "bioinfoRunInfo",
    );
    anyReadCountsMissingRunNames = readCountsMissingRunNames !== null;
    if (!anyReadCountsMissingRunNames && bioinfoRunInfo !== null) {
      report(
        "readCountsBioinformaticsRuns",
        replaceKeyWithId(
          readCountsByStageInfo,
          "readCountsByStageInfo",
          bioinfoRunInfo,
          "bioinformatics_run_name",
          "bioinformatics_run_id",
        ),
      );
    }
    readCountsByStageInfo.forEach((run, index) => {
      const where = `readCountsByStageInfo[${index}]`;
      const key = "read_counts_by_library_sample_by_stage";
      const libraries = recordList(requireContainer(run, key, where), `${where}.${key}`);
      report(
        "readCountsLibrarySamples",
        replaceKeyWithId(libraries, `${where}.${key}`, librarySampleInfo, "library_sample_name", "library_sample_id", libraryLookup),
      );
      libraries.forEach((library, libraryIndex) => {
        const targets = library["read_counts_for_targets"];
        if (targets === null || targets === undefined) return;
        const entries = recordList(targets, `${where}.${key}[${libraryIndex}].read_counts_for_targets`);
        for (const entry of entries) {
          // Python pops with a default and skips entries with no name.
          if (!Object.hasOwn(entry, "target_name")) continue;
          const name = entry["target_name"];
          delete entry["target_name"];
          if (name === null || name === undefined) continue;
          const id = lookupName(targetLookup, name);
          if (id === undefined) report("readCountsTargets", [displayName(name)]);
          else entry["target_id"] = id;
        }
      });
    });
  }

  // Python raises these as one exception it calls "warnings".
  const problems: string[] = [];
  const missingNames: MissingNameField[] = [];
  if (missingProjectNames !== null && projectInfo !== null && projectInfo.length > 0) {
    problems.push("project info provided but there are specimens missing the project_name field");
    missingNames.push(missingProjectNames);
  }
  if (missingSequencingNames !== null && sequencingInfo !== null && sequencingInfo.length > 0) {
    problems.push("sequencing info provided but there are library samples missing the sequencing_info_name field");
    missingNames.push(missingSequencingNames);
  }
  const runsGiven = bioinfoRunInfo !== null && bioinfoRunInfo.length > 0;
  if (missingRunNames !== null && runsGiven) {
    problems.push(
      "bioinformatics run info provided but there are detected microhaplotypes missing the bioinformatics_run_name field",
    );
    missingNames.push(missingRunNames);
  }
  if (readCountsMissingRunNames !== null && runsGiven) {
    problems.push("bioinformatics run info provided but there are read counts by stage missing the bioinformatics_run_name field");
    missingNames.push(readCountsMissingRunNames);
  }
  if (problems.length > 0) {
    const details: IncompleteNameFieldsDetails = { missing: missingNames, problems };
    throw new PmoError("merge/incomplete-name-fields", `Names are missing in some records:\n${problems.join("\n")}`, details);
  }

  reportUnresolved(missing);
}

/**
 * The records that lack `field`, or `null` when none do. `nameField` is the
 * record's own name, shown in the examples.
 */
function missingNameField(
  part: MissingNameField["part"],
  records: readonly Rec[],
  field: MissingNameField["field"],
  linksTo: MissingNameField["linksTo"],
  nameField?: string,
): MissingNameField | null {
  let count = 0;
  const examples: MissingNameExample[] = [];
  records.forEach((record, index) => {
    if (Object.hasOwn(record, field)) return;
    count += 1;
    if (examples.length >= MAX_EXAMPLES) return;
    const name = nameField === undefined ? null : nameKey(record[nameField]);
    examples.push(name === null ? { index } : { index, name });
  });
  return count === 0 ? null : { part, field, linksTo, count, examples };
}

/** Port of `_report_missing_IDs`: one error listing every kind of unresolved name. */
function reportUnresolved(missing: ReadonlyMap<ReferenceKind, readonly string[]>): void {
  const details: Record<string, string[]> = {};
  const lines: string[] = [];
  for (const [kind, label] of REFERENCE_KINDS) {
    const names = uniqueNames(missing.get(kind) ?? []);
    details[kind] = names;
    if (names.length > 0) lines.push(`${label}: ${names.join(", ")}`);
  }
  if (lines.length > 0) {
    throw new PmoError(
      "merge/unresolved-names",
      `The following names were found in one table and not another:\n${lines.join("\n")}`,
      details,
    );
  }
}

/**
 * Port of `_replace_key_with_id`: on each record, removes `nameField` and
 * appends `idField` holding the index of the reference record with that name
 * (`null` when there is none). Returns the names that did not resolve.
 */
function replaceKeyWithId(
  records: readonly Rec[],
  where: string,
  reference: readonly Rec[],
  nameField: string,
  idField: string,
  lookup: ReadonlyMap<string, number> = makeLookup(reference, "reference", nameField),
): string[] {
  const unresolved: string[] = [];
  const seen = new Set<string>();
  records.forEach((record, index) => {
    const name = requireField(record, nameField, `${where}[${index}]`);
    delete record[nameField];
    const id = lookupName(lookup, name);
    record[idField] = id ?? null;
    const shown = displayName(name);
    if (id === undefined && !seen.has(shown)) {
      seen.add(shown);
      unresolved.push(shown);
    }
  });
  return unresolved;
}

/** Port of `_make_lookup`: name to index. A later duplicate name wins, as in Python. */
function makeLookup(records: readonly Rec[], where: string, nameField: string): Map<string, number> {
  const lookup = new Map<string, number>();
  records.forEach((record, index) => {
    const key = nameKey(requireField(record, nameField, `${where}[${index}]`));
    if (key !== null) lookup.set(key, index);
  });
  return lookup;
}

function lookupName(lookup: ReadonlyMap<string, number>, name: unknown): number | undefined {
  const key = nameKey(name);
  return key === null ? undefined : lookup.get(key);
}

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------

/** The string a name is compared by: strings as they are, numbers in decimal. Anything else never matches. */
function nameKey(name: unknown): string | null {
  if (typeof name === "string") return name;
  if (typeof name === "number" && Number.isFinite(name)) return String(name);
  return null;
}

/** A name as the merge writes it into records it creates: numbers become strings. */
function nameText(name: unknown): unknown {
  return typeof name === "number" ? String(name) : name;
}

function displayName(name: unknown): string {
  return nameKey(name) ?? String(name);
}

/** Distinct names in first-seen order, compared as strings. */
function uniqueNames<T>(names: readonly T[]): T[] {
  const seen = new Set<string>();
  return names.filter((name) => {
    const key = displayName(name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortedDisplay(names: readonly unknown[]): string[] {
  return uniqueNames(names.map(displayName)).sort(compareCodePoints);
}

// ---------------------------------------------------------------------------
// Narrowing parsed input
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Rec {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, where: string): Rec {
  if (!isRecord(value)) throw new PmoError("merge/malformed-input", `${where} must be an object`, { where });
  return value;
}

function recordList(value: unknown, where: string): Rec[] {
  if (!Array.isArray(value)) throw new PmoError("merge/malformed-input", `${where} must be a list`, { where });
  return value.map((item: unknown, index) => requireRecord(item, `${where}[${index}]`));
}

function requireField(record: Rec, field: string, where: string): unknown {
  if (!Object.hasOwn(record, field)) {
    throw new PmoError("merge/missing-name-field", `${where} has no ${field}`, { field, where });
  }
  return record[field];
}

function requireContainer(record: Rec, field: string, where: string): unknown {
  if (!Object.hasOwn(record, field)) {
    throw new PmoError("merge/malformed-input", `${where} has no ${field}`, { field, where });
  }
  return record[field];
}

/** Where in `mhapInfo` the arrays that `shareMicrohaplotypes` shares are. `*` is every element of an array. */
const SHARED_PATHS: readonly (readonly string[])[] = [
  ["representative_microhaplotypes", "targets", "*", "microhaplotypes"],
  ["detected_microhaplotypes", "*", "library_samples", "*", "target_results"],
];

/** A deep copy of `value`, except that what each path leads to is the original, not a copy. */
function cloneSharing(value: unknown, paths: readonly (readonly string[])[]): unknown {
  if (paths.some((path) => path.length === 0)) return value;
  if (Array.isArray(value)) {
    const inner = paths.filter((path) => path[0] === "*").map((path) => path.slice(1));
    return inner.length === 0 ? structuredClone(value) : value.map((item: unknown) => cloneSharing(item, inner));
  }
  if (!isRecord(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return structuredClone(value);
  const copy: Rec = {};
  for (const [key, inner] of Object.entries(value)) {
    const below = paths.filter((path) => path[0] === key).map((path) => path.slice(1));
    copy[key] = below.length === 0 ? structuredClone(inner) : cloneSharing(inner, below);
  }
  return copy;
}

function cloneRecord(value: unknown, where: string): Rec {
  return requireRecord(structuredClone(value), where);
}

function cloneList(value: unknown, where: string): Rec[] | null {
  if (value === null || value === undefined) return null;
  return recordList(structuredClone(value), where);
}
