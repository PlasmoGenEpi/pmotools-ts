/**
 * The whole pipeline through the public entry point, starting from text as a
 * browser app would: type the cells, build each fragment, merge, validate and
 * write. Each stage is compared with what pmotools-python produced from the
 * same example files (recorded in the `merge/example-full-nine-inputs` case).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PMOTOOLS_TS_VERSION,
  checkPmoIntegrity,
  collectWarnings,
  gzipPmo,
  inferColumnTypes,
  librarySampleInfoTableToPmo,
  mergeToPmo,
  mhapTableToPmo,
  panelInfoTableToPmo,
  parsePmo,
  readCountByStageTableToPmo,
  specimenInfoTableToPmo,
  stringifyPmo,
  validatePmo,
  type MergeParts,
  type Table,
} from "../src/index.js";
import { loadCases } from "./helpers/conformance.js";

const TABLES = new URL("../conformance/data/tables/", import.meta.url);

/** Reads a tab-separated example file and types its columns the way the Python app's reader does. */
function readTable(name: string): Table {
  const lines = readFileSync(fileURLToPath(new URL(name, TABLES)), "utf8")
    .split(/\r?\n/)
    .filter((line) => line !== "");
  const [header, ...body] = lines.map((line) => line.split("\t"));
  if (header === undefined) throw new Error(`${name} is empty`);
  return inferColumnTypes(
    body.map((cells) => Object.fromEntries(header.map((column, index) => [column, cells[index]]))),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Drops the two header fields that legitimately differ from Python: the date and the tool name. */
function withoutProvenance(pmo: unknown): unknown {
  if (!isRecord(pmo) || !isRecord(pmo["pmo_header"])) throw new Error("not a PMO");
  const { creation_date: _date, generation_method: _method, ...header } = pmo["pmo_header"];
  return { ...pmo, pmo_header: header };
}

const oracle = loadCases("merge").find((item) => item.id === "merge/example-full-nine-inputs");
if (oracle === undefined || oracle.result.kind !== "ok") {
  throw new Error("oracle case merge/example-full-nine-inputs is missing");
}
const expected = oracle.kwargs;
const expectedPmo = oracle.result.value;

describe("tables to PMO, end to end", () => {
  const mhapInfo = mhapTableToPmo(readTable("mad4hatter_allele_data_example.csv"), {
    bioinformaticsRunName: "run1",
    librarySampleNameCol: "SampleID",
    targetNameCol: "Locus",
    seqCol: "ASV",
    readsCol: "Reads",
  });
  const panelTargetInfo = panelInfoTableToPmo(readTable("mad4hatter_panel_info_example.csv"), {
    panelName: "Mad4hatter",
    targetNameCol: "amplicon",
  });
  const metadata = readTable("mad4hatter_metadata_example.tsv");
  const specimenInfo = specimenInfoTableToPmo(metadata, {
    specimenNameCol: "specimen_id",
    specimenTaxonIdCol: "samp_taxon_id",
    hostTaxonIdCol: "host_taxon_id",
    collectionDateCol: "collection_date",
    collectionCountryCol: "collection_country",
    projectNameCol: "project_name",
    geoAdmin3Col: "geo_admin3",
    latLonCol: "lat_lon",
    specimenCollectDeviceCol: "samp_collect_device",
    specimenStoreLocCol: "samp_store_loc",
    additionalSpecimenCols: ["collector"],
  });
  const librarySampleInfo = librarySampleInfoTableToPmo(metadata, {
    librarySampleNameCol: "experiment_sample_id",
    specimenNameCol: "specimen_id",
    panelNameCol: "panel_id",
    sequencingInfoNameCol: "sequencing_info_id",
    libraryPrepPlateNameCol: "plate_name",
    libraryPrepPlateRowCol: "plate_row",
    libraryPrepPlateColCol: "plate_col",
  });
  const readCountsByStageInfo = readCountByStageTableToPmo(readTable("example_raw_reads.txt"), {
    bioinformaticsRunName: "run1",
    readsByStageTable: readTable("reads_per_stage.txt"),
    librarySampleNameCol: "sample",
    targetNameCol: "target",
    totalRawCountCol: "raw_count",
    readCountCol: "reads",
  });

  // The four hand-entered sections come from forms in the app, not from a
  // builder, so the test takes them from the recorded Python call.
  const handEntered = {
    sequencingInfo: expected["sequencing_info"],
    bioinfoMethodInfo: expected["bioinfo_method_info"],
    bioinfoRunInfo: expected["bioinfo_run_info"],
    projectInfo: expected["project_info"],
  } as Pick<MergeParts, "sequencingInfo" | "bioinfoMethodInfo" | "bioinfoRunInfo" | "projectInfo">;

  const { result: pmo, warnings } = collectWarnings((onWarning) =>
    mergeToPmo(
      { mhapInfo, panelTargetInfo, specimenInfo, librarySampleInfo, readCountsByStageInfo, ...handEntered },
      { onWarning, creationDate: "2026-01-01" },
    ),
  );

  it("builds each fragment exactly as pmotools-python does", () => {
    expect(mhapInfo).toEqual(expected["mhap_info"]);
    expect(panelTargetInfo).toEqual(expected["panel_target_info"]);
    expect(specimenInfo).toEqual(expected["specimen_info"]);
    expect(librarySampleInfo).toEqual(expected["library_sample_info"]);
    expect(readCountsByStageInfo).toEqual(expected["read_counts_by_stage_info"]);
  });

  it("merges to the same PMO as pmotools-python", () => {
    expect(withoutProvenance(pmo)).toEqual(withoutProvenance(expectedPmo));
    expect(warnings.map((warning) => warning.code)).toHaveLength(oracle.warnings.length);
  });

  it("stamps the header with this library and the given date", () => {
    expect(pmo.pmo_header).toMatchObject({
      pmo_version: "1.1.0",
      creation_date: "2026-01-01",
      generation_method: { program_name: "pmotools-ts", program_version: PMOTOOLS_TS_VERSION },
    });
  });

  it("matches the version in package.json", () => {
    const manifest: unknown = JSON.parse(
      readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"),
    );
    expect(isRecord(manifest) && manifest["version"]).toBe(PMOTOOLS_TS_VERSION);
  });

  it("produces a PMO that passes schema validation and the integrity checks", () => {
    const verdict = validatePmo(pmo);
    expect(verdict.valid ? [] : verdict.errors).toEqual([]);
    expect(checkPmoIntegrity(pmo).filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("survives being written and read back, plain and gzipped", async () => {
    expect(await parsePmo(stringifyPmo(pmo))).toEqual(pmo);
    expect(await parsePmo(await gzipPmo(pmo))).toEqual(pmo);
  });
});
