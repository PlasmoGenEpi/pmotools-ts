/**
 * Loads oracle cases: recorded calls to pmotools-python that the TypeScript
 * implementation must reproduce. See `conformance/oracle/common.py` for how
 * they are written.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Cell, Row } from "../../src/table/core.js";

const CASES_ROOT = resolve(fileURLToPath(new URL("../../conformance/cases", import.meta.url)));

/** What Python wrote for NaN and infinities. */
export const NAN_SENTINEL = "__NaN__";

/** A DataFrame argument as recorded by the oracle. */
export interface OracleTable {
  readonly columns: readonly string[];
  /** pandas dtype per column, for reference when a case depends on it. */
  readonly dtypes: Readonly<Record<string, string>>;
  readonly rows: readonly (readonly Cell[])[];
}

export type OracleResult =
  | { readonly kind: "ok"; readonly value: unknown }
  | { readonly kind: "error"; readonly type: string; readonly message: string };

export interface OracleWarning {
  readonly category: string;
  readonly message: string;
}

export interface OracleCase {
  readonly id: string;
  /** Name of the Python function that was called. */
  readonly function: string;
  readonly note: string | null;
  /** Set when pmotools-ts deliberately differs from the recorded outcome. */
  readonly divergence: string | null;
  /** DataFrame arguments by Python parameter name. */
  readonly tables: Readonly<Record<string, OracleTable>>;
  /** Every other argument, by Python parameter name. */
  readonly kwargs: Readonly<Record<string, unknown>>;
  readonly result: OracleResult;
  readonly warnings: readonly OracleWarning[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOracleCase(value: unknown): value is OracleCase {
  if (!isRecord(value)) return false;
  const { id, tables, kwargs, result, warnings } = value;
  return (
    typeof id === "string" &&
    typeof value["function"] === "string" &&
    isRecord(tables) &&
    isRecord(kwargs) &&
    isRecord(result) &&
    (result["kind"] === "ok" || result["kind"] === "error") &&
    Array.isArray(warnings)
  );
}

/** Loads every case under `conformance/cases/<directory>`, sorted by file name. */
export function loadCases(directory: string): OracleCase[] {
  const folder = join(CASES_ROOT, directory);
  return readdirSync(folder)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const parsed: unknown = JSON.parse(readFileSync(join(folder, name), "utf8"));
      if (!isOracleCase(parsed)) throw new Error(`Malformed oracle case: ${join(folder, name)}`);
      return parsed;
    });
}

/** Turns a recorded DataFrame into the row objects the builders take. */
export function toRows(table: OracleTable): Row[] {
  return table.rows.map((cells) =>
    Object.fromEntries(table.columns.map((column, index) => [column, cells[index] ?? null])),
  );
}

/** `library_sample_name_col` becomes `librarySampleNameCol`. */
export function camelCase(name: string): string {
  return name.replace(/_([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

/** Renames an object's own keys from Python keyword style to option style. Values are untouched. */
export function camelizeKeys(kwargs: Readonly<Record<string, unknown>>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(kwargs).map(([key, value]) => [camelCase(key), value]));
}
