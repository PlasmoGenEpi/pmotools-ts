/**
 * PMO validation: JSON Schema validation that agrees with pmotools-python,
 * and reference-integrity checks that JSON Schema cannot express.
 */
export {
  DEFAULT_SCHEMA_VERSION,
  SCHEMA_VERSIONS,
  isSchemaVersion,
  validatePmo,
  type SchemaValidationError,
  type SchemaVersion,
  type ValidatePmoOptions,
  type ValidatePmoResult,
} from "./schema.js";
export { readPmoVersion, schemaVersionForPmoVersion, type DeclaredPmoVersion } from "./version.js";
export {
  checkPmoIntegrity,
  type CheckPmoIntegrityOptions,
  type IntegrityCode,
  type IntegrityIssue,
  type IntegritySeverity,
} from "./integrity.js";
export { formatPath, type PathSegment } from "./path.js";
