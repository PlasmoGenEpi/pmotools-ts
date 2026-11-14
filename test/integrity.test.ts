import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { checkPmoIntegrity, validatePmo, type IntegrityIssue } from "../src/validate/index.js";
import type { PortableMicrohaplotypeObject } from "../src/types/pmo.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PMOS = join(ROOT, "conformance/data/pmo");

function readJson(path: string): unknown {
  const buffer = readFileSync(path);
  return JSON.parse((path.endsWith(".gz") ? gunzipSync(buffer) : buffer).toString("utf8"));
}

function asPmo(data: unknown): PortableMicrohaplotypeObject {
  const result = validatePmo(data);
  if (!result.valid) throw new Error(`fixture is not schema-valid: ${result.errors[0]?.message}`);
  return result.pmo;
}

/**
 * A small valid PMO: 2 targets, 1 panel holding target 0 only, 2 library
 * samples, 2 representative targets in reverse order (rep.targets[0] is
 * target_info[1]) with 1 and 2 microhaplotypes.
 */
function base(): PortableMicrohaplotypeObject {
  const location = (start: number, end: number) => ({ genome_id: 0, chrom: "chr1", start, end });
  const target = (name: string) => ({
    target_name: name,
    forward_primer: { seq: "ACGT", location: location(0, 4) },
    reverse_primer: { seq: "TTGA", location: location(20, 24) },
    insert_location: location(4, 20),
  });
  return asPmo({
    pmo_header: { pmo_version: "1.1.0" },
    targeted_genomes: [{ name: "Pf3D7", genome_version: "2020", taxon_id: [5833], url: "NA" }],
    target_info: [target("t0"), target("t1")],
    panel_info: [{ panel_name: "p0", reactions: [{ reaction_name: "r0", panel_targets: [0] }] }],
    specimen_info: [{ specimen_name: "s0", project_id: 0 }, { specimen_name: "s1" }],
    project_info: [{ project_name: "proj", project_description: "d" }],
    sequencing_info: [
      {
        sequencing_info_name: "seq0",
        seq_platform: "ILLUMINA",
        seq_instrument_model: "MiSeq",
        library_layout: "paired",
        library_strategy: "AMPLICON",
        library_source: "GENOMIC",
        library_selection: "PCR",
      },
    ],
    library_sample_info: [
      { library_sample_name: "l0", specimen_id: 0, panel_id: 0, sequencing_info_id: 0 },
      { library_sample_name: "l1", specimen_id: 1, panel_id: 0 },
    ],
    bioinformatics_methods_info: [{ methods: [{ program: "x", program_version: "1" }] }],
    bioinformatics_run_info: [{ bioinformatics_run_name: "run", bioinformatics_methods_id: 0 }],
    representative_microhaplotypes: {
      targets: [
        { target_id: 1, microhaplotypes: [{ seq: "AAAA" }], mhap_location: location(4, 20) },
        {
          target_id: 0,
          microhaplotypes: [
            { seq: "CCCC", pseudocigar: { pseudocigar_seq: "4M", ref_loc: location(4, 8) } },
            { seq: "GGGG", associated_seq_variants: [location(5, 6)] },
          ],
        },
      ],
    },
    detected_microhaplotypes: [
      {
        bioinformatics_run_id: 0,
        library_samples: [
          {
            library_sample_id: 0,
            target_results: [{ mhaps_target_id: 1, mhaps: [{ mhap_id: 0, reads: 10 }, { mhap_id: 1, reads: 5 }] }],
          },
          { library_sample_id: 1, target_results: [{ mhaps_target_id: 1, mhaps: [{ mhap_id: 1, reads: 3 }] }] },
        ],
      },
    ],
    read_counts_by_stage: [
      {
        bioinformatics_run_id: 0,
        read_counts_by_library_sample_by_stage: [
          {
            library_sample_id: 0,
            total_raw_count: 100,
            read_counts_for_targets: [{ target_id: 1, stages: [{ stage: "raw", reads: 10 }] }],
          },
        ],
      },
    ],
  });
}

type Mutable = Record<string, unknown>;

function isRecord(value: unknown): value is Mutable {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Sets `value` at `path` in a copy of the base PMO (`undefined` deletes). */
function withValue(path: readonly (string | number)[], value: unknown): PortableMicrohaplotypeObject {
  const pmo = base();
  let target: unknown = pmo;
  for (const key of path.slice(0, -1)) {
    target = Array.isArray(target) ? target[Number(key)] : isRecord(target) ? target[String(key)] : undefined;
  }
  const last = path[path.length - 1];
  if (last === undefined) throw new Error("empty path");
  if (Array.isArray(target)) target[Number(last)] = value;
  else if (isRecord(target)) {
    if (value === undefined) delete target[String(last)];
    else target[String(last)] = value;
  } else throw new Error(`no container at ${path.join("/")}`);
  return pmo;
}

const summary = (issues: readonly IntegrityIssue[]) =>
  issues.map((i) => ({ code: i.code, severity: i.severity, path: i.path.join("/") }));

describe("checkPmoIntegrity", () => {
  it("finds nothing in a consistent PMO", () => {
    expect(checkPmoIntegrity(base())).toEqual([]);
  });

  it("finds nothing in the oracle's full fixture", () => {
    const fixture = asPmo(readJson(join(ROOT, "conformance/cases/validate/fixtures/full_pmo.json")));
    expect(checkPmoIntegrity(fixture)).toEqual([]);
  });

  it.each([
    [["library_sample_info", 0, "specimen_id"], 2, "LibrarySampleInfo.specimen_id"],
    [["library_sample_info", 0, "panel_id"], 1, "LibrarySampleInfo.panel_id"],
    [["library_sample_info", 0, "sequencing_info_id"], 1, "LibrarySampleInfo.sequencing_info_id"],
    [["specimen_info", 0, "project_id"], 1, "SpecimenInfo.project_id"],
    [["panel_info", 0, "reactions", 0, "panel_targets", 0], 2, "ReactionInfo.panel_targets"],
    [["representative_microhaplotypes", "targets", 0, "target_id"], 2, "RepresentativeMicrohaplotypesForTarget.target_id"],
    [["bioinformatics_run_info", 0, "bioinformatics_methods_id"], 1, "BioinformaticsRunInfo.bioinformatics_methods_id"],
    [["detected_microhaplotypes", 0, "bioinformatics_run_id"], 1, "DetectedMicrohaplotypes.bioinformatics_run_id"],
    [["detected_microhaplotypes", 0, "library_samples", 0, "library_sample_id"], 2, "DetectedMicrohaplotypesForSample.library_sample_id"],
    [["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps_target_id"], 2, "DetectedMicrohaplotypesForTarget.mhaps_target_id"],
    [["read_counts_by_stage", 0, "bioinformatics_run_id"], 1, "ReadCountsByStage.bioinformatics_run_id"],
    [["read_counts_by_stage", 0, "read_counts_by_library_sample_by_stage", 0, "library_sample_id"], 2, "ReadCountsByStageForLibrarySample.library_sample_id"],
    [["read_counts_by_stage", 0, "read_counts_by_library_sample_by_stage", 0, "read_counts_for_targets", 0, "target_id"], 2, "ReadCountsByStageForTarget.target_id"],
    [["target_info", 0, "insert_location", "genome_id"], 1, "GenomicLocation.genome_id"],
    [["target_info", 1, "forward_primer", "location", "genome_id"], 1, "GenomicLocation.genome_id"],
    [["representative_microhaplotypes", "targets", 0, "mhap_location", "genome_id"], 1, "GenomicLocation.genome_id"],
    [["representative_microhaplotypes", "targets", 1, "microhaplotypes", 0, "pseudocigar", "ref_loc", "genome_id"], 1, "GenomicLocation.genome_id"],
    [["representative_microhaplotypes", "targets", 1, "microhaplotypes", 1, "associated_seq_variants", 0, "genome_id"], 1, "GenomicLocation.genome_id"],
  ] as const)("reports %j = %i as out of range", (path, value, field) => {
    // Only errors: emptying the panel also (rightly) warns that detected targets are outside it.
    const issues = checkPmoIntegrity(withValue(path, value)).filter((i) => i.severity === "error");
    // A bad mhaps_target_id hides its mhap_ids, so exactly one error in every case.
    expect(summary(issues)).toEqual([
      { code: "integrity/index-out-of-range", severity: "error", path: path.join("/") },
    ]);
    expect(issues[0]?.details).toMatchObject({ field, value });
  });

  it("reports non-whole-number and negative indexes", () => {
    const path = ["library_sample_info", 0, "specimen_id"];
    expect(summary(checkPmoIntegrity(withValue(path, 0.5)))).toEqual([
      { code: "integrity/index-not-integer", severity: "error", path: path.join("/") },
    ]);
    expect(summary(checkPmoIntegrity(withValue(path, -1)))).toEqual([
      { code: "integrity/index-out-of-range", severity: "error", path: path.join("/") },
    ]);
  });

  it("resolves mhap_id through mhaps_target_id, not through target_info", () => {
    // rep.targets[1] (target_info[0]) has 2 microhaplotypes; rep.targets[0] has 1.
    const ok = ["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps", 1, "mhap_id"];
    expect(checkPmoIntegrity(withValue(ok, 1))).toEqual([]);
    const pmo = withValue(["detected_microhaplotypes", 0, "library_samples", 1, "target_results", 0, "mhaps_target_id"], 0);
    const issues = checkPmoIntegrity(pmo);
    // mhap_id 1 does not exist in rep.targets[0]; target_info[1] is also not in the panel.
    expect(summary(issues)).toEqual([
      {
        code: "integrity/target-not-in-panel",
        severity: "warning",
        path: "detected_microhaplotypes/0/library_samples/1/target_results/0/mhaps_target_id",
      },
      {
        code: "integrity/index-out-of-range",
        severity: "error",
        path: "detected_microhaplotypes/0/library_samples/1/target_results/0/mhaps/0/mhap_id",
      },
    ]);
    expect(issues[1]?.message).toContain("representative_microhaplotypes.targets[0].microhaplotypes has 1 entry");
  });

  it("treats a reference into an absent optional section as out of range", () => {
    const issues = checkPmoIntegrity(withValue(["targeted_genomes"], undefined));
    expect(issues.every((i) => i.code === "integrity/index-out-of-range" && i.details["sectionMissing"] === true)).toBe(true);
    expect(issues).toHaveLength(9); // every genomic location in base()
  });

  it("does not check absent optional references", () => {
    expect(checkPmoIntegrity(withValue(["library_sample_info", 0, "sequencing_info_id"], undefined))).toEqual([]);
    expect(checkPmoIntegrity(withValue(["detected_microhaplotypes", 0, "bioinformatics_run_id"], null))).toEqual([]);
  });

  it.each([
    [["specimen_info", 1, "specimen_name"], "s0", "specimen_info/1", "specimen_info.specimen_name"],
    [["library_sample_info", 1, "library_sample_name"], "l0", "library_sample_info/1", "library_sample_info.library_sample_name"],
    [["target_info", 1, "target_name"], "t0", "target_info/1", "target_info.target_name"],
  ] as const)("warns about duplicate names (%j)", (path, value, at, field) => {
    const issues = checkPmoIntegrity(withValue(path, value));
    expect(summary(issues)).toEqual([{ code: "integrity/duplicate-name", severity: "warning", path: at }]);
    expect(issues[0]?.details).toMatchObject({ field, name: value, firstIndex: 0 });
  });

  it("warns about duplicate representative target_id and seq", () => {
    expect(summary(checkPmoIntegrity(withValue(["representative_microhaplotypes", "targets", 0, "target_id"], 0)))).toEqual([
      {
        code: "integrity/duplicate-representative-target",
        severity: "warning",
        path: "representative_microhaplotypes/targets/1/target_id",
      },
    ]);
    const seq = ["representative_microhaplotypes", "targets", 1, "microhaplotypes", 1, "seq"];
    expect(summary(checkPmoIntegrity(withValue(seq, "CCCC")))).toEqual([
      { code: "integrity/duplicate-representative-seq", severity: "warning", path: seq.join("/") },
    ]);
  });

  it("warns about duplicate mhap_id, target results and library samples", () => {
    const mhap = ["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps", 1, "mhap_id"];
    expect(summary(checkPmoIntegrity(withValue(mhap, 0)))).toEqual([
      { code: "integrity/duplicate-mhap-id", severity: "warning", path: mhap.join("/") },
    ]);
    const lib = ["detected_microhaplotypes", 0, "library_samples", 1, "library_sample_id"];
    expect(summary(checkPmoIntegrity(withValue(lib, 0)))).toEqual([
      { code: "integrity/duplicate-library-sample-result", severity: "warning", path: lib.join("/") },
    ]);
    const results = ["detected_microhaplotypes", 0, "library_samples", 0, "target_results"];
    const repeated = [
      { mhaps_target_id: 1, mhaps: [{ mhap_id: 0, reads: 1 }] },
      { mhaps_target_id: 1, mhaps: [{ mhap_id: 1, reads: 1 }] },
    ];
    expect(summary(checkPmoIntegrity(withValue(results, repeated)))).toEqual([
      { code: "integrity/duplicate-target-result", severity: "warning", path: `${results.join("/")}/1/mhaps_target_id` },
    ]);
  });

  it("warns when a detected target is not in the library sample's panel", () => {
    const pmo = withValue(["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps"], [
      { mhap_id: 0, reads: 1 },
    ]);
    const changed = withValue(["panel_info", 0, "reactions", 0, "panel_targets"], [1]);
    expect(checkPmoIntegrity(pmo)).toEqual([]);
    expect(summary(checkPmoIntegrity(changed)).map((i) => i.code)).toEqual([
      "integrity/target-not-in-panel",
      "integrity/target-not-in-panel",
    ]);
  });

  it("warns when a location ends before it starts", () => {
    const path = ["target_info", 0, "reverse_primer", "location"];
    const issues = checkPmoIntegrity(withValue(path, { genome_id: 0, chrom: "chr1", start: 24, end: 20 }));
    expect(summary(issues)).toEqual([{ code: "integrity/end-before-start", severity: "warning", path: path.join("/") }]);
  });

  it("does not modify its input", () => {
    const pmo = withValue(["library_sample_info", 0, "specimen_id"], 9);
    const before = structuredClone(pmo);
    checkPmoIntegrity(pmo);
    expect(pmo).toEqual(before);
  });

  it("caps repeated issues per kind and summarises the rest", () => {
    const mhaps = Array.from({ length: 30 }, () => ({ mhap_id: 7, reads: 1 }));
    const pmo = withValue(["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps"], mhaps);
    const issues = checkPmoIntegrity(pmo, { maxIssuesPerKind: 5 });
    expect(issues).toHaveLength(6);
    const last = issues[5];
    expect(last?.omitted).toBe(25);
    expect(last?.path).toEqual(["detected_microhaplotypes", 0, "library_samples", 0, "target_results", 0, "mhaps", 5, "mhap_id"]);
    expect(last?.details).toMatchObject({ field: "MicrohaplotypeForTarget.mhap_id", total: 30 });
  });

  it("copes with two million detected microhaplotypes in one pass", () => {
    const pmo = base();
    const samples = 2_000;
    const perTarget = 1_000;
    // rep.targets[1] gets perTarget microhaplotypes; every sample lists all of them,
    // plus one bad mhap_id each. The arrays are shared to keep the test's memory down;
    // the checker does not care.
    const repTarget = pmo.representative_microhaplotypes.targets[1];
    if (repTarget === undefined) throw new Error("base changed");
    repTarget.microhaplotypes = Array.from({ length: perTarget }, (_, i) => ({ seq: `A${i.toString(2).replace(/0/g, "C").replace(/1/g, "G")}` }));
    const mhaps = [...Array.from({ length: perTarget }, (_, i) => ({ mhap_id: i, reads: 1 })), { mhap_id: perTarget, reads: 1 }];
    const run = pmo.detected_microhaplotypes[0];
    if (run === undefined) throw new Error("base changed");
    pmo.library_sample_info = Array.from({ length: samples }, (_, i) => ({
      library_sample_name: `l${i}`,
      specimen_id: 0,
      panel_id: 0,
    }));
    run.library_samples = Array.from({ length: samples }, (_, i) => ({
      library_sample_id: i,
      target_results: [{ mhaps_target_id: 1, mhaps }],
    }));
    pmo.read_counts_by_stage = [];

    const started = performance.now();
    const issues = checkPmoIntegrity(pmo);
    const elapsed = performance.now() - started;

    expect(issues).toHaveLength(21);
    expect(issues[20]).toMatchObject({ code: "integrity/index-out-of-range", omitted: samples - 20 });
    expect(elapsed).toBeLessThan(5_000);
  });
});

describe("checkPmoIntegrity on the example files", () => {
  const files = readdirSync(PMOS).filter((name) => /\.json(\.gz)?$/.test(name));

  it.each(files)("%s", (name) => {
    const result = validatePmo(readJson(join(PMOS, name)));
    if (!result.valid) {
      // minimum_pmo_example_bad_format.json is meant to fail the schema.
      expect(name).toBe("minimum_pmo_example_bad_format.json");
      return;
    }
    expect(summary(checkPmoIntegrity(result.pmo))).toEqual([]);
  });
});
