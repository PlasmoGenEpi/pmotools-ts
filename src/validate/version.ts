/** Mapping the version a PMO file declares to a bundled schema. */
import { isSchemaVersion, type SchemaVersion } from "./schema.js";

/**
 * Maps a declared `pmo_version` to the bundled schema of that version, or
 * `undefined` when none is bundled.
 *
 * Accepts an optional leading `v` and a missing patch number: `"v1.0.0"`,
 * `"1.0.0"` and `"1.0"` all give `"1.0.0"`; `"1.1.0"` gives `"1.1.0"`.
 * Pre-release versions found in the wild (`"0.1.0"`, `"0.1"`) give
 * `undefined`.
 */
export function schemaVersionForPmoVersion(pmoVersion: string): SchemaVersion | undefined {
  const match = /^\s*[vV]?(\d+)\.(\d+)(?:\.(\d+))?\s*$/.exec(pmoVersion);
  if (!match) return undefined;
  const [, major, minor, patch] = match;
  const normalized = `${Number(major)}.${Number(minor)}.${Number(patch ?? 0)}`;
  return isSchemaVersion(normalized) ? normalized : undefined;
}

/** What a PMO says about its own version. */
export interface DeclaredPmoVersion {
  /** `pmo_header.pmo_version` as written, or `undefined` if absent or not a string. */
  readonly declared: string | undefined;
  /** The bundled schema for that version, or `undefined` if there is none. */
  readonly schemaVersion: SchemaVersion | undefined;
}

/**
 * Reads `pmo_header.pmo_version` from parsed JSON (validated or not) and maps
 * it with {@link schemaVersionForPmoVersion}.
 *
 * pmotools-python ignores the declared version and always validates against
 * its default schema; {@link validatePmo} does the same unless told
 * otherwise. Use this to warn about, or choose, a different schema.
 */
export function readPmoVersion(data: unknown): DeclaredPmoVersion {
  const header = typeof data === "object" && data !== null ? Reflect.get(data, "pmo_header") : undefined;
  const raw = typeof header === "object" && header !== null ? Reflect.get(header, "pmo_version") : undefined;
  const declared = typeof raw === "string" ? raw : undefined;
  return {
    declared,
    schemaVersion: declared === undefined ? undefined : schemaVersionForPmoVersion(declared),
  };
}
