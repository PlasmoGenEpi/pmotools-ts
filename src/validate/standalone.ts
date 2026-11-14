/**
 * Types for the validators that scripts/build-validators.mjs generates into
 * `./generated/`. The generated files are not type checked (`@ts-nocheck`);
 * these declarations are the contract they are annotated with.
 */

/** An error as Ajv's standalone code reports it (built with `messages: false`). */
export interface StandaloneError {
  /** JSON Pointer into the instance, `""` for the root. */
  readonly instancePath: string;
  /** JSON Pointer into the schema, e.g. `#/$defs/GenomicLocation/properties/chrom/pattern`. */
  readonly schemaPath: string;
  /** The schema keyword that failed: `type`, `required`, `pattern`, `minimum`, `anyOf`, ... */
  readonly keyword: string;
  /** Keyword-specific detail, e.g. `{ missingProperty }` or `{ type }`. */
  readonly params: Readonly<Record<string, unknown>>;
}

/** A generated validator: returns whether `data` is valid and leaves the errors on `.errors`. */
export interface StandaloneValidator {
  (data: unknown): boolean;
  errors?: StandaloneError[] | null;
}
