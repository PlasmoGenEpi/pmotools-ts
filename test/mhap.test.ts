import { describe, expect, it } from "vitest";

import { mhapTableToPmo, type MhapTableToPmoOptions } from "../src/builders/mhap.js";
import { collectWarnings, PmoError } from "../src/errors.js";
import type { Row } from "../src/table/core.js";
import { camelizeKeys, loadCases, toRows, type OracleCase } from "./helpers/conformance.js";

const STRING_OPTIONS = new Set([
  "bioinformaticsRunName",
  "librarySampleNameCol",
  "targetNameCol",
  "seqCol",
  "readsCol",
  "umisCol",
  "chromCol",
  "startCol",
  "endCol",
  "refSeqCol",
  "strandCol",
  "altAnnotationsCol",
  "maskingSeqStartCol",
  "maskingSeqSegmentSizeCol",
  "maskingReplacementSizeCol",
  "maskingDelim",
  "microhaplotypeNameCol",
  "pseudocigarCol",
  "pseudocigarChromCol",
  "pseudocigarStartCol",
  "pseudocigarEndCol",
  "pseudocigarRefSeqCol",
  "pseudocigarStrandCol",
  "pseudocigarGenerationDescriptionCol",
  "qualityCol",
]);
const NUMBER_OPTIONS = new Set(["genomeId", "pseudocigarGenomeId"]);
const LIST_OPTIONS = new Set(["additionalRepresentativeMhapCols", "additionalMhapDetectedCols"]);

/** Checks recorded keyword arguments and turns them into options. */
function toOptions(kwargs: Readonly<Record<string, unknown>>): MhapTableToPmoOptions {
  const options: Record<string, string | number | string[] | null> = {};
  for (const [key, value] of Object.entries(camelizeKeys(kwargs))) {
    if (value === null) options[key] = null;
    else if (STRING_OPTIONS.has(key) && typeof value === "string") options[key] = value;
    else if (NUMBER_OPTIONS.has(key) && typeof value === "number") options[key] = value;
    else if (LIST_OPTIONS.has(key) && Array.isArray(value) && value.every((v) => typeof v === "string")) {
      options[key] = value.filter((v): v is string => typeof v === "string");
    } else throw new Error(`Unexpected option ${key}: ${JSON.stringify(value)}`);
  }
  return options;
}

function tableOf(oracle: OracleCase): Row[] {
  const table = oracle.tables["microhaplotype_table"];
  if (table === undefined) throw new Error(`${oracle.id} has no microhaplotype_table`);
  return toRows(table);
}

function run(oracle: OracleCase) {
  const table = tableOf(oracle);
  const options = toOptions(oracle.kwargs);
  return () => collectWarnings((onWarning) => mhapTableToPmo(table, { ...options, onWarning }));
}

function pythonDuplicateWarnings(oracle: OracleCase): number {
  return oracle.warnings.filter(
    (w) => w.category === "UserWarning" && w.message.startsWith("Duplicate (target, asv)"),
  ).length;
}

const NAME_KEYS = new Set(["target_name", "library_sample_name", "bioinformatics_run_name"]);

/** The Python value with every name written as a string, as pmotools-ts writes it. */
function namesAsStrings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(namesAsStrings);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [
        key,
        NAME_KEYS.has(key) && typeof inner === "number" ? String(inner) : namesAsStrings(inner),
      ]),
    );
  }
  return value;
}

function okValue(oracle: OracleCase): unknown {
  if (oracle.result.kind !== "ok") throw new Error(`${oracle.id} did not succeed in Python`);
  return oracle.result.value;
}

function expectCode(oracle: OracleCase, code: string): void {
  expect(run(oracle)).toThrow(PmoError);
  try {
    run(oracle)();
  } catch (error) {
    expect(error).toBeInstanceOf(PmoError);
    if (error instanceof PmoError) expect(error.code).toBe(code);
  }
}

/** What pmotools-ts does instead for cases recorded with a divergence. */
const DIVERGENCES: Record<string, (oracle: OracleCase) => void> = {
  numeric_names: (oracle) => {
    const { result } = run(oracle)();
    expect(result).toStrictEqual(namesAsStrings(okValue(oracle)));
    // Sorted numerically (1, 2, 10), not as text (1, 10, 2).
    expect(result.representative_microhaplotypes.targets.map((t) => t.target_name)).toEqual(["1", "2", "10"]);
    expect(result.detected_microhaplotypes.map((d) => d.bioinformatics_run_name)).toEqual(["7", "5"]);
  },
  mixed_number_and_string_name: (oracle) => {
    const { result } = run(oracle)();
    expect(result).toStrictEqual({
      representative_microhaplotypes: {
        targets: [{ target_name: "10", microhaplotypes: [{ seq: "A" }, { seq: "C" }, { seq: "G" }] }],
      },
      detected_microhaplotypes: [
        {
          library_samples: [
            {
              library_sample_name: "s1",
              target_results: [
                {
                  mhaps_target_id: 0,
                  mhaps: [
                    { mhap_id: 0, reads: 1 },
                    { mhap_id: 1, reads: 2 },
                  ],
                },
              ],
            },
            {
              library_sample_name: "s2",
              target_results: [{ mhaps_target_id: 0, mhaps: [{ mhap_id: 2, reads: 3 }] }],
            },
          ],
        },
      ],
    });
  },
  masking_float_column: (oracle) => {
    const { result } = run(oracle)();
    const mask = [{ seq_start: 5, seq_segment_size: 1, replacement_size: 1 }];
    expect(result.representative_microhaplotypes).toStrictEqual({
      targets: [
        { target_name: "t1", microhaplotypes: [{ seq: "A", masking: mask }, { seq: "G" }] },
        { target_name: "t2", microhaplotypes: [{ seq: "C", masking: mask }] },
      ],
    });
  },
  rename_collision: (oracle) => {
    const { result } = run(oracle)();
    const reads = result.detected_microhaplotypes.flatMap((d) =>
      d.library_samples.flatMap((s) => s.target_results.flatMap((t) => t.mhaps.map((m) => m.reads))),
    );
    expect(reads).toEqual([10, 20, 30]);
  },
  missing_reads_value: (oracle) => expectCode(oracle, "mhap/missing-reads"),
  missing_seq_value: (oracle) => expectCode(oracle, "mhap/missing-seq"),
  missing_run_value: (oracle) => expectCode(oracle, "mhap/missing-run-name"),
  missing_location_end: (oracle) => expectCode(oracle, "mhap/incomplete-location"),
};

/** Expected PmoError code for each case where Python raised. */
const ERROR_CODES: Record<string, string> = {
  error_additional_detected_missing: "mhap/missing-additional-columns",
  error_additional_detected_original_name: "mhap/missing-additional-columns",
  error_additional_representative_missing: "mhap/missing-additional-columns",
  error_location_columns_incomplete: "mhap/incomplete-location-columns",
  error_masking_columns_incomplete: "mhap/incomplete-masking-columns",
  error_masking_fractional: "mhap/invalid-masking",
  error_masking_not_an_integer: "mhap/invalid-masking",
  error_missing_optional_column: "mhap/missing-columns",
  error_missing_reads_column: "mhap/missing-columns",
  error_missing_sample_column: "mhap/missing-columns",
  error_missing_target_column: "mhap/missing-columns",
  error_missing_target_value: "mhap/missing-target-names",
  error_missing_umis_column: "mhap/missing-columns",
  error_pseudocigar_row_missing_ref_loc: "mhap/pseudocigar-ref-loc-missing",
  error_pseudocigar_without_ref_loc_columns: "mhap/pseudocigar-ref-loc-columns-unset",
};

const cases = loadCases("mhap");

describe("mhapTableToPmo oracle cases", () => {
  it("has cases", () => {
    expect(cases.length).toBeGreaterThan(40);
  });

  for (const oracle of cases) {
    const name = oracle.id.replace(/^mhap\//, "");
    it(name, () => {
      if (oracle.divergence !== null) {
        const check = DIVERGENCES[name];
        if (check === undefined) throw new Error(`No TypeScript assertion for divergent case ${name}`);
        check(oracle);
        return;
      }
      expect(DIVERGENCES[name]).toBeUndefined();
      if (oracle.result.kind === "ok") {
        const { result, warnings } = run(oracle)();
        expect(result).toStrictEqual(oracle.result.value);
        expect(warnings.filter((w) => w.code === "mhap/duplicate-target-seq")).toHaveLength(
          pythonDuplicateWarnings(oracle),
        );
        expect(warnings).toHaveLength(pythonDuplicateWarnings(oracle));
      } else {
        const code = ERROR_CODES[name];
        if (code === undefined) throw new Error(`No expected error code for ${name}`);
        expectCode(oracle, code);
      }
    });
  }
});

describe("mhapTableToPmo", () => {
  it("does not mutate the input table", () => {
    const table: Row[] = [
      { SampleID: "s1", Locus: "t2", ASV: "A", Reads: 4, run: "r1" },
      { SampleID: "s1", Locus: "t1", ASV: "C", Reads: 5, run: "r1" },
    ];
    const snapshot = structuredClone(table);
    for (const row of table) Object.freeze(row);
    Object.freeze(table);
    mhapTableToPmo(table, {
      librarySampleNameCol: "SampleID",
      targetNameCol: "Locus",
      seqCol: "ASV",
      readsCol: "Reads",
      bioinformaticsRunName: "run",
    });
    expect(table).toStrictEqual(snapshot);
  });

  it("reads a renamed column over an existing column of the canonical name", () => {
    // `reads` is an unrelated column here; the count column is renamed to `reads` and wins.
    const result = mhapTableToPmo(
      [{ SampleID: "s", Locus: "t", ASV: "A", count: 7, reads: 99, note: "x" }],
      {
        librarySampleNameCol: "SampleID",
        targetNameCol: "Locus",
        seqCol: "ASV",
        readsCol: "count",
        additionalMhapDetectedCols: ["note"],
      },
    );
    const mhap = result.detected_microhaplotypes[0]?.library_samples[0]?.target_results[0]?.mhaps[0];
    expect(mhap).toStrictEqual({ mhap_id: 0, reads: 7, note: "x" });
    expect(Object.keys(mhap ?? {})).toEqual(["mhap_id", "reads", "note"]);
  });

  it("no longer finds a renamed column under its own name", () => {
    expect(() =>
      mhapTableToPmo([{ SampleID: "s", Locus: "t", ASV: "A", count: 7 }], {
        librarySampleNameCol: "SampleID",
        targetNameCol: "Locus",
        seqCol: "ASV",
        readsCol: "count",
        additionalMhapDetectedCols: ["count"],
      }),
    ).toThrow(expect.objectContaining({ code: "mhap/missing-additional-columns" }));
  });

  it("keeps reads with their own target when targets are unsorted in the input", () => {
    const result = mhapTableToPmo([
      { library_sample_name: "s", target_name: "zeta", seq: "Z", reads: 26 },
      { library_sample_name: "s", target_name: "alpha", seq: "A", reads: 1 },
    ]);
    const targets = result.representative_microhaplotypes.targets;
    const sample = result.detected_microhaplotypes[0]?.library_samples[0];
    const readsByTarget = Object.fromEntries(
      (sample?.target_results ?? []).map((r) => [targets[r.mhaps_target_id]?.target_name, r.mhaps[0]?.reads]),
    );
    expect(readsByTarget).toEqual({ alpha: 1, zeta: 26 });
  });

  it("reports duplicate (target, seq) pairs through onWarning", () => {
    const { warnings } = collectWarnings((onWarning) =>
      mhapTableToPmo(
        [
          { library_sample_name: "s", target_name: "t", seq: "A", reads: 1, alt: "x" },
          { library_sample_name: "s", target_name: "t", seq: "A", reads: 2, alt: "y" },
        ],
        { altAnnotationsCol: "alt", onWarning },
      ),
    );
    expect(warnings.map((w) => w.code)).toEqual(["mhap/duplicate-target-seq"]);
    expect(warnings[0]?.details).toEqual({ duplicates: [{ target_name: "t", seq: "A", count: 2 }] });
  });
});
