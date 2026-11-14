import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { PmoError } from "../src/errors.js";
import {
  DEFAULT_SCHEMA_VERSION,
  SCHEMA_VERSIONS,
  isSchemaVersion,
  readPmoVersion,
  schemaVersionForPmoVersion,
  validatePmo,
  type SchemaVersion,
} from "../src/validate/index.js";
import { loadCases, type OracleCase } from "./helpers/conformance.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CASES = join(ROOT, "conformance/cases/validate");
const PMOS = join(ROOT, "conformance/data/pmo");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(path: string): unknown {
  const buffer = readFileSync(path);
  return JSON.parse((path.endsWith(".gz") ? gunzipSync(buffer) : buffer).toString("utf8"));
}

const FIXTURE = readJson(join(CASES, "fixtures/full_pmo.json"));

/** Applies one oracle edit (`{remove}` or `{set, value}`, by JSON Pointer) to a copy of `base`. */
function applyEdit(base: unknown, edit: unknown): unknown {
  if (!isRecord(edit)) throw new Error("malformed edit");
  const out: unknown = structuredClone(base);
  const pointer = typeof edit["remove"] === "string" ? edit["remove"] : edit["set"];
  if (typeof pointer !== "string") throw new Error("malformed edit");
  const keys = pointer
    .slice(1)
    .split("/")
    .map((k) => k.replace(/~1/g, "/").replace(/~0/g, "~"));
  const last = keys.pop();
  if (last === undefined) throw new Error("empty pointer");
  let target: unknown = out;
  for (const key of keys) {
    target = Array.isArray(target) ? target[Number(key)] : isRecord(target) ? target[key] : undefined;
  }
  if (Array.isArray(target)) {
    if ("remove" in edit) target.splice(Number(last), 1);
    else target[Number(last)] = structuredClone(edit["value"]);
  } else if (isRecord(target)) {
    if ("remove" in edit) delete target[last];
    else target[last] = structuredClone(edit["value"]);
  } else {
    throw new Error(`pointer ${pointer} does not resolve`);
  }
  return out;
}

/** Inputs of a case, with a label for each, in the order of the recorded verdicts. */
function instancesOf(oracle: OracleCase): { label: string; instance: unknown }[] {
  const { file, instance, base, edits, pointer, values } = oracle.kwargs;
  if (typeof file === "string") return [{ label: file, instance: readJson(join(PMOS, file)) }];
  if (base === undefined) return [{ label: "inline", instance }];
  if (base !== "full_pmo") throw new Error(`unknown fixture ${String(base)}`);
  if (typeof pointer === "string" && Array.isArray(values)) {
    return values.map((value) => ({
      label: `${pointer} = ${JSON.stringify(value)}`,
      instance: applyEdit(FIXTURE, { set: pointer, value }),
    }));
  }
  if (!Array.isArray(edits)) throw new Error(`case ${oracle.id} has no edits`);
  return edits.map((edit) => ({ label: JSON.stringify(edit), instance: applyEdit(FIXTURE, edit) }));
}

/** Every case directory under conformance/cases/validate, except the fixtures. */
function caseDirectories(directory = ""): string[] {
  const here = join(CASES, directory);
  const subdirectories = readdirSync(here)
    .filter((name) => name !== "fixtures" && statSync(join(here, name)).isDirectory())
    .flatMap((name) => caseDirectories(directory === "" ? name : `${directory}/${name}`));
  const hasCases = readdirSync(here).some((name) => name.endsWith(".json"));
  return hasCases ? [directory, ...subdirectories] : subdirectories;
}

const ALL_CASES = caseDirectories().flatMap((directory) => loadCases(`validate/${directory}`));

describe("validatePmo agrees with pmotools-python (oracle)", () => {
  it("has the expected oracle cases", () => {
    expect(ALL_CASES.length).toBeGreaterThan(250);
  });

  it.each(ALL_CASES.map((c) => [c.id, c] as const))("%s", (_id, oracle) => {
    expect(oracle.result.kind).toBe("ok");
    if (oracle.result.kind !== "ok") return;
    const recorded = oracle.result.value;
    const verdicts = Array.isArray(recorded) ? recorded : [recorded];
    const schemaVersion = oracle.kwargs["schema_version"];
    if (!isSchemaVersion(schemaVersion)) throw new Error(`bad schema_version in ${oracle.id}`);
    const inputs = instancesOf(oracle);
    expect(inputs).toHaveLength(verdicts.length);

    const disagreements: string[] = [];
    inputs.forEach(({ label, instance }, index) => {
      const python = verdicts[index];
      if (typeof python !== "string") throw new Error(`bad verdict in ${oracle.id}`);
      const result = validatePmo(instance, { schemaVersion });
      const pythonValid = python === "valid";
      if (result.valid !== pythonValid) {
        const ours = result.valid ? "valid" : result.errors.map((e) => e.message).join("; ");
        disagreements.push(`${label}: python ${python}; typescript ${ours}`);
      }
      // Where Python failed, one of our errors must be at the same place or
      // inside it (jsonschema's best match may name an enclosing anyOf).
      if (!result.valid && !pythonValid) {
        const at = python.replace(/^invalid: \S+ at /, "");
        const pointer = at === "(root)" ? "" : at;
        const near = result.errors.some(
          (e) => e.instancePath === pointer || e.instancePath.startsWith(`${pointer}/`),
        );
        if (!near) disagreements.push(`${label}: python failed at ${at}, typescript elsewhere`);
      }
    });
    expect(disagreements).toEqual([]);
  });
});

describe("validatePmo", () => {
  const fixture = () => structuredClone(FIXTURE);

  it("defaults to the newest schema, like pmotools-python", () => {
    expect(DEFAULT_SCHEMA_VERSION).toBe(SCHEMA_VERSIONS[SCHEMA_VERSIONS.length - 1]);
    const result = validatePmo(fixture());
    expect(result.schemaVersion).toBe("1.1.0");
    expect(result.valid).toBe(true);
  });

  it("returns the same object, typed, when valid", () => {
    const data = fixture();
    const result = validatePmo(data);
    if (!result.valid) throw new Error("expected valid");
    expect(result.pmo).toBe(data);
    expect(result.pmo.pmo_header.pmo_version).toBeTypeOf("string");
  });

  it("reports message, paths, original pattern and offending value", () => {
    const data = applyEdit(FIXTURE, { set: "/specimen_info/0/collection_country", value: "Côte d'Ivoire!" });
    const result = validatePmo(data);
    if (result.valid) throw new Error("expected invalid");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({
      keyword: "pattern",
      path: ["specimen_info", 0, "collection_country"],
      instancePath: "/specimen_info/0/collection_country",
      schemaPath: "#/$defs/SpecimenInfo/properties/collection_country/pattern",
      value: "Côte d'Ivoire!",
      params: { pattern: "^[\\w ,._:'–-]+$" },
    });
    expect(result.errors[0]?.message).toContain("specimen_info[0].collection_country");
  });

  it("accepts what Python's regex dialect accepts", () => {
    const set = (pointer: string, value: unknown) => validatePmo(applyEdit(FIXTURE, { set: pointer, value })).valid;
    expect(set("/specimen_info/0/collection_country", "Côte d'Ivoire")).toBe(true);
    expect(set("/specimen_info/0/specimen_name", "abc\n")).toBe(true);
    expect(set("/specimen_info/0/specimen_name", "abc\n\n")).toBe(false);
    expect(set("/specimen_info/0/collection_date", "garbage NA")).toBe(true); // unanchored in the schema
    expect(set("/specimen_info/0/specimen_name", "a[b]^_`")).toBe(true); // [A-z]
    expect(set("/pmo_header/creation_date", "٢٠٢٤-01-01")).toBe(true); // Python's \d is Unicode
  });

  it("reports a missing required property at the object, naming the property", () => {
    const result = validatePmo(applyEdit(FIXTURE, { remove: "/target_info/0/target_name" }));
    if (result.valid) throw new Error("expected invalid");
    expect(result.errors).toEqual([
      expect.objectContaining({
        keyword: "required",
        path: ["target_info", 0],
        params: { missingProperty: "target_name" },
        schemaPath: "#/$defs/TargetInfo/required",
      }),
    ]);
  });

  it("drops anyOf noise for optional objects", () => {
    const result = validatePmo(applyEdit(FIXTURE, { set: "/library_sample_info/0/library_prep_plate_info/plate_row", value: "AB" }));
    if (result.valid) throw new Error("expected invalid");
    expect(result.errors.map((e) => e.keyword)).toEqual(["pattern"]);
  });

  it("caps the error list but counts everything", () => {
    const data = applyEdit(FIXTURE, { set: "/target_info", value: Array.from({ length: 50 }, () => ({})) });
    const result = validatePmo(data, { maxErrors: 5 });
    if (result.valid) throw new Error("expected invalid");
    expect(result.errors).toHaveLength(5);
    expect(result.errorCount).toBe(150); // three required properties each
  });

  it("validates against an older schema on request", () => {
    const data = readJson(join(PMOS, "combined_pmo_minimum_fields_example.json"));
    expect(validatePmo(data).valid).toBe(true);
    expect(validatePmo(data, { schemaVersion: "1.0.0" }).valid).toBe(false);
  });

  it("throws PmoError for a schema version that is not bundled", () => {
    const bad: unknown = "2.0.0";
    const options = { schemaVersion: bad };
    expect(() =>
      // @ts-expect-error -- deliberately wrong at run time
      validatePmo({}, options),
    ).toThrow(PmoError);
  });
});

describe("pmo_version", () => {
  it.each<[string, SchemaVersion | undefined]>([
    ["v1.0.0", "1.0.0"],
    ["1.0.0", "1.0.0"],
    ["1.0", "1.0.0"],
    ["1.1.0", "1.1.0"],
    ["V1.1", "1.1.0"],
    ["0.1.0", undefined],
    ["0.1", undefined],
    ["1.2.0", undefined],
    ["", undefined],
    ["latest", undefined],
  ])("%j maps to %s", (declared, expected) => {
    expect(schemaVersionForPmoVersion(declared)).toBe(expected);
  });

  it("reads pmo_header.pmo_version from parsed JSON", () => {
    expect(readPmoVersion({ pmo_header: { pmo_version: "v1.0.0" } })).toEqual({
      declared: "v1.0.0",
      schemaVersion: "1.0.0",
    });
    expect(readPmoVersion({ pmo_header: { pmo_version: "0.1" } })).toEqual({
      declared: "0.1",
      schemaVersion: undefined,
    });
    expect(readPmoVersion({ pmo_header: { pmo_version: 1 } })).toEqual({
      declared: undefined,
      schemaVersion: undefined,
    });
    expect(readPmoVersion(null)).toEqual({ declared: undefined, schemaVersion: undefined });
  });

  it("matches what the example files declare", () => {
    const declared = readdirSync(PMOS)
      .filter((name) => /\.json(\.gz)?$/.test(name))
      .map((name) => readPmoVersion(readJson(join(PMOS, name))).declared);
    expect(new Set(declared)).toEqual(new Set(["v1.0.0", "0.1", "1.0.0"]));
  });
});

describe("generated validators", () => {
  const generated = join(ROOT, "src/validate/generated");

  it("are up to date with the schemas and the build script", () => {
    const output = execFileSync(process.execPath, [join(ROOT, "scripts/build-validators.mjs"), "--check"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    expect(output).not.toContain("stale");
  });

  it("compile nothing at run time", () => {
    for (const name of readdirSync(generated)) {
      const source = readFileSync(join(generated, name), "utf8");
      expect(source).not.toMatch(/new Function|\beval\(|\brequire\(/);
    }
  });
});
