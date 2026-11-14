import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { Cell, Row } from "../src/table/core.js";
import {
  DEFAULT_NA_VALUES,
  inferColumns,
  inferColumnTypes,
  type InferOptions,
  type RawRow,
} from "../src/table/infer.js";
import { loadCases, type OracleCase } from "./helpers/conformance.js";

const TABLES = resolve(fileURLToPath(new URL("../conformance/data/tables", import.meta.url)));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/** Decodes a recorded cell; infinities are recorded as `{ float: "inf" | "-inf" }`. */
function decodeCell(value: unknown): Cell {
  if (isRecord(value) && (value["float"] === "inf" || value["float"] === "-inf")) {
    return value["float"] === "inf" ? Infinity : -Infinity;
  }
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  throw new Error(`Unexpected recorded cell: ${JSON.stringify(value)}`);
}

function grid(value: unknown): unknown[][] {
  if (!Array.isArray(value) || !value.every(Array.isArray)) throw new Error("Expected a grid");
  return value;
}

function toRawRows(columns: readonly string[], cells: unknown[][]): RawRow[] {
  return cells.map((row) =>
    Object.fromEntries(
      columns.map((column, index) => {
        const cell = row[index];
        if (cell !== null && typeof cell !== "string") throw new Error("Raw cell is not a string");
        return [column, cell];
      }),
    ),
  );
}

function toTypedRows(columns: readonly string[], cells: unknown[][]): Record<string, Cell>[] {
  return cells.map((row) => Object.fromEntries(columns.map((column, index) => [column, decodeCell(row[index])])));
}

/** Maps the Python wrapper's keyword arguments onto TypeScript options. */
function optionsFor(kwargs: Readonly<Record<string, unknown>>): InferOptions {
  const extra = isStringArray(kwargs["na_values"]) ? kwargs["na_values"] : [];
  const naValues = kwargs["keep_default_na"] === false ? extra : [...DEFAULT_NA_VALUES, ...extra];
  const textColumns = isStringArray(kwargs["text_columns"]) ? kwargs["text_columns"] : [];
  return { naValues, textColumns };
}

function recorded(testCase: OracleCase): Record<string, unknown> {
  if (testCase.result.kind !== "ok" || !isRecord(testCase.result.value)) {
    throw new Error(`${testCase.id}: expected a recorded table`);
  }
  return testCase.result.value;
}

function columnsOf(value: Record<string, unknown>): string[] {
  const columns = value["columns"];
  if (!isStringArray(columns)) throw new Error("Expected column names");
  return columns;
}

const allCases = loadCases("infer/bool")
  .concat(loadCases("infer/float"), loadCases("infer/int"), loadCases("infer/na"))
  .concat(loadCases("infer/options"), loadCases("infer/shape"));

describe("inferColumnTypes matches pd.read_csv", () => {
  it.each(allCases.map((c) => [c.id, c] as const))("%s", (_, testCase) => {
    const value = recorded(testCase);
    const columns = columnsOf(value);
    const raw = toRawRows(columns, grid(value["raw"]));
    const { table, dtypes } = inferColumns(raw, optionsFor(testCase.kwargs));
    expect(table).toEqual(toTypedRows(columns, grid(value["rows"])));
    // A table with no rows has no columns (see core.ts), so there is nothing
    // to report a dtype for; pandas reports object for each header name.
    expect(dtypes).toEqual(raw.length === 0 ? {} : value["dtypes"]);
  });
});

describe("inferColumnTypes on the example tables", () => {
  it.each(loadCases("infer/example").map((c) => [c.id, c] as const))("%s", (_, testCase) => {
    const value = recorded(testCase);
    const columns = columnsOf(value);
    const file = testCase.kwargs["file"];
    if (typeof file !== "string") throw new Error("Expected a file name");

    if (value["raw"] !== undefined) {
      const { table, dtypes } = inferColumns(toRawRows(columns, grid(value["raw"])));
      expect(table).toEqual(toTypedRows(columns, grid(value["rows"])));
      expect(dtypes).toEqual(value["dtypes"]);
      return;
    }

    // Large file: split it ourselves (the generator checked this matches
    // pandas' raw grid), then check every cell against the column mapping.
    const delimiter = value["delimiter"];
    if (typeof delimiter !== "string") throw new Error("Expected a delimiter");
    const lines = readFileSync(join(TABLES, file), "utf8").split(/\r?\n/);
    if (lines.at(-1) === "") lines.pop();
    const [header, ...body] = lines.map((line) => line.split(delimiter));
    expect(header).toEqual(columns);
    expect(body.length).toBe(value["row_count"]);
    const { table, dtypes } = inferColumns(toRawRows(columns, body));
    expect(dtypes).toEqual(value["dtypes"]);

    const mapping = value["mapping"];
    if (!isRecord(mapping)) throw new Error("Expected a mapping");
    for (const column of columns) {
      const pairs = mapping[column];
      if (!Array.isArray(pairs)) throw new Error(`No mapping for ${column}`);
      const expected = new Map<string, Cell>();
      for (const pair of pairs) {
        if (!Array.isArray(pair) || typeof pair[0] !== "string") throw new Error("Bad mapping pair");
        expected.set(pair[0], decodeCell(pair[1]));
      }
      const actual = table.map((row) => row[column]);
      const wanted = body.map((cells) => expected.get(cells[columns.indexOf(column)] ?? ""));
      expect(actual).toEqual(wanted);
    }
  });
});

describe("inferColumnTypes API", () => {
  it("defaults to pandas' NA strings and returns rows with every column", () => {
    const rows: RawRow[] = [{ a: "001", b: "TRUE" }, { a: "NA", b: "false", c: "x" }];
    expect(inferColumnTypes(rows)).toEqual([
      { a: 1, b: true, c: null },
      { a: null, b: false, c: "x" },
    ]);
  });

  it("treats null and undefined as missing even with no NA strings", () => {
    const rows: RawRow[] = [{ a: "1" }, { a: null }, { a: undefined }];
    expect(inferColumns(rows, { naValues: [] })).toEqual({
      table: [{ a: 1 }, { a: null }, { a: null }],
      dtypes: { a: "float64" },
    });
  });

  it("does not mutate its input", () => {
    const rows: RawRow[] = [{ a: "1" }, { a: "NA" }];
    const copy = structuredClone(rows);
    inferColumnTypes(rows);
    expect(rows).toEqual(copy);
  });

  it("reads integers exactly on both sides of the short-integer fast path", () => {
    const rows: RawRow[] = [
      { n: "-0" },
      { n: "00000000000000001" },
      { n: "000000000000000000001" },
      { n: " 9007199254740991 " },
      { n: "9007199254740993" },
    ];
    const { table, dtypes } = inferColumns(rows);
    expect(dtypes).toEqual({ n: "int64" });
    expect(table.map((row) => row["n"])).toEqual([0, 1, 1, 9007199254740991, 9007199254740992]);
    expect(Object.is(table[0]?.["n"], -0)).toBe(false);
  });

  it("keeps first-seen column order across ragged rows", () => {
    const rows: RawRow[] = [{ b: "1", a: "x" }, { b: "2", a: "y" }, { c: "z" }, { a: "w", b: "3" }];
    const { table } = inferColumns(rows);
    expect(table.map((row) => Object.keys(row))).toEqual(Array.from({ length: 4 }, () => ["b", "a", "c"]));
    expect(table[2]).toEqual({ b: null, a: null, c: "z" });
  });

  it("writes a __proto__ column as an own key", () => {
    const rows: RawRow[] = [JSON.parse('{"__proto__": "p", "n": "1"}'), JSON.parse('{"__proto__": "q", "n": "2"}')];
    const { table } = inferColumns(rows);
    expect(Object.getPrototypeOf(table[0])).toBe(Object.prototype);
    expect(Object.hasOwn(table[1] ?? {}, "__proto__")).toBe(true);
    expect(table.map((row) => row["n"])).toEqual([1, 2]);
  });

  it("reads a __proto__ column as missing in the rows that lack it", () => {
    const protoOf = (row: Row): unknown => (Object.hasOwn(row, "__proto__") ? row["__proto__"] : "absent");
    const text = inferColumns([JSON.parse('{"__proto__": "p", "n": "1"}'), { n: "2" }]);
    expect(text.table.map(protoOf)).toEqual(["p", null]);
    expect(Object.getPrototypeOf(text.table[1])).toBe(Object.prototype);
    // Before the fix, the row without the column read Object.prototype as its cell and the parser threw.
    const numeric = inferColumns([JSON.parse('{"__proto__": "1", "n": "1"}'), { n: "2" }]);
    expect(numeric.table.map(protoOf)).toEqual([1, null]);
    expect(numeric.dtypes["n"]).toBe("int64");
  });

  it("returns an empty table for no rows", () => {
    expect(inferColumns([])).toEqual({ table: [], dtypes: {} });
  });
});
