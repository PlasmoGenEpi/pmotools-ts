/**
 * pmotools-ts: build, validate, read and write Portable Microhaplotype Object
 * (PMO) files.
 *
 * The usual path from tables to a PMO file:
 *
 * 1. `inferColumnTypes` types the string cells a CSV parser gives you.
 * 2. A builder per table (`mhapTableToPmo`, `panelInfoTableToPmo`,
 *    `specimenInfoTableToPmo`, `librarySampleInfoTableToPmo`,
 *    `readCountByStageTableToPmo`) turns it into a fragment.
 * 3. `mergeToPmo` assembles the fragments into one PMO.
 * 4. `validatePmo` and `checkPmoIntegrity` check it.
 * 5. `stringifyPmo` or `gzipPmo` writes it out.
 */
export * from "./errors.js";

export type { Cell, PresentCell, Row, Table } from "./table/core.js";
export { isMissing, isPresent } from "./table/core.js";
export * from "./table/infer.js";

export * from "./builders/mhap.js";
export * from "./builders/panel.js";
export * from "./builders/metatable.js";
export * from "./builders/readCounts.js";

export { mergeToPmo, PMO_SCHEMA_VERSION, PMOTOOLS_TS_VERSION } from "./merge/index.js";
export type {
  IncompleteNameFieldsDetails,
  MergeParts,
  MergeToPmoOptions,
  MissingNameExample,
  MissingNameField,
  ReferenceKind,
} from "./merge/index.js";

export * from "./validate/index.js";
export * from "./io/pmo.js";

export type * from "./types/pmo.js";
