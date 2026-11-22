import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { PmoError } from "../src/errors.js";
import { jsonChunks } from "../src/io/jsonChunks.js";
import { gzipPmo, parsePmo, pmoBlob, pmoStream, stringifyPmo, stringifyPmoChunks } from "../src/io/pmo.js";

const PMO_DIR = resolve(fileURLToPath(new URL("../conformance/data/pmo", import.meta.url)));
const INDENTS: readonly (number | string)[] = [2, 0, 4, -1, 2.7, 11, "\t", "", "abcdefghijklmno"];
/** Walk everything, and give out a piece at every chance. */
const EAGER = { nodeLimit: 1, pieceLength: 1 };

class Point {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}
}

const bare: Record<string, unknown> = Object.create(null);
bare["k"] = [1, { deep: [null] }];

const AWKWARD: Record<string, unknown> = {
  text: 'quote " backslash \\ newline \n tab \t unicode é 中文 😀',
  "key \"with\" \n escapes": 1,
  numbers: [0, -0, 1.5, -2e-7, 1e21, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
  booleans: [true, false],
  nothing: null,
  skipped: undefined,
  fn: () => 1,
  symbol: Symbol("s"),
  inArray: [undefined, () => 1, Symbol("t"), null],
  sparse: [1, , 3],
  empties: { object: {}, array: [], nested: [[], {}, [[]], { a: {} }] },
  onlySkipped: { a: undefined, b: () => 2 },
  date: new Date(Date.UTC(2026, 10, 22)),
  withToJson: { toJSON: (key: string) => ({ asKey: key }) },
  point: new Point(1, 2),
  map: new Map([["a", 1]]),
  boxed: [new Number(3), new String("s"), new Boolean(false)],
  bare,
};

describe("jsonChunks", () => {
  for (const indent of INDENTS) {
    it(`joins to what JSON.stringify gives with indent ${JSON.stringify(indent)}`, () => {
      const expected = JSON.stringify(AWKWARD, null, indent);
      expect([...jsonChunks(AWKWARD, indent, EAGER)].join("")).toBe(expected);
      expect([...jsonChunks(AWKWARD, indent, { nodeLimit: 5, pieceLength: 7 })].join("")).toBe(expected);
      expect([...jsonChunks(AWKWARD, indent)].join("")).toBe(expected);
    });
  }

  it("matches JSON.stringify on random nested values, however it is split", () => {
    let state = 11;
    const random = (below: number): number => {
      state = (state * 1_103_515_245 + 12_345) % 2_147_483_648;
      return state % below;
    };
    const leaf = (): unknown =>
      [null, undefined, true, 0, -0, 3.25, Number.NaN, "", "é\n", "x"][random(10)];
    const value = (depth: number): unknown => {
      const kind = depth > 4 ? 0 : random(3);
      if (kind === 0) return leaf();
      const size = random(6);
      if (kind === 1) return Array.from({ length: size }, () => value(depth + 1));
      return Object.fromEntries(Array.from({ length: size }, (_, index) => [`k${index}`, value(depth + 1)]));
    };
    for (let round = 0; round < 200; round += 1) {
      const sample = value(0);
      const indent = INDENTS[random(INDENTS.length)] ?? 2;
      const tuning = { nodeLimit: 1 + random(8), pieceLength: 1 + random(40) };
      const expected = JSON.stringify(sample, null, indent);
      const pieces = [...jsonChunks(sample, indent, tuning)];
      expect(pieces.length > 0 ? pieces.join("") : undefined, `round ${round}`).toBe(expected);
    }
  });

  it("calls toJSON with the key JSON.stringify would pass, at the top and below", () => {
    const keyed = { toJSON: (key: string) => ({ key, inner: [1, { at: key }] }) };
    for (const value of [keyed, [keyed, { k: keyed }], new Date(0), { d: new Date(0) }]) {
      for (const indent of INDENTS) {
        expect([...jsonChunks(value, indent, EAGER)].join("")).toBe(JSON.stringify(value, null, indent));
      }
    }
  });

  it("gives nothing where JSON.stringify gives undefined", () => {
    expect([...jsonChunks(undefined, 2, EAGER)]).toEqual([]);
    expect([...jsonChunks(() => 1, 2, EAGER)]).toEqual([]);
  });

  it("throws where JSON.stringify throws", () => {
    const cyclic: Record<string, unknown> = { a: [1, 2] };
    cyclic["self"] = { back: cyclic };
    expect(() => [...jsonChunks(cyclic, 2, EAGER)]).toThrow(TypeError);
    expect(() => [...jsonChunks(cyclic, 2)]).toThrow(TypeError);
    expect(() => [...jsonChunks({ big: [1n] }, 2, EAGER)]).toThrow(TypeError);
  });

  it("gives pieces of about the asked length", () => {
    const rows = Array.from({ length: 5000 }, (_, index) => ({ id: index, name: `row ${index}` }));
    const pieces = [...jsonChunks(rows, 2, { nodeLimit: 100, pieceLength: 10_000 })];
    expect(pieces.length).toBeGreaterThan(5);
    for (const piece of pieces.slice(0, -1)) expect(piece.length).toBeLessThan(11_000);
  });
});

const examples = readdirSync(PMO_DIR).filter((name) => name.endsWith(".json"));

async function text(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

describe("stringifyPmoChunks and pmoStream", () => {
  it("has example PMOs", () => {
    expect(examples.length).toBeGreaterThan(3);
  });

  for (const name of examples) {
    it(`write ${name} exactly as stringifyPmo does`, async () => {
      const pmo = await parsePmo(new Uint8Array(readFileSync(join(PMO_DIR, name))));
      for (const ensureAscii of [true, false]) {
        const expected = stringifyPmo(pmo, { ensureAscii });
        expect([...stringifyPmoChunks(pmo, { ensureAscii })].join("")).toBe(expected);
        expect(await text(pmoStream(pmo, { ensureAscii }))).toBe(expected);
      }
      const expected = stringifyPmo(pmo);
      expect(gunzipSync(await gzipPmo(pmo)).toString("utf8")).toBe(expected);
      expect(gunzipSync(new Uint8Array(await new Response(pmoStream(pmo, { gzip: true })).arrayBuffer())).toString("utf8")).toBe(expected);
      const blob = await pmoBlob(pmo, { gzip: true });
      expect(blob.type).toBe("application/gzip");
      expect(await parsePmo(blob)).toStrictEqual(pmo);
      expect((await pmoBlob(pmo)).type).toBe("application/json");
    });
  }

  it("reports a PMO that cannot be written as io/not-serialisable", async () => {
    const cyclic: Record<string, unknown> = {};
    cyclic["self"] = cyclic;
    expect(() => [...stringifyPmoChunks(undefined)]).toThrow(expect.objectContaining({ code: "io/not-serialisable" }));
    expect(() => [...stringifyPmoChunks(cyclic)]).toThrow(expect.objectContaining({ code: "io/not-serialisable" }));
    await expect(text(pmoStream(cyclic))).rejects.toBeInstanceOf(PmoError);
    await expect(gzipPmo(cyclic)).rejects.toMatchObject({ code: "io/not-serialisable" });
    await expect(pmoBlob({ big: 1n })).rejects.toMatchObject({ code: "io/not-serialisable" });
  });
});
