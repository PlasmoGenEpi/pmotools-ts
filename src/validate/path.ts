/** Paths into a PMO instance, shared by schema validation and integrity checks. */

/** One step into a JSON value: an object key or an array index. */
export type PathSegment = string | number;

/**
 * Formats a path for people: `["specimen_info", 0, "collection_country"]`
 * becomes `specimen_info[0].collection_country`, and `[]` becomes `(root)`.
 */
export function formatPath(path: readonly PathSegment[]): string {
  if (path.length === 0) return "(root)";
  let out = "";
  for (const segment of path) {
    if (typeof segment === "number") out += `[${segment}]`;
    else out += out === "" ? segment : `.${segment}`;
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Splits a JSON Pointer and resolves it against `root`, so array indexes come
 * back as numbers. Returns the path and the value found there (`undefined`
 * when the pointer leaves the data).
 */
export function resolvePointer(
  root: unknown,
  pointer: string,
): { path: PathSegment[]; value: unknown } {
  const path: PathSegment[] = [];
  let value: unknown = root;
  if (pointer === "") return { path, value };
  for (const raw of pointer.slice(1).split("/")) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(value) && /^(?:0|[1-9][0-9]*)$/.test(key)) {
      const index = Number(key);
      path.push(index);
      value = value[index];
    } else {
      path.push(key);
      value = isRecord(value) && Object.hasOwn(value, key) ? value[key] : undefined;
    }
  }
  return { path, value };
}
