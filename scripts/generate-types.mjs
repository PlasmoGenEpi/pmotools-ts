// Regenerates src/types/pmo.ts from the vendored JSON Schema.
// Usage: node scripts/generate-types.mjs
import { writeFile } from "node:fs/promises";

import { compileFromFile } from "json-schema-to-typescript";

const SCHEMA = "schemas/portable_microhaplotype_object_v1.1.0.schema.json";
const OUTPUT = "src/types/pmo.ts";

const banner = `/**
 * PMO types for schema v1.1.0.
 *
 * Generated from ${SCHEMA} by scripts/generate-types.mjs. Do not edit by hand.
 * Every record allows extra keys because the schema does: builders copy
 * user-chosen "additional" columns into them.
 */`;

const source = await compileFromFile(SCHEMA, {
  bannerComment: banner,
  style: { printWidth: 100 },
});
await writeFile(OUTPUT, source);
console.log(`wrote ${OUTPUT}`);
