import { describe, expect, it } from "vitest";

import {
  readCountByStageTableToPmo,
  type ReadCountByStageOptions,
  type ReadCountByStageResult,
} from "../src/builders/readCounts.js";
import { collectWarnings, PmoError, type PmoWarning } from "../src/errors.js";
import type { Table } from "../src/table/core.js";
import { camelizeKeys, loadCases, toRows, type OracleCase } from "./helpers/conformance.js";

const cases = loadCases("read_counts/additional")
  .concat(loadCases("read_counts/counts"))
  .concat(loadCases("read_counts/empty"))
  .concat(loadCases("read_counts/examples"))
  .concat(loadCases("read_counts/names"))
  .concat(loadCases("read_counts/pytest"))
  .concat(loadCases("read_counts/runs"))
  .concat(loadCases("read_counts/wide"));

/** Warnings pmotools-ts adds where Python is silent, by case ID. */
const EXPECTED_WARNINGS: Readonly<Record<string, readonly string[]>> = {
  "read_counts/examples/mad4hatter_wide": ["read-counts/unmatched-library-samples"],
  "read_counts/examples/mad4hatter_demultiplexed_one_stage": ["read-counts/duplicate-stages"],
  "read_counts/names/duplicate_stage_overwrites": ["read-counts/duplicate-stages"],
  "read_counts/names/reads_sample_not_in_totals": ["read-counts/unmatched-library-samples"],
  "read_counts/names/missing_sample_in_reads": ["read-counts/unmatched-library-samples"],
  "read_counts/names/missing_target_and_stage_unmatched": ["read-counts/unmatched-library-samples"],
  "read_counts/runs/reads_with_unknown_run": ["read-counts/unmatched-runs"],
};

type Outcome = { kind: "ok"; value: unknown } | { kind: "error"; code: string };

/** What pmotools-ts does instead, for each case recorded with a divergence. */
const DIVERGENCES: Readonly<Record<string, Outcome>> = {
  "read_counts/names/missing_sample_in_totals": { kind: "error", code: "read-counts/missing-name" },
  "read_counts/names/missing_target": { kind: "error", code: "read-counts/missing-name" },
  "read_counts/names/missing_stage": { kind: "error", code: "read-counts/missing-name" },
  "read_counts/runs/missing_run_value": { kind: "error", code: "read-counts/missing-name" },
  "read_counts/names/duplicate_number_and_text": {
    kind: "error",
    code: "read-counts/duplicate-library-sample-names",
  },
  "read_counts/names/numeric_names": {
    kind: "ok",
    value: [
      {
        read_counts_by_library_sample_by_stage: [
          {
            library_sample_name: "1",
            total_raw_count: 1,
            q: 0.5,
            read_counts_for_targets: [{ target_name: "5", stages: [{ stage: "1", reads: 1 }] }],
          },
          {
            library_sample_name: "2",
            total_raw_count: 2,
            q: 0.25,
            read_counts_for_targets: [{ target_name: "5", stages: [{ stage: "1", reads: 2 }] }],
          },
        ],
      },
    ],
  },
  "read_counts/runs/numeric_run_values": {
    kind: "ok",
    value: [
      {
        read_counts_by_library_sample_by_stage: [
          {
            library_sample_name: "a",
            total_raw_count: 1,
            read_counts_for_targets: [{ target_name: "t", stages: [{ stage: "s", reads: 1 }] }],
          },
        ],
        bioinformatics_run_name: "1",
      },
      {
        read_counts_by_library_sample_by_stage: [{ library_sample_name: "b", total_raw_count: 2 }],
        bioinformatics_run_name: "2",
      },
    ],
  },
  "read_counts/empty/totals_without_columns": {
    kind: "ok",
    value: [{ read_counts_by_library_sample_by_stage: [], bioinformatics_run_name: "r1" }],
  },
  "read_counts/empty/totals_with_run_column": {
    kind: "ok",
    value: [{ read_counts_by_library_sample_by_stage: [], bioinformatics_run_name: "r" }],
  },
};

/** Calls the builder with a case's recorded arguments, which may be deliberately ill-typed. */
function replay(oracleCase: OracleCase): { outcome: Outcome; warnings: PmoWarning[] } {
  const { total_raw_count_table: totals, reads_by_stage_table: reads } = oracleCase.tables;
  const { totalRawCountTable, ...options } = camelizeKeys(oracleCase.kwargs);
  if (reads !== undefined) options["readsByStageTable"] = toRows(reads);
  const table: unknown = totals === undefined ? totalRawCountTable : toRows(totals);
  try {
    const { result, warnings } = collectWarnings((onWarning): unknown =>
      Reflect.apply(readCountByStageTableToPmo, undefined, [table, { ...options, onWarning }]),
    );
    return { outcome: { kind: "ok", value: JSON.parse(JSON.stringify(result)) }, warnings };
  } catch (error) {
    if (!(error instanceof PmoError)) throw error;
    return { outcome: { kind: "error", code: error.code }, warnings: [] };
  }
}

describe("readCountByStageTableToPmo oracle cases", () => {
  it("loads the recorded cases", () => {
    expect(cases.length).toBeGreaterThan(60);
    for (const id of [...Object.keys(DIVERGENCES), ...Object.keys(EXPECTED_WARNINGS)]) {
      expect(cases.map((c) => c.id)).toContain(id);
    }
  });

  for (const oracleCase of cases) {
    it(oracleCase.id, () => {
      const { outcome, warnings } = replay(oracleCase);
      const divergence = DIVERGENCES[oracleCase.id];
      expect(divergence !== undefined, "divergence recorded in the case and in this test").toBe(
        oracleCase.divergence !== null,
      );
      if (divergence !== undefined) {
        expect(outcome).toEqual(divergence);
      } else if (oracleCase.result.kind === "ok") {
        expect(outcome).toEqual({ kind: "ok", value: oracleCase.result.value });
      } else {
        expect(outcome.kind).toBe("error");
      }
      if (outcome.kind === "ok") {
        expect(warnings.map((warning) => warning.code)).toEqual(EXPECTED_WARNINGS[oracleCase.id] ?? []);
      }
    });
  }
});

function run(totals: Table, options: ReadCountByStageOptions = {}): {
  result: ReadCountByStageResult;
  warnings: PmoWarning[];
} {
  return collectWarnings((onWarning) => readCountByStageTableToPmo(totals, { ...options, onWarning }));
}

function errorCode(action: () => unknown): string | undefined {
  try {
    action();
  } catch (error) {
    if (error instanceof PmoError) return error.code;
    throw error;
  }
  return undefined;
}

const totals: Table = [
  { library_sample_name: "s1", total_raw_count: 10 },
  { library_sample_name: "s2", total_raw_count: 20 },
];

describe("readCountByStageTableToPmo warnings", () => {
  it("names dropped samples once, across every run that shared the reads", () => {
    const multiRun: Table = [
      { library_sample_name: "s1", total_raw_count: 1, run: "r1" },
      { library_sample_name: "s2", total_raw_count: 2, run: "r2" },
    ];
    const reads: Table = [
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 1 },
      { library_sample_name: "s2", target_name: "t", stage: "x", read_count: 2 },
      { library_sample_name: "zz", target_name: "t", stage: "x", read_count: 3 },
      { library_sample_name: null, target_name: "t", stage: "x", read_count: 4 },
    ];
    const { result, warnings } = run(multiRun, { readsByStageTable: reads, bioinformaticsRunName: "run" });
    expect(result.map((entry) => entry.bioinformatics_run_name)).toEqual(["r1", "r2"]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.code).toBe("read-counts/unmatched-library-samples");
    expect(warnings[0]?.details).toEqual({ names: ["zz", null] });
  });

  it("lists each repeated sample, target and stage once", () => {
    const reads: Table = [
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 1 },
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 2 },
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 3 },
    ];
    const { result, warnings } = run(totals, { readsByStageTable: reads });
    expect(result[0]?.read_counts_by_library_sample_by_stage[0]?.read_counts_for_targets).toEqual([
      { target_name: "t", stages: [{ stage: "x", reads: 3 }] },
    ]);
    expect(warnings.map((warning) => warning.details)).toEqual([
      { duplicates: [{ library_sample_name: "s1", target_name: "t", stage: "x" }] },
    ]);
  });

  it("reports unknown run values, including missing ones", () => {
    const multiRun: Table = [{ library_sample_name: "s1", total_raw_count: 1, run: "r1" }];
    const reads: Table = [
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 1, run: "r1" },
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 1, run: undefined },
      { library_sample_name: "s1", target_name: "t", stage: "x", read_count: 1, run: "r9" },
    ];
    const { warnings } = run(multiRun, { readsByStageTable: reads, bioinformaticsRunName: "run" });
    expect(warnings.map((warning) => [warning.code, warning.details])).toEqual([
      ["read-counts/unmatched-runs", { column: "run", runs: [null, "r9"] }],
    ]);
  });
});

describe("readCountByStageTableToPmo behaviour beyond the oracle", () => {
  it("does not mutate its arguments", () => {
    const reads = [
      { library_sample_name: "s1", target_name: "t", a: 1, b: 2 },
      { library_sample_name: "s2", target_name: "t", a: 3, b: 4 },
    ];
    const multiRun = totals.map((row) => ({ ...row, run: "r1" }));
    const before = JSON.stringify([reads, multiRun]);
    readCountByStageTableToPmo(multiRun, {
      readsByStageTable: reads,
      stageCol: ["b", "a"],
      bioinformaticsRunName: "run",
    });
    expect(JSON.stringify([reads, multiRun])).toBe(before);
  });

  it("treats JavaScript NaN and undefined counts as missing", () => {
    expect(errorCode(() => readCountByStageTableToPmo([{ library_sample_name: "s1", total_raw_count: Number.NaN }]))).toBe(
      "read-counts/invalid-count",
    );
    expect(
      errorCode(() =>
        readCountByStageTableToPmo(totals, {
          readsByStageTable: [{ library_sample_name: "s1", target_name: "t", stage: "x", read_count: undefined }],
        }),
      ),
    ).toBe("read-counts/invalid-count");
  });

  it("parses counts like Python int()", () => {
    const counts = ["0012", "-0", "1_000", " 7\n", 2.999, -0.5, true];
    const table = counts.map((count, index) => ({ library_sample_name: `s${index}`, total_raw_count: count }));
    const [entry] = readCountByStageTableToPmo(table);
    const totalsOut = entry?.read_counts_by_library_sample_by_stage.map((sample) => sample.total_raw_count);
    expect(totalsOut).toEqual([12, 0, 1000, 7, 2, 0, 1]);
    expect(totalsOut?.some((value) => Object.is(value, -0))).toBe(false);
    for (const bad of ["1__0", "_1", "1.5", "", "1e3", Number.POSITIVE_INFINITY]) {
      expect(errorCode(() => readCountByStageTableToPmo([{ library_sample_name: "s", total_raw_count: bad }]))).toBe(
        "read-counts/invalid-count",
      );
    }
  });

  it("reports missing columns with their names", () => {
    try {
      readCountByStageTableToPmo([{ sample: "s1" }]);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(PmoError);
      if (error instanceof PmoError) {
        expect(error.code).toBe("read-counts/missing-columns");
        expect(error.details).toEqual({
          table: "total_raw_count_table",
          columns: ["library_sample_name", "total_raw_count"],
        });
      }
    }
  });

  it("keeps an additional column named __proto__ as a plain key", () => {
    const [entry] = readCountByStageTableToPmo(
      [{ library_sample_name: "s1", total_raw_count: 1, ["__proto__"]: "x" }].map((row) =>
        Object.fromEntries(Object.entries(row)),
      ),
      { additionalLibrarySampleCols: ["__proto__"] },
    );
    const sample = entry?.read_counts_by_library_sample_by_stage[0];
    expect(sample === undefined ? [] : Object.keys(sample)).toEqual(["library_sample_name", "total_raw_count", "__proto__"]);
  });
});
