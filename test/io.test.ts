import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { PmoError } from "../src/errors.js";
import { addPmoExtension, gzipPmo, isGzip, parsePmo, parsePmoText, stringifyPmo } from "../src/io/pmo.js";

const PMO_DIR = resolve(fileURLToPath(new URL("../conformance/data/pmo", import.meta.url)));
const PMO_FILES = readdirSync(PMO_DIR)
  .filter((name) => name.endsWith(".json") || name.endsWith(".json.gz"))
  .sort();

/** Exactly what Python 3.13 `json.dumps(obj, indent=2)` writes for SAMPLE (checked by hand). */
const PYTHON_OUTPUT =
  '{\n  "b": [\n    1,\n    2.5,\n    {\n      "\\u00e9": "na\\u00efve \\u2603 \\ud83d\\ude00",\n      "x": []\n    }\n  ],\n  "a": {},\n  "c": "line\\nbreak\\t\\u0007\\u007f"\n}';
const SAMPLE = { b: [1, 2.5, { é: "naïve ☃ 😀", x: [] }], a: {}, c: "line\nbreak\t\u0007\u007f" };

async function expectPmoError(promise: Promise<unknown>, code: string): Promise<void> {
  await expect(promise).rejects.toSatisfy((error: unknown) => error instanceof PmoError && error.code === code);
}

describe("example PMO files", () => {
  it.each(PMO_FILES)("%s round-trips through every input form", async (name) => {
    const bytes = new Uint8Array(readFileSync(join(PMO_DIR, name)));
    expect(isGzip(bytes)).toBe(name.endsWith(".gz"));
    const plainText = name.endsWith(".gz") ? gunzipSync(bytes).toString("utf8") : Buffer.from(bytes).toString("utf8");
    const expected: unknown = JSON.parse(plainText);

    const fromBytes = await parsePmo(bytes);
    expect(fromBytes).toEqual(expected);
    expect(await parsePmo(bytes.slice().buffer)).toEqual(expected);
    expect(await parsePmo(new Blob([bytes]))).toEqual(expected);
    expect(await parsePmo(plainText)).toEqual(expected);

    expect(parsePmoText(stringifyPmo(fromBytes))).toEqual(expected);
    expect(await parsePmo(await gzipPmo(fromBytes))).toEqual(expected);
  });
});

describe("parsePmo", () => {
  it("detects gzip by content, not by name", async () => {
    const gz = await gzipPmo({ a: 1 });
    expect(await parsePmo(new File([gz], "plain-looking.json"))).toEqual({ a: 1 });
    expect(await parsePmo(new File(['{"a":1}'], "looks-gzipped.json.gz"))).toEqual({ a: 1 });
  });

  it("reads Python's NaN and Infinity tokens as null, leaving strings alone", () => {
    expect(parsePmoText('{"a": NaN, "b": [Infinity, -Infinity], "c": "NaN Infinity"}')).toEqual({
      a: null,
      b: [null, null],
      c: "NaN Infinity",
    });
  });

  it("ignores a UTF-8 byte-order mark", async () => {
    expect(await parsePmo(new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode('{"a":1}')]))).toEqual({
      a: 1,
    });
  });

  it("throws PmoError for text that is not JSON", async () => {
    await expectPmoError(parsePmo("{not json"), "io/invalid-json");
    await expectPmoError(parsePmo(""), "io/invalid-json");
  });

  it("throws PmoError when the top level is not an object", async () => {
    for (const text of ["[]", "null", "1", '"pmo"']) await expectPmoError(parsePmo(text), "io/not-an-object");
  });

  it("throws PmoError for a corrupt gzip stream or invalid UTF-8", async () => {
    const gz = await gzipPmo({ a: 1 });
    await expectPmoError(parsePmo(gz.slice(0, gz.length - 6)), "io/invalid-gzip");
    await expectPmoError(parsePmo(new Uint8Array([0x7b, 0xff, 0x7d])), "io/invalid-utf8");
  });
});

describe("stringifyPmo", () => {
  it("writes the same bytes as Python's json.dump(pmo, f, indent=2)", () => {
    expect(stringifyPmo(SAMPLE)).toBe(PYTHON_OUTPUT);
  });

  it("can keep non-ASCII characters and change the indent", () => {
    expect(stringifyPmo({ é: "☃" }, { ensureAscii: false, indent: 0 })).toBe('{"é":"☃"}');
  });

  it("writes NaN and infinities as null", () => {
    expect(stringifyPmo({ a: Number.NaN, b: Infinity }, { indent: 0 })).toBe('{"a":null,"b":null}');
  });

  it("throws PmoError for values JSON cannot hold", () => {
    expect(() => stringifyPmo(undefined)).toThrow(PmoError);
    expect(() => stringifyPmo({ a: 1n })).toThrow(PmoError);
  });

  it("gzips the same text", async () => {
    const gz = await gzipPmo(SAMPLE);
    expect(isGzip(gz)).toBe(true);
    expect(gunzipSync(gz).toString("utf8")).toBe(PYTHON_OUTPUT);
  });
});

describe("addPmoExtension", () => {
  it.each([
    ["out", true, "out.json.gz"],
    ["out.json", true, "out.json.gz"],
    ["out.json.gz", true, "out.json.gz"],
    ["out.gz", true, "out.gz.json.gz"],
    ["out", false, "out.json"],
    ["out.json", false, "out.json"],
    ["out.json.gz", false, "out.json.gz.json"],
    ["STDOUT", true, "STDOUT"],
    ["STDOUT", false, "STDOUT"],
  ])("%s with gzip=%s gives %s", (name, gzip, expected) => {
    expect(addPmoExtension(name, { gzip })).toBe(expected);
  });

  it("defaults to gzip", () => {
    expect(addPmoExtension("out")).toBe("out.json.gz");
  });
});
