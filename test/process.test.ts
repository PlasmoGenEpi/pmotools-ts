import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PmoError } from "../src/errors.js";
import {
  countLibrarySamplesPerTarget,
  countSpecimenByFieldValue,
  countTargetsPerLibrarySample,
  extractAlleleCountsFreqFromPmo,
  countSpecimenPerMetaFields,
  countTargetsPerPanel,
  extractFromPmoSamplesWithMetaGroupings,
  parseMetaGroups,
} from "../src/process/counts.js";
import { formatDelimited } from "../src/process/delimited.js";
import {
  exportBioinformaticsMethodsInfoMetaTable,
  exportBioinformaticsRunInfoMetaTable,
  exportLibrarySampleMetaTable,
  exportPanelInfoMetaTable,
  exportPmoHeaderTable,
  exportProjectInfoMetaTable,
  exportSequencingInfoMetaTable,
  exportSpecimenMetaTable,
  exportSpecimenTravelMetaTable,
  exportTargetedGenomesMetaTable,
  exportTargetInfoMetaTable,
  extractAllelesPerSampleTable,
  listLibrarySampleNamesPerSpecimenName,
  type AlleleTableOptions,
} from "../src/process/export.js";
import {
  extractFromPmoWithReadFilter,
  filterPmoByLibrarySampleIds,
  filterPmoByLibrarySampleNames,
  filterPmoBySpecimenIds,
  filterPmoBySpecimenNames,
  filterPmoByTargetIds,
  filterPmoByTargetNames,
} from "../src/process/filter.js";
import {
  getBioinformaticsRunNames,
  getLibrarySampleNames,
  getPanelNames,
  getSpecimenNames,
  getTargetNames,
} from "../src/process/names.js";
import type { ColumnTable, PmoData } from "../src/process/table.js";
import { validatePmo } from "../src/validate/index.js";
import { loadCases, type OracleCase } from "./helpers/conformance.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CASES = join(ROOT, "conformance/cases");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPmo(value: unknown): value is PmoData {
  return (
    isRecord(value) &&
    isRecord(value["pmo_header"]) &&
    Array.isArray(value["specimen_info"]) &&
    Array.isArray(value["library_sample_info"])
  );
}

function readPmo(path: string): PmoData {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isPmo(parsed)) throw new Error(`${path} is not a PMO`);
  return parsed;
}

function fullPmo(): PmoData {
  const parsed: unknown = JSON.parse(
    readFileSync(join(CASES, "merge/example-full-nine-inputs.json"), "utf8"),
  );
  const value = isRecord(parsed) && isRecord(parsed["result"]) ? parsed["result"]["value"] : null;
  if (!isPmo(value)) throw new Error("the full example is not a PMO");
  return value;
}

const FIXTURES: Record<string, PmoData> = {
  full: fullPmo(),
  small: readPmo(join(CASES, "process/fixtures/small.json")),
  minimal: readPmo(join(CASES, "process/fixtures/minimal.json")),
  "small-no-run-id": readPmo(join(CASES, "process/fixtures/small-no-run-id.json")),
};

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
const numbers = (value: unknown): number[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "number") : [];
const numberOr = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined;
const maybeStrings = (value: unknown): string[] | undefined =>
  value === undefined || value === null ? undefined : strings(value);

/** Calls the TypeScript function a case recorded, with its arguments. */
function call(oracleCase: OracleCase, pmo: PmoData): unknown {
  const kwargs = oracleCase.kwargs;
  const separator = typeof kwargs["separator"] === "string" ? kwargs["separator"] : undefined;
  const options = separator === undefined ? {} : { separator };
  switch (oracleCase.function) {
    case "get_specimen_names":
      return getSpecimenNames(pmo);
    case "get_library_sample_names":
      return getLibrarySampleNames(pmo);
    case "get_target_names":
      return getTargetNames(pmo);
    case "get_panel_names":
      return getPanelNames(pmo);
    case "get_bioinformatics_run_names":
      return getBioinformaticsRunNames(pmo);
    case "count_specimen_per_meta_fields":
      return countSpecimenPerMetaFields(pmo);
    case "count_targets_per_panel":
      return countTargetsPerPanel(pmo);
    case "count_targets_per_library_sample":
      return countTargetsPerLibrarySample(pmo, { minReads: numberOr(kwargs["min_reads"]) });
    case "count_library_samples_per_target":
      return countLibrarySamplesPerTarget(pmo, {
        minReads: numberOr(kwargs["min_reads"]),
        collapseAcrossRuns: kwargs["collapse_across_runs"] === true,
      });
    case "extract_allele_counts_freq_from_pmo":
      return extractAlleleCountsFreqFromPmo(pmo, {
        bioinformaticsRunIds: Array.isArray(kwargs["bioinformatics_run_ids"])
          ? numbers(kwargs["bioinformatics_run_ids"])
          : undefined,
        librarySampleNames: maybeStrings(kwargs["library_sample_names"]),
        targetNames: maybeStrings(kwargs["target_names"]),
        collapseAcrossRuns: kwargs["collapse_across_runs"] === true,
      });
    case "count_specimen_by_field_value":
      return countSpecimenByFieldValue(pmo, strings(kwargs["meta_fields"]));
    case "filter_pmo_by_library_sample_ids":
      return filterPmoByLibrarySampleIds(pmo, numbers(kwargs["library_sample_ids"]));
    case "filter_pmo_by_library_sample_names":
      return filterPmoByLibrarySampleNames(pmo, strings(kwargs["library_sample_names"]));
    case "filter_pmo_by_specimen_ids":
      return filterPmoBySpecimenIds(pmo, numbers(kwargs["specimen_ids"]));
    case "filter_pmo_by_specimen_names":
      return filterPmoBySpecimenNames(pmo, strings(kwargs["specimen_names"]));
    case "filter_pmo_by_target_ids":
      return filterPmoByTargetIds(pmo, numbers(kwargs["target_ids"]));
    case "filter_pmo_by_target_names":
      return filterPmoByTargetNames(pmo, strings(kwargs["target_names"]));
    case "extract_from_pmo_with_read_filter":
      return extractFromPmoWithReadFilter(pmo, Number(kwargs["read_filter"]));
    case "extract_from_pmo_samples_with_meta_groupings": {
      const text = kwargs["meta_fields_values"];
      const result = extractFromPmoSamplesWithMetaGroupings(pmo, typeof text === "string" ? text : "");
      return [result.pmo, result.groupCounts];
    }
    case "export_specimen_meta_table":
      return exportSpecimenMetaTable(pmo, options);
    case "export_specimen_travel_meta_table":
      return exportSpecimenTravelMetaTable(pmo, options);
    case "export_library_sample_meta_table":
      return exportLibrarySampleMetaTable(pmo, options);
    case "export_target_info_meta_table":
      return exportTargetInfoMetaTable(pmo, options);
    case "export_panel_info_meta_table":
      return exportPanelInfoMetaTable(pmo, options);
    case "export_project_info_meta_table":
      return exportProjectInfoMetaTable(pmo, options);
    case "export_sequencing_info_meta_table":
      return exportSequencingInfoMetaTable(pmo, options);
    case "export_bioinformatics_run_info_meta_table":
      return exportBioinformaticsRunInfoMetaTable(pmo, options);
    case "export_bioinformatics_methods_info_meta_table":
      return exportBioinformaticsMethodsInfoMetaTable(pmo, options);
    case "export_targeted_genomes_meta_table":
      return exportTargetedGenomesMetaTable(pmo, options);
    case "export_pmo_header_table":
      return exportPmoHeaderTable(pmo, options);
    case "list_library_sample_names_per_specimen_name":
      return listLibrarySampleNamesPerSpecimenName(pmo);
    case "extract_alleles_per_sample_table": {
      const allele: AlleleTableOptions = {
        additionalSpecimenInfoFields: maybeStrings(kwargs["additional_specimen_info_fields"]),
        additionalLibrarySampleInfoFields: maybeStrings(
          kwargs["additional_library_sample_info_fields"],
        ),
        additionalMicrohapFields: maybeStrings(kwargs["additional_microhap_fields"]),
        additionalRepresentativeInfoFields: maybeStrings(
          kwargs["additional_representative_info_fields"],
        ),
        defaultBaseColNames: maybeStrings(kwargs["default_base_col_names"]),
      };
      return extractAllelesPerSampleTable(pmo, allele);
    }
    default:
      throw new Error(`${oracleCase.id}: no TypeScript function for ${oracleCase.function}`);
  }
}

/** A recorded DataFrame as a ColumnTable. Other values are returned as they are. */
function expected(value: unknown): unknown {
  if (isRecord(value) && Array.isArray(value["columns"]) && Array.isArray(value["rows"])) {
    return { columns: value["columns"], rows: value["rows"] };
  }
  if (Array.isArray(value) && value.length === 2 && isPmo(value[0])) {
    return [value[0], expected(value[1])];
  }
  return value;
}

function asComparable(value: unknown): unknown {
  if (Array.isArray(value) && value.length === 2 && isPmo(value[0])) return value;
  if (isRecord(value) && "columns" in value && "rows" in value) {
    const table: ColumnTable = {
      columns: strings(value["columns"]),
      rows: Array.isArray(value["rows"]) ? value["rows"] : [],
    };
    return table;
  }
  return value;
}

const cases = loadCases("process");

/** Cases whose divergence is checked by hand below, not by replaying the recording. */
const HANDLED = new Set([
  "process/filter-library-ids-equal-to-length",
  "process/filter-specimen-ids-equal-to-length",
  "process/read-filter-no-run-id",
  "process/table-bioinformatics-methods-small",
  "process/filter-specimen-names-set-order",
  "process/count-samples-per-target-none-left",
  "process/allele-freq-nothing-chosen",
  "process/allele-freq-no-run-id",
]);

describe("process: oracle cases", () => {
  for (const oracleCase of cases) {
    if (HANDLED.has(oracleCase.id)) continue;
    const fixture = String(oracleCase.kwargs["pmo"]);
    it(`${oracleCase.id}: ${oracleCase.note ?? ""}`, () => {
      const pmo = FIXTURES[fixture];
      if (pmo === undefined) throw new Error(`no fixture ${fixture}`);
      const before = structuredClone(pmo);
      if (oracleCase.result.kind === "error") {
        expect(() => call(oracleCase, pmo)).toThrow(PmoError);
      } else {
        expect(asComparable(call(oracleCase, pmo))).toEqual(expected(oracleCase.result.value));
      }
      expect(pmo).toEqual(before);
    });
  }
});

describe("process: deliberate differences from pmotools-python", () => {
  const small = FIXTURES["small"];
  if (small === undefined) throw new Error("no small fixture");

  it("refuses a library sample id equal to the count, where Python fails with an IndexError", () => {
    expect(() => filterPmoByLibrarySampleIds(small, [4])).toThrow(
      expect.objectContaining({ code: "process/library-sample-id-out-of-range" }),
    );
  });

  it("refuses a specimen id equal to the count, which Python lets through to an empty PMO", () => {
    expect(() => filterPmoBySpecimenIds(small, [4])).toThrow(
      expect.objectContaining({ code: "process/specimen-id-out-of-range" }),
    );
  });

  it("refuses a negative id, which Python reads from the end", () => {
    expect(() => filterPmoByLibrarySampleIds(small, [-1])).toThrow(PmoError);
    expect(() => filterPmoByTargetIds(small, [-1])).toThrow(PmoError);
  });

  it("filters by reads when a run has no bioinformatics_run_id, where Python fails", () => {
    const pmo = FIXTURES["small-no-run-id"];
    if (pmo === undefined) throw new Error("no fixture");
    const out = extractFromPmoWithReadFilter(pmo, 10);
    expect(out.detected_microhaplotypes[1]).not.toHaveProperty("bioinformatics_run_id");
    expect(out.detected_microhaplotypes[1]?.library_samples).toEqual([
      { library_sample_id: 2, target_results: [{ mhaps_target_id: 1, mhaps: [{ mhap_id: 0, reads: 60 }] }] },
      { library_sample_id: 3, target_results: [{ mhaps_target_id: 2, mhaps: [{ mhap_id: 0, reads: 75 }] }] },
    ]);
  });

  it("joins a method's list field in the methods table, where Python leaves a list in the cell", () => {
    const recorded = cases.find((item) => item.id === "process/table-bioinformatics-methods-small");
    if (recorded?.result.kind !== "ok") throw new Error("no recorded methods table");
    const value = expected(recorded.result.value);
    if (!isRecord(value) || !Array.isArray(value["rows"])) throw new Error("not a table");
    const joined = value["rows"].map((row: unknown) =>
      Array.isArray(row) ? row.map((cell: unknown) => (Array.isArray(cell) ? cell.join(",") : cell)) : row,
    );
    expect(exportBioinformaticsMethodsInfoMetaTable(small)).toEqual({ ...value, rows: joined });
  });

  it("keeps specimens in the file's order, where Python uses set order", () => {
    const full = FIXTURES["full"];
    const recorded = cases.find((item) => item.id === "process/filter-specimen-names-set-order");
    if (full === undefined || recorded?.result.kind !== "ok" || !isPmo(recorded.result.value))
      throw new Error("no recorded set-order case");
    const chosen = strings(recorded.kwargs["specimen_names"]);
    const out = filterPmoBySpecimenNames(full, chosen);
    const names = getSpecimenNames(out);
    expect(names.toSorted()).toEqual(getSpecimenNames(recorded.result.value).toSorted());
    expect(names).toEqual(getSpecimenNames(full).filter((name) => chosen.includes(name)));
  });

  it("gives an empty table with its columns when nothing is left to count, where Python fails", () => {
    expect(countLibrarySamplesPerTarget(small, { minReads: 100_000 })).toEqual({
      columns: ["bioinformatics_run_id", "target_name", "sample_count"],
      rows: [],
    });
    expect(extractAlleleCountsFreqFromPmo(small, { targetNames: ["nope"] })).toEqual({
      columns: ["bioinformatics_run_id", "target_name", "mhap_id", "count", "freq", "total_haps_per_target"],
      rows: [],
    });
  });

  it("names a run without an id by position in the allele counts, where Python fails", () => {
    const pmo = FIXTURES["small-no-run-id"];
    if (pmo === undefined) throw new Error("no fixture");
    const runs = new Set(extractAlleleCountsFreqFromPmo(pmo).rows.map((row) => row[0]));
    expect(runs).toEqual(new Set([0, "detected_microhaplotypes_count_idx_1"]));
  });

  it("lists every unknown name, where Python names the first", () => {
    expect(() => filterPmoBySpecimenNames(small, ["x", "s1", "y"])).toThrow(
      expect.objectContaining({ code: "process/unknown-specimen-names", details: { names: ["x", "y"] } }),
    );
  });
});

describe("process: subsets stay valid PMOs", () => {
  const full = FIXTURES["full"];
  if (full === undefined) throw new Error("no full fixture");
  it.each([
    ["specimens", () => filterPmoBySpecimenNames(full, getSpecimenNames(full).slice(0, 7))],
    ["reads", () => extractFromPmoWithReadFilter(full, 250)],
    [
      "targets",
      () =>
        filterPmoByTargetIds(
          full,
          full.representative_microhaplotypes.targets.slice(0, 15).map((target) => target.target_id),
        ),
    ],
    [
      "metadata",
      () => extractFromPmoSamplesWithMetaGroupings(full, [{ criteria: { collection_country: ["Kenya"] } }]).pmo,
    ],
  ])("by %s", (_, make) => {
    expect(validatePmo(make())).toEqual(expect.objectContaining({ valid: true }));
  });
});

describe("parseMetaGroups", () => {
  it("reads groups, conditions and values", () => {
    expect(parseMetaGroups("a=1,2:b=x;a=3")).toEqual([
      { criteria: { a: ["1", "2"], b: ["x"] } },
      { criteria: { a: ["3"] } },
    ]);
  });

  it("refuses a condition without =", () => {
    expect(() => parseMetaGroups("a")).toThrow(expect.objectContaining({ code: "process/meta-condition" }));
  });
});

describe("formatDelimited", () => {
  it("writes a header and rows, quoting what needs it", () => {
    const text = formatDelimited({
      columns: ["name", "note", "n", "ok"],
      rows: [
        ["a", 'said "hi"', 1, true],
        ["b,c", null, 2.5, false],
      ],
    });
    expect(text).toBe('name,note,n,ok\na,"said ""hi""",1,True\n"b,c",,2.5,False\n');
  });

  it("writes tabs for TSV and leaves commas alone", () => {
    expect(formatDelimited({ columns: ["a"], rows: [["x,y"]] }, { delimiter: "\t" })).toBe("a\nx,y\n");
  });
});
