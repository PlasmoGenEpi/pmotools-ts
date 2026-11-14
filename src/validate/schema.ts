/**
 * JSON Schema validation of PMO data, with the same verdicts as
 * pmotools-python's `PMOChecker.validate_pmo_json`.
 *
 * The validators are generated ahead of time by scripts/build-validators.mjs
 * (Ajv standalone code), so nothing is compiled at run time.
 */
import { PmoError } from "../errors.js";
import type { PortableMicrohaplotypeObject } from "../types/pmo.js";
import * as v1_0_0 from "./generated/pmo_v1_0_0.js";
import * as v1_1_0 from "./generated/pmo_v1_1_0.js";
import { formatPath, resolvePointer, type PathSegment } from "./path.js";
import type { StandaloneError, StandaloneValidator } from "./standalone.js";

/** The PMO JSON Schema versions bundled with pmotools-ts, oldest first. */
export const SCHEMA_VERSIONS = ["1.0.0", "1.1.0"] as const;

/** A bundled PMO JSON Schema version. */
export type SchemaVersion = (typeof SCHEMA_VERSIONS)[number];

/**
 * The schema used when the caller names none. Like pmotools-python
 * (`__schema_version__`), this is the newest schema, whatever version the
 * file itself declares.
 */
export const DEFAULT_SCHEMA_VERSION: SchemaVersion = "1.1.0";

interface GeneratedModule {
  readonly validate: StandaloneValidator;
  readonly patterns: Readonly<Record<string, string>>;
}

const GENERATED: Readonly<Record<SchemaVersion, GeneratedModule>> = {
  "1.0.0": v1_0_0,
  "1.1.0": v1_1_0,
};

/** Whether `value` names a bundled schema version. */
export function isSchemaVersion(value: unknown): value is SchemaVersion {
  return typeof value === "string" && (SCHEMA_VERSIONS as readonly string[]).includes(value);
}

/** One reason the data does not match the schema. */
export interface SchemaValidationError {
  /** A sentence for people, naming the location. Wording may change. */
  readonly message: string;
  /** The schema keyword that failed: `type`, `required`, `pattern`, `minimum`, `anyOf`. */
  readonly keyword: string;
  /** Location in the data, as keys and array indexes. `[]` is the root. */
  readonly path: readonly PathSegment[];
  /** Location in the data as a JSON Pointer, e.g. `/specimen_info/0/specimen_name`. */
  readonly instancePath: string;
  /** Location in the schema, e.g. `#/$defs/SpecimenInfo/properties/specimen_name/pattern`. */
  readonly schemaPath: string;
  /** The offending value: for `required`, the object missing the property. */
  readonly value: unknown;
  /** Keyword detail, e.g. `{ missingProperty }`, `{ type }`, or `{ pattern }` (the schema's own pattern). */
  readonly params: Readonly<Record<string, unknown>>;
}

/** Options for {@link validatePmo}. */
export interface ValidatePmoOptions {
  /** Schema to validate against. Default {@link DEFAULT_SCHEMA_VERSION}. */
  readonly schemaVersion?: SchemaVersion;
  /** Most errors to return; `errorCount` still counts all of them. Default 100. */
  readonly maxErrors?: number;
}

/** What {@link validatePmo} returns. */
export type ValidatePmoResult =
  | {
      readonly valid: true;
      readonly schemaVersion: SchemaVersion;
      /** The input, now typed. Not copied. */
      readonly pmo: PortableMicrohaplotypeObject;
    }
  | {
      readonly valid: false;
      readonly schemaVersion: SchemaVersion;
      /** At most `maxErrors` errors, in the order the validator found them. */
      readonly errors: readonly SchemaValidationError[];
      /** All errors found, including those past `maxErrors`. */
      readonly errorCount: number;
    };

function runValidator(
  validator: StandaloneValidator,
  data: unknown,
): data is PortableMicrohaplotypeObject {
  return validator(data);
}

/**
 * Validates parsed JSON against a bundled PMO JSON Schema.
 *
 * Accepts and rejects exactly what pmotools-python's
 * `PMOChecker.validate_pmo_json` (jsonschema) does for the same schema; the
 * schema patterns were translated from Python regex semantics at build time.
 * Throws a {@link PmoError} with code `validate/unknown-schema-version` if
 * `schemaVersion` is not bundled.
 *
 * @example
 * const result = validatePmo(JSON.parse(text));
 * if (result.valid) use(result.pmo);
 * else for (const e of result.errors) console.log(e.message);
 */
export function validatePmo(data: unknown, options: ValidatePmoOptions = {}): ValidatePmoResult {
  const schemaVersion = options.schemaVersion ?? DEFAULT_SCHEMA_VERSION;
  if (!isSchemaVersion(schemaVersion)) {
    throw new PmoError(
      "validate/unknown-schema-version",
      `No bundled PMO schema for version ${JSON.stringify(schemaVersion)}; available: ${SCHEMA_VERSIONS.join(", ")}`,
      { schemaVersion, available: SCHEMA_VERSIONS },
    );
  }
  const generated = GENERATED[schemaVersion];
  if (runValidator(generated.validate, data)) return { valid: true, schemaVersion, pmo: data };

  const raw = dropAnyOfNoise(generated.validate.errors ?? []);
  const maxErrors = Math.max(0, options.maxErrors ?? 100);
  const errors = raw
    .slice(0, maxErrors)
    .map((error) => toValidationError(error, data, generated.patterns));
  return { valid: false, schemaVersion, errors, errorCount: raw.length };
}

/**
 * Every optional object in the schema is `anyOf: [{$ref}, {type: null}]`, so a
 * bad object reports its real errors plus "is not null" and "matches no
 * branch". Drop the null-branch error always (the value failed because it is
 * not null), and the `anyOf` error when a more specific error explains it.
 */
function dropAnyOfNoise(errors: readonly StandaloneError[]): StandaloneError[] {
  const isNullBranch = (e: StandaloneError) =>
    e.keyword === "type" && e.params["type"] === "null" && /\/anyOf\/\d+\/type$/.test(e.schemaPath);
  const kept = errors.filter((e) => !isNullBranch(e));
  const explained = new Set<string>();
  for (const e of kept) {
    if (e.keyword === "anyOf") continue;
    let pointer = e.instancePath;
    for (;;) {
      if (explained.has(pointer)) break;
      explained.add(pointer);
      if (pointer === "") break;
      pointer = pointer.slice(0, pointer.lastIndexOf("/"));
    }
  }
  return kept.filter((e) => e.keyword !== "anyOf" || !explained.has(e.instancePath));
}

function toValidationError(
  error: StandaloneError,
  data: unknown,
  patterns: Readonly<Record<string, string>>,
): SchemaValidationError {
  const { path, value } = resolvePointer(data, error.instancePath);
  let params = error.params;
  const where = formatPath(path);
  let message: string;
  switch (error.keyword) {
    case "required":
      message = `${where} is missing required property ${JSON.stringify(params["missingProperty"])}`;
      break;
    case "type": {
      const type = params["type"];
      const types = Array.isArray(type) ? type.join(" or ") : String(type);
      message = `${where} must be ${types}`;
      break;
    }
    case "pattern": {
      // Report the schema's own pattern, not the translated one.
      const original = patterns[error.schemaPath] ?? params["pattern"];
      params = { ...params, pattern: original };
      message = `${where} must match the pattern ${String(original)}`;
      break;
    }
    case "minimum":
      message = `${where} must be ${String(params["comparison"] ?? ">=")} ${String(params["limit"])}`;
      break;
    case "anyOf":
      message = `${where} matches none of the allowed forms`;
      break;
    default:
      message = `${where} fails schema keyword ${error.keyword}`;
  }
  return {
    message,
    keyword: error.keyword,
    path,
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    value,
    params,
  };
}
