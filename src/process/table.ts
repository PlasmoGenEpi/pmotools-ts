/**
 * The tables the exporters and counters return, and the helpers they share
 * to lay them out the way pandas does.
 */
import type { PortableMicrohaplotypeObject } from "../types/pmo.js";

/** A cell of an exported table. `null` is a missing value. */
export type TableCell = string | number | boolean | null;

/**
 * A table with its columns in order, as pandas would lay it out: a row
 * missing a column has `null` there. Ready to write as CSV or TSV with
 * `formatDelimited`.
 */
export interface ColumnTable {
  readonly columns: readonly string[];
  readonly rows: readonly (readonly TableCell[])[];
}

/** A PMO, or anything shaped enough like one for the processors to read. */
export type PmoData = PortableMicrohaplotypeObject;

/** One row while a table is being built: its cells by column, in insertion order. */
export type RowRecord = Map<string, TableCell>;

/**
 * Lays rows out as pandas' `DataFrame(list_of_dicts)` does: columns in the
 * order they first appear, `null` where a row has no value. `columns`, when
 * given, puts those first (in that order) and the rest after.
 */
export function tableFromRecords(
  records: readonly RowRecord[],
  order?: (columns: readonly string[]) => readonly string[],
): ColumnTable {
  const seen: string[] = [];
  const known = new Set<string>();
  for (const record of records) {
    for (const key of record.keys()) {
      if (!known.has(key)) {
        known.add(key);
        seen.push(key);
      }
    }
  }
  const columns = order === undefined ? seen : [...order(seen)];
  return {
    columns,
    rows: records.map((record) => columns.map((column) => record.get(column) ?? null)),
  };
}

/** `priority` columns that are present, in that order, then the rest sorted, as pandas code here does. */
export function priorityThenSorted(priority: readonly string[]) {
  return (columns: readonly string[]): string[] => [
    ...priority.filter((column) => columns.includes(column)),
    ...columns.filter((column) => !priority.includes(column)).toSorted(compareCodePoints),
  ];
}

/** Compares strings by code point, as Python's `sorted` does. */
export function compareCodePoints(a: string, b: string): number {
  const left = [...a];
  const right = [...b];
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    const x = left[index]?.codePointAt(0) ?? 0;
    const y = right[index]?.codePointAt(0) ?? 0;
    if (x !== y) return x - y;
  }
  return left.length - right.length;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Python's `str()` of a JSON value: `True`, `None`, `['a', 'b']`. */
export function pythonStr(value: unknown): string {
  if (typeof value === "string") return value;
  return pythonRepr(value);
}

function pythonRepr(value: unknown): string {
  if (value === null || value === undefined) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
  if (Array.isArray(value)) return `[${value.map(pythonRepr).join(", ")}]`;
  if (isRecord(value)) {
    return `{${Object.entries(value)
      .map(([key, item]) => `${pythonRepr(key)}: ${pythonRepr(item)}`)
      .join(", ")}}`;
  }
  return String(value);
}

/** A value that can sit in a table cell as it is: text, a number, true or false, or null. */
export function isPrimitive(value: unknown): value is TableCell {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/** A list whose items are all primitives. */
export function isPrimitiveList(value: unknown): value is readonly TableCell[] {
  return Array.isArray(value) && value.every(isPrimitive);
}

/**
 * The cell for a field value, as pmotools-python exports it: a primitive as
 * it is, a list of primitives joined with `separator`, or `undefined` for
 * anything else (objects are left out of flat tables).
 */
export function exportCell(value: unknown, separator: string): TableCell | undefined {
  if (isPrimitive(value)) return value;
  if (isPrimitiveList(value)) return value.map(pythonStr).join(separator);
  return undefined;
}

/** Each own field of `record` as an exported cell, skipping objects. */
export function exportFields(
  record: Readonly<Record<string, unknown>>,
  separator: string,
  into: RowRecord = new Map(),
): RowRecord {
  for (const [key, value] of Object.entries(record)) {
    const cell = exportCell(value, separator);
    if (cell !== undefined) into.set(key, cell);
  }
  return into;
}
