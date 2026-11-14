import { describe, expect, it } from "vitest";

import { collectWarnings, PmoError, type PmoWarning } from "../src/errors.js";
import type { MergeParts } from "../src/merge/fragments.js";
import { mergeToPmo, PMOTOOLS_TS_VERSION, type IncompleteNameFieldsDetails } from "../src/merge/mergeToPmo.js";
import type { PortableMicrohaplotypeObject } from "../src/types/pmo.js";
import { camelizeKeys, loadCases, type OracleCase } from "./helpers/conformance.js";

const cases = loadCases("merge");
const byId = new Map(cases.map((oracleCase) => [oracleCase.id.replace(/^merge\//, ""), oracleCase]));
const DATE = "2025-07-22";

type Rec = Record<string, unknown>;

function isRecord(value: unknown): value is Rec {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Narrows recorded keyword arguments to merge input. Only the top level is
 * checked: the fragments were produced by the Python builders, and several
 * cases are deliberately malformed to exercise the merge's own runtime checks.
 */
function isRecordedParts(value: unknown): value is MergeParts {
  return isRecord(value) && isRecord(value["mhapInfo"]) && isRecord(value["panelTargetInfo"]);
}

function partsOf(oracleCase: OracleCase): MergeParts {
  const parts = camelizeKeys(oracleCase.kwargs);
  if (!isRecordedParts(parts)) throw new Error(`${oracleCase.id}: kwargs are not merge input`);
  return parts;
}

function caseById(id: string): OracleCase {
  const found = byId.get(id);
  if (found === undefined) throw new Error(`No oracle case merge/${id}`);
  return found;
}

/** Runs the merge, keeping the warnings raised before any error. */
function run(parts: MergeParts): { result?: PortableMicrohaplotypeObject; error?: unknown; warnings: PmoWarning[] } {
  const warnings: PmoWarning[] = [];
  try {
    const result = mergeToPmo(parts, { creationDate: DATE, onWarning: (warning) => warnings.push(warning) });
    return { result, warnings };
  } catch (error) {
    return { error, warnings };
  }
}

/** Python's recorded PMO with the header made to match what pmotools-ts writes. */
function normalisedExpected(value: unknown): Rec {
  if (!isRecord(value) || !isRecord(value["pmo_header"])) throw new Error("recorded value is not a PMO");
  return {
    ...value,
    pmo_header: {
      ...value["pmo_header"],
      creation_date: DATE,
      generation_method: { program_name: "pmotools-ts", program_version: PMOTOOLS_TS_VERSION },
    },
  };
}

/** Which `PmoError` code each Python exception corresponds to. */
function expectedCode(type: string, message: string): string {
  if (message.startsWith("Missing required fields")) return "merge/missing-required-fields";
  if (message.startsWith("bioinfo_method_info must be provided")) return "merge/runs-without-methods";
  if (message.startsWith("If multiple panels")) return "merge/several-panels-without-sample-info";
  if (message.startsWith("Duplicate library sample names")) return "merge/duplicate-library-sample-names";
  if (message.startsWith("The following warnings were encountered")) return "merge/incomplete-name-fields";
  if (message.startsWith("The following fields were found")) return "merge/unresolved-names";
  if (type === "IndexError") return "merge/no-panels";
  if (message.includes("'library_samples'") || message.includes("'read_counts_by_library_sample_by_stage'")) {
    return "merge/malformed-input";
  }
  if (type === "KeyError") return "merge/missing-name-field";
  throw new Error(`No PmoError code mapped for ${type}: ${message}`);
}

/** Python's "Label: ['a', 'b']" lines, as kind -> names, for checking `details`. */
const PYTHON_LABELS: Record<string, string> = {
  "Project names in Specimen Info not in Project Info": "projects",
  "Sequencing names in Library Sample Info not in Sequencing Info": "sequencing",
  "Specimen names in Library Sample Info not in Specimen Info": "specimens",
  "Panel names in Library Sample Info not in Panel Info": "panels",
  "Target names in Representative Microhaplotypes not in Target Info": "targets",
  "Bioinformatics run names in Detected Microhaplotypes not in Bioinformatic Run Info": "bioinformaticsRuns",
  "Library Sample names in Detected Microhaplotypes not in Library Sample Info": "librarySamples",
  "Bioinformatics run names in Read Counts by Stage not in Bioinformatic Run Info": "readCountsBioinformaticsRuns",
  "Library Sample names in Read Counts by Stage not in Library Sample Info": "readCountsLibrarySamples",
  "Target names in Read Counts by Stage not in Target Info": "readCountsTargets",
};

function pythonUnresolved(message: string): Record<string, string[]> {
  const found: Record<string, string[]> = {};
  for (const line of message.split("\n")) {
    const match = /^(.*): \[(.*)\]$/.exec(line);
    const kind = match?.[1] === undefined ? undefined : PYTHON_LABELS[match[1]];
    if (match?.[2] === undefined || kind === undefined) continue;
    const names = [...match[2].matchAll(/'([^']*)'/g)].map((m) => m[1] ?? "");
    found[kind] = [...new Set(names)].sort();
  }
  return found;
}

describe("mergeToPmo oracle cases", () => {
  it("has cases to replay", () => {
    expect(cases.length).toBeGreaterThan(60);
  });

  for (const oracleCase of cases.filter((c) => c.divergence === null)) {
    it(oracleCase.id, () => {
      const { result, error, warnings } = run(partsOf(oracleCase));
      expect(warnings.length).toBe(oracleCase.warnings.length);
      oracleCase.warnings.forEach((pythonWarning, index) => {
        const names = warnings[index]?.details["names"];
        expect(Array.isArray(names)).toBe(true);
        for (const name of Array.isArray(names) ? names : []) expect(pythonWarning.message).toContain(`'${String(name)}'`);
      });

      if (oracleCase.result.kind === "ok") {
        expect(error).toBeUndefined();
        const expected = normalisedExpected(oracleCase.result.value);
        expect(result).toStrictEqual(expected);
        // Same key order as Python, section by section and record by record.
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
      } else {
        expect(error).toBeInstanceOf(PmoError);
        const code = expectedCode(oracleCase.result.type, oracleCase.result.message);
        expect(error instanceof PmoError ? error.code : undefined).toBe(code);
        if (code === "merge/unresolved-names" && error instanceof PmoError) {
          const reported: Record<string, string[]> = {};
          for (const [kind, names] of Object.entries(error.details)) {
            if (Array.isArray(names) && names.length > 0) reported[kind] = names.map(String).sort();
          }
          expect(reported).toStrictEqual(pythonUnresolved(oracleCase.result.message));
        }
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Divergences: each recorded case marked `divergence` is asserted here.
// ---------------------------------------------------------------------------

function ok(id: string): PortableMicrohaplotypeObject & Rec {
  const { result, error } = run(partsOf(caseById(id)));
  if (result === undefined) throw error;
  return result;
}

function libraryNamesOf(pmo: PortableMicrohaplotypeObject): string[] {
  return pmo.library_sample_info.map((library) => library.library_sample_name);
}

/** Each library sample's name together with its specimen's name. */
function librarySpecimens(pmo: PortableMicrohaplotypeObject): [string, string | undefined][] {
  return pmo.library_sample_info.map((library) => [
    library.library_sample_name,
    pmo.specimen_info[library.specimen_id]?.specimen_name,
  ]);
}

/** Per run, the library sample names the detected microhaplotypes resolve to. */
function detectedNames(pmo: PortableMicrohaplotypeObject): (string | undefined)[][] {
  return pmo.detected_microhaplotypes.map((runEntry) =>
    runEntry.library_samples.map((sample) => pmo.library_sample_info[sample.library_sample_id]?.library_sample_name),
  );
}

/** Per run, the library sample names in the recorded input fragment, as strings. */
function inputDetectedNames(id: string): string[][] {
  const mhap = partsOf(caseById(id)).mhapInfo;
  return mhap.detected_microhaplotypes.map((runEntry) =>
    runEntry.library_samples.map((sample) => String(sample.library_sample_name)),
  );
}

const DIVERGENCES: Record<string, () => void> = {
  "numeric-minimal": () => {
    // Python: "Specimen names in Library Sample Info not in Specimen Info: ['101', '102']".
    const pmo = ok("numeric-minimal");
    expect(libraryNamesOf(pmo)).toStrictEqual(["101", "102"]);
    expect(pmo.specimen_info).toStrictEqual([{ specimen_name: "101" }, { specimen_name: "102" }]);
    expect(librarySpecimens(pmo)).toStrictEqual([
      ["101", "101"],
      ["102", "102"],
    ]);
    expect(detectedNames(pmo)).toStrictEqual([["101", "102"]]);
  },
  "numeric-specimen-and-library": () => {
    const pmo = ok("numeric-specimen-and-library");
    expect(pmo.library_sample_info.map((library) => [library.specimen_id, library.panel_id])).toStrictEqual([
      [0, 0],
      [1, 0],
    ]);
    expect(detectedNames(pmo).map((names) => names.map(String))).toStrictEqual([["101", "102"]]);
  },
  "numeric-specimen-only": () => {
    const { result, warnings } = run(partsOf(caseById("numeric-specimen-only")));
    expect(warnings).toStrictEqual([]);
    if (result === undefined) throw new Error("expected a PMO");
    expect(result.specimen_info.length).toBe(2);
    expect(librarySpecimens(result).map(([library, specimen]) => [library, String(specimen)])).toStrictEqual([
      ["101", "101"],
      ["102", "102"],
    ]);
  },
  "runs-small-without-library-info": () => {
    // Python: "Duplicate library sample names found: ['samp_B']".
    const pmo = ok("runs-small-without-library-info");
    expect(libraryNamesOf(pmo)).toStrictEqual(["samp_A", "samp_B", "samp_C"]);
    expect(pmo.specimen_info.map((specimen) => specimen.specimen_name)).toStrictEqual(["samp_A", "samp_B", "samp_C"]);
    expect(detectedNames(pmo)).toStrictEqual(inputDetectedNames("runs-small-without-library-info"));
    expect(pmo.detected_microhaplotypes.map((runEntry) => runEntry.bioinformatics_run_id)).toStrictEqual([0, 1]);
    // Apart from the created records, the output is what Python gives with library info supplied.
    const withLibraries = ok("runs-small-with-library-info");
    expect(pmo.detected_microhaplotypes).toStrictEqual(withLibraries.detected_microhaplotypes);
  },
  "runs-small-specimen-only": () => {
    const { result, warnings } = run(partsOf(caseById("runs-small-specimen-only")));
    expect(warnings).toStrictEqual([]);
    if (result === undefined) throw new Error("expected a PMO");
    expect(librarySpecimens(result)).toStrictEqual([
      ["samp_A", "samp_A"],
      ["samp_B", "samp_B"],
      ["samp_C", "samp_C"],
    ]);
    expect(detectedNames(result)).toStrictEqual(inputDetectedNames("runs-small-specimen-only"));
  },
  "runs-example-without-library-info": () => {
    const pmo = ok("runs-example-without-library-info");
    const expectedNames = inputDetectedNames("runs-example-without-library-info");
    expect(new Set(libraryNamesOf(pmo)).size).toBe(pmo.library_sample_info.length);
    expect(new Set(libraryNamesOf(pmo))).toStrictEqual(new Set(expectedNames.flat()));
    expect(detectedNames(pmo)).toStrictEqual(expectedNames);
    expect(pmo.bioinformatics_run_info?.map((runEntry) => runEntry.bioinformatics_run_name)).toStrictEqual([
      "bioinfo_run1",
      "bioinfo_run2",
      "bioinfo_run3",
    ]);
    expect(pmo.detected_microhaplotypes.map((runEntry) => runEntry.bioinformatics_run_id)).toStrictEqual([0, 1, 2]);
  },
  "warnings-specimen-missing-several": () => {
    const oracleCase = caseById("warnings-specimen-missing-several");
    const { result, warnings } = run(partsOf(oracleCase));
    if (result === undefined) throw new Error("expected a PMO");
    expect(warnings.map((warning) => [warning.code, warning.details["names"]])).toStrictEqual([
      ["merge/specimens-added", ["s1", "s2", "s4", "s5"]],
    ]);
    // Appended in first-seen order rather than Python's set order.
    expect(result.specimen_info.map((specimen) => specimen.specimen_name)).toStrictEqual(["s3", "s1", "s2", "s4", "s5"]);
    expect(librarySpecimens(result).every(([library, specimen]) => library === specimen)).toBe(true);
    // Everything that does not depend on that order matches Python.
    if (oracleCase.result.kind !== "ok") throw new Error("expected Python to succeed");
    const expected = normalisedExpected(oracleCase.result.value);
    const { specimen_info: _s, library_sample_info: _l, ...rest } = result;
    const { specimen_info: _ps, library_sample_info: _pl, ...expectedRest } = expected;
    expect(rest).toStrictEqual(expectedRest);
  },
};

describe("mergeToPmo divergences from pmotools-python", () => {
  it("asserts every recorded divergence", () => {
    const divergent = cases.filter((c) => c.divergence !== null).map((c) => c.id.replace(/^merge\//, ""));
    expect(divergent.sort()).toStrictEqual(Object.keys(DIVERGENCES).sort());
  });

  for (const [id, assertion] of Object.entries(DIVERGENCES)) {
    it(id, () => {
      // Python failed or gave a set-order-dependent result; see the case's `divergence`.
      expect(caseById(id).divergence).not.toBeNull();
      assertion();
    });
  }

  it("still rejects a library sample listed twice within one run", () => {
    const { error } = run(partsOf(caseById("duplicates-within-one-run")));
    expect(error instanceof PmoError ? error.code : error).toBe("merge/duplicate-library-sample-names");
  });
});

// ---------------------------------------------------------------------------
// Behaviour the oracle cannot show directly
// ---------------------------------------------------------------------------

/** Each detected read resolved to [library sample, target name, sequence, reads] through both indexes. */
function resolvedReads(pmo: PortableMicrohaplotypeObject): [string, string, string, number][] {
  const reads: [string, string, string, number][] = [];
  for (const runEntry of pmo.detected_microhaplotypes) {
    for (const sample of runEntry.library_samples) {
      const library = pmo.library_sample_info[sample.library_sample_id]?.library_sample_name ?? "?";
      for (const targetResult of sample.target_results) {
        // mhaps_target_id indexes representative targets; their target_id indexes target_info.
        const representative = pmo.representative_microhaplotypes.targets[targetResult.mhaps_target_id];
        const targetName = representative === undefined ? "?" : pmo.target_info[representative.target_id]?.target_name;
        for (const mhap of targetResult.mhaps) {
          reads.push([library, targetName ?? "?", representative?.microhaplotypes[mhap.mhap_id]?.seq ?? "?", mhap.reads]);
        }
      }
    }
  }
  return reads;
}

describe("mergeToPmo", () => {
  it("keeps reads on their own target when representative targets are ordered differently from the panel", () => {
    const pmo = ok("targets-representative-order-differs");
    expect(pmo.target_info.map((target) => target.target_name)).toStrictEqual(["target3", "target1", "target2"]);
    expect(pmo.representative_microhaplotypes.targets.map((target) => target.target_id)).toStrictEqual([1, 2, 0]);
    expect(resolvedReads(pmo).sort()).toStrictEqual(
      [
        ["samp_A", "target3", "GGGG", 33],
        ["samp_A", "target1", "AAAA", 11],
        ["samp_A", "target2", "CCCC", 22],
        ["samp_B", "target2", "CCCT", 222],
        ["samp_B", "target3", "GGGT", 333],
      ].sort(),
    );
  });

  it("resolves every example read to the target its representative entry named", () => {
    const id = "example-full-nine-inputs";
    const pmo = ok(id);
    const inputTargets = partsOf(caseById(id)).mhapInfo.representative_microhaplotypes.targets.map((target) =>
      String(target.target_name),
    );
    const representativeNames = pmo.representative_microhaplotypes.targets.map(
      (target) => pmo.target_info[target.target_id]?.target_name,
    );
    expect(representativeNames).toStrictEqual(inputTargets);
    // The example's representative order differs from the panel's, so this is not trivially the identity.
    expect(pmo.representative_microhaplotypes.targets.some((target, index) => target.target_id !== index)).toBe(true);
    expect(resolvedReads(pmo).every(([library, target, seq]) => library !== "?" && target !== "?" && seq !== "?")).toBe(true);
  });

  it("does not modify its inputs, and the result shares nothing with them", () => {
    const parts = partsOf(caseById("example-full-nine-inputs"));
    const before = JSON.stringify(parts);
    const pmo = mergeToPmo(parts, { creationDate: DATE });
    expect(JSON.stringify(parts)).toBe(before);
    pmo.specimen_info.push({ specimen_name: "extra" });
    const firstTarget = pmo.target_info[0];
    if (firstTarget !== undefined) firstTarget.target_name = "changed";
    pmo.detected_microhaplotypes[0]?.library_samples.pop();
    expect(JSON.stringify(parts)).toBe(before);
  });

  it("writes a pmotools-ts header, dated today unless a date is given", () => {
    const parts = partsOf(caseById("basic-small-builders-two-inputs"));
    const dated = mergeToPmo(parts, { creationDate: "2024-01-02" }).pmo_header;
    expect(dated).toStrictEqual({
      pmo_version: "1.1.0",
      creation_date: "2024-01-02",
      generation_method: { program_name: "pmotools-ts", program_version: PMOTOOLS_TS_VERSION },
    });
    const now = new Date();
    const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
      .join("-");
    const header = mergeToPmo(parts).pmo_header;
    expect(header.creation_date).toBe(today);
  });

  it("treats null sections as left out", () => {
    const parts = partsOf(caseById("basic-small-builders-two-inputs"));
    const withNulls: MergeParts = {
      ...parts,
      specimenInfo: null,
      librarySampleInfo: null,
      sequencingInfo: null,
      bioinfoMethodInfo: null,
      bioinfoRunInfo: null,
      projectInfo: null,
      readCountsByStageInfo: null,
    };
    expect(mergeToPmo(withNulls, { creationDate: DATE })).toStrictEqual(mergeToPmo(parts, { creationDate: DATE }));
  });

  it("matches string names to numeric ones in read counts and every other section", () => {
    const panelTargetInfo = { panel_info: [{ panel_name: 7 }], target_info: [{ target_name: 5 }] };
    const mhapInfo = {
      representative_microhaplotypes: { targets: [{ target_name: "5", microhaplotypes: [{ seq: "A" }] }] },
      detected_microhaplotypes: [
        {
          bioinformatics_run_name: 3,
          library_samples: [
            { library_sample_name: "101", target_results: [{ mhaps_target_id: 0, mhaps: [{ mhap_id: 0, reads: 1 }] }] },
          ],
        },
      ],
    };
    const specimenInfo = [{ specimen_name: 1, project_name: "9" }];
    const librarySampleInfo = [{ library_sample_name: 101, specimen_name: "1", panel_name: "7", sequencing_info_name: 2 }];
    const sequencingInfo = [
      {
        sequencing_info_name: "2",
        seq_platform: "ILLUMINA",
        seq_instrument_model: "x",
        library_layout: "PAIRED",
        library_strategy: "AMPLICON",
        library_source: "GENOMIC",
        library_selection: "PCR",
      },
    ];
    const runs = [{ bioinformatics_run_name: "3", bioinformatics_methods_id: 0 }];
    const projects = [{ project_name: "9", project_description: "d" }];
    const readCounts = [
      {
        bioinformatics_run_name: "3",
        read_counts_by_library_sample_by_stage: [
          { library_sample_name: "101", total_raw_count: 1, read_counts_for_targets: [{ target_name: "5", stages: [] }] },
        ],
      },
    ];
    const { result, warnings } = collectWarnings((onWarning) =>
      mergeToPmo(
        {
          panelTargetInfo,
          mhapInfo,
          specimenInfo,
          librarySampleInfo,
          sequencingInfo,
          bioinfoMethodInfo: [{ methods: [] }],
          bioinfoRunInfo: runs,
          projectInfo: projects,
          readCountsByStageInfo: readCounts,
        },
        { onWarning, creationDate: DATE },
      ),
    );
    expect(warnings).toStrictEqual([]);
    expect(result.specimen_info[0]?.project_id).toBe(0);
    expect(result.library_sample_info[0]).toMatchObject({ specimen_id: 0, panel_id: 0, sequencing_info_id: 0 });
    expect(result.representative_microhaplotypes.targets[0]?.target_id).toBe(0);
    expect(result.detected_microhaplotypes[0]).toMatchObject({ bioinformatics_run_id: 0 });
    expect(result.read_counts_by_stage?.[0]).toStrictEqual({
      bioinformatics_run_id: 0,
      read_counts_by_library_sample_by_stage: [
        { total_raw_count: 1, read_counts_for_targets: [{ stages: [], target_id: 0 }], library_sample_id: 0 },
      ],
    });
  });

  it("describes missing name fields as data in merge/incomplete-name-fields", () => {
    const { error } = run(partsOf(caseById("errors-all-merging-warnings")));
    expect(error).toBeInstanceOf(PmoError);
    if (!(error instanceof PmoError)) return;
    expect(error.code).toBe("merge/incomplete-name-fields");
    expect(error.message).toBe(
      "Names are missing in some records:\n" +
        "project info provided but there are specimens missing the project_name field\n" +
        "sequencing info provided but there are library samples missing the sequencing_info_name field\n" +
        "bioinformatics run info provided but there are detected microhaplotypes missing the bioinformatics_run_name field\n" +
        "bioinformatics run info provided but there are read counts by stage missing the bioinformatics_run_name field",
    );
    const details: IncompleteNameFieldsDetails = {
      missing: [
        {
          part: "specimenInfo",
          field: "project_name",
          linksTo: "projectInfo",
          count: 2,
          examples: [
            { index: 0, name: "samp_A" },
            { index: 1, name: "samp_B" },
          ],
        },
        {
          part: "librarySampleInfo",
          field: "sequencing_info_name",
          linksTo: "sequencingInfo",
          count: 2,
          examples: [
            { index: 0, name: "samp_A" },
            { index: 1, name: "samp_B" },
          ],
        },
        { part: "mhapInfo", field: "bioinformatics_run_name", linksTo: "bioinfoRunInfo", count: 1, examples: [{ index: 0 }] },
        {
          part: "readCountsByStageInfo",
          field: "bioinformatics_run_name",
          linksTo: "bioinfoRunInfo",
          count: 1,
          examples: [{ index: 0 }],
        },
      ],
      problems: error.message.split("\n").slice(1),
    };
    expect(error.details).toStrictEqual(details);
  });

  it("counts every record missing a name field but lists at most five", () => {
    const base = partsOf(caseById("errors-specimen-missing-project-name"));
    const specimenInfo = [
      { specimen_name: "samp_A", project_name: "PRJNA1040019" },
      { specimen_name: "samp_B" },
      ...Array.from({ length: 7 }, (_, i) => ({ specimen_name: 100 + i })),
    ];
    const { error } = run({ ...base, specimenInfo });
    expect(error instanceof PmoError ? error.details["missing"] : undefined).toStrictEqual([
      {
        part: "specimenInfo",
        field: "project_name",
        linksTo: "projectInfo",
        count: 8,
        examples: [
          { index: 1, name: "samp_B" },
          { index: 2, name: "100" },
          { index: 3, name: "101" },
          { index: 4, name: "102" },
          { index: 5, name: "103" },
        ],
      },
    ]);
  });

  it("gives structured details for errors that had none", () => {
    const runsWithout = run(partsOf(caseById("errors-runs-without-methods"))).error;
    expect(runsWithout instanceof PmoError ? runsWithout.details : undefined).toStrictEqual({
      part: "bioinfoMethodInfo",
      requiredBy: "bioinfoRunInfo",
    });
    const noPanels = run(partsOf(caseById("errors-no-panels"))).error;
    expect(noPanels instanceof PmoError ? noPanels.details : undefined).toStrictEqual({
      part: "panelTargetInfo",
      field: "panel_info",
    });
  });

  it("reports unresolved names of every kind in one error", () => {
    const { error } = run(partsOf(caseById("missing-all-kinds")));
    expect(error).toBeInstanceOf(PmoError);
    if (!(error instanceof PmoError)) return;
    expect(Object.entries(error.details).filter(([, names]) => Array.isArray(names) && names.length > 0).length).toBe(10);
  });
});
