/**
 * Specimen and library-sample metadata builders.
 *
 * Port of `pmotools.pmo_builder.metatable_to_pmo`: `specimen_info_table_to_pmo`
 * and `library_sample_info_table_to_pmo`, with the helpers they use
 * (`pandas_table_to_json`, `add_plate_info`, `add_parasite_density_info`,
 * and the column checks).
 *
 * Both builders return records that still refer to other PMO sections by name
 * (`project_name`, `specimen_name`, `panel_name`, `sequencing_info_name`);
 * merging into a PMO replaces those names with indexes.
 *
 * How cell values are written, following Python:
 *
 * - Selected columns go through pandas `to_json`, so a missing cell becomes
 *   `""`, and non-integer numbers are rounded the way pandas' JSON encoder
 *   rounds them (10 decimal places, `1/3` becomes `0.3333333333`).
 * - Empty values (`""`, `[]`) are then removed from optional fields, but not
 *   from additional columns, where a missing cell stays `""`.
 * - Parasite density and plate values are read from the table directly, so
 *   they keep full precision.
 * - Dates are written as given. Rows cannot hold date objects, so pass dates
 *   as strings in the form they should appear, such as `"2024-01-02"`.
 *
 * Deliberate differences from pmotools-python v1.2.2:
 *
 * - Name fields are written as strings (`101` becomes `"101"`).
 * - A blank (missing or empty-string) cell in a list column is dropped rather
 *   than written as `[""]`, which fails the schema.
 * - A missing parasite density or method is omitted rather than written as
 *   `NaN`.
 * - A null list-columns option means no list columns (Python crashes), and a
 *   list field that the table has but the record lacks is skipped (Python
 *   raises `KeyError`).
 * - Text in a field the schema types as a number is parsed rather than written
 *   as a string, which fails the schema: `specimen_taxon_id` (each listed
 *   part), `host_taxon_id`, `gravidity` and `plate_col` the way Python's
 *   `int()` accepts text, `host_age` and `parasite_density` the way `float()`
 *   does. Text that does not parse throws `metatable/invalid-taxon-id`,
 *   `metatable/invalid-integer` or `metatable/invalid-number`. Cells that are
 *   already numbers are written as before.
 */

import { PmoError, type WarningOptions } from "../errors.js";
import {
  type Cell,
  type PandasDtype,
  type PresentCell,
  type Row,
  type Table,
  columnNames,
  isMissing,
  isPresent,
  pandasDtype,
} from "../table/core.js";

/** A scalar written into a metadata record. */
export type MetaScalar = string | number | boolean;

/** A metadata field value: a scalar, or a list for list-valued columns. */
export type MetaValue = MetaScalar | MetaScalar[];

/**
 * Plate location. Each key is present only when its cell is not blank, so a
 * record can hold a partial plate (the schema requires all three).
 */
export interface PlateInfoRecord {
  /** The plate name, as found in the table. */
  plate_name?: PresentCell;
  /** The row letter, trimmed and upper-cased. */
  plate_row?: string;
  /** The column number; kept as found when it is not an integer. */
  plate_col?: PresentCell;
}

/** One parasite density measurement. Values are copied from the table unchanged. */
export interface ParasiteDensityRecord {
  parasite_density: PresentCell;
  /** Present only when a method column is given and its cell is not missing. */
  parasite_density_method?: PresentCell;
}

/** Any value a metadata record can hold. */
export type MetadataRecordValue = MetaValue | PlateInfoRecord | ParasiteDensityRecord[];

/**
 * One `specimen_info` entry before merging. `project_name` is replaced by
 * `project_id` when the PMO is assembled. Other fields use their PMO names
 * (`host_taxon_id`, `collection_date`, ...); additional columns keep their
 * column names.
 */
export interface SpecimenInfoRecord {
  specimen_name: string;
  project_name?: string;
  specimen_taxon_id?: MetaValue;
  parasite_density_info?: ParasiteDensityRecord[];
  storage_plate_info?: PlateInfoRecord;
  [field: string]: MetadataRecordValue | undefined;
}

/**
 * One `library_sample_info` entry before merging. `specimen_name`,
 * `panel_name` and `sequencing_info_name` are replaced by indexes when the
 * PMO is assembled.
 */
export interface LibrarySampleInfoRecord {
  library_sample_name: string;
  specimen_name?: string;
  panel_name?: string;
  sequencing_info_name?: string;
  library_prep_plate_info?: PlateInfoRecord;
  qpcr_parasite_density_info?: ParasiteDensityRecord[];
  [field: string]: MetadataRecordValue | undefined;
}

/**
 * `details` of the `metatable/invalid-taxon-id`, `metatable/invalid-integer`
 * and `metatable/invalid-number` errors.
 */
export type InvalidNumericValueDetails = {
  /** The table column the value came from. */
  readonly column: string;
  /** The PMO field it was written to, such as `specimen_taxon_id` or `plate_col`. */
  readonly field: string;
  /** The text that could not be parsed: one part of a list cell, or the whole cell. */
  readonly value: string;
  /** Zero-based index of the row in the table. */
  readonly row: number;
};

/** A column option. `null` or omitted means the field is not written. */
export type ColumnOption = string | null | undefined;

/**
 * Parasite density or method columns: one column, or parallel lists of
 * columns for several measurements per row.
 */
export type DensityColumnsOption = string | readonly string[] | null | undefined;

/** Options for {@link specimenInfoTableToPmo}. Column options name a column of the table. */
export interface SpecimenInfoTableOptions extends WarningOptions {
  /** Default `"specimen_name"`. Required; must have no missing values. */
  readonly specimenNameCol?: string;
  /** NCBI taxon of the organism. Checked for missing values when set. Split into a list. */
  readonly specimenTaxonIdCol?: ColumnOption;
  /** NCBI taxon of the host. Checked for missing values when set. */
  readonly hostTaxonIdCol?: ColumnOption;
  /** Collection date, written as given; pass strings. Checked for missing values when set. */
  readonly collectionDateCol?: ColumnOption;
  /** Country of collection. Checked for missing values when set. */
  readonly collectionCountryCol?: ColumnOption;
  /** Project name, later linked to project_info. Checked for missing values when set. */
  readonly projectNameCol?: ColumnOption;
  /** Alternative names. Split into a list. */
  readonly alternateIdentifiersCol?: ColumnOption;
  readonly bloodMealCol?: ColumnOption;
  /** Drugs used. Split into a list. */
  readonly drugUsageCol?: ColumnOption;
  readonly envBroadScaleCol?: ColumnOption;
  readonly envLocalScaleCol?: ColumnOption;
  readonly envMediumCol?: ColumnOption;
  readonly geoAdmin1Col?: ColumnOption;
  readonly geoAdmin2Col?: ColumnOption;
  readonly geoAdmin3Col?: ColumnOption;
  readonly gravidCol?: ColumnOption;
  readonly gravidityCol?: ColumnOption;
  readonly hasTravelOutSixMonthCol?: ColumnOption;
  readonly hostAgeCol?: ColumnOption;
  readonly hostSexCol?: ColumnOption;
  readonly hostSubjectNameCol?: ColumnOption;
  readonly latLonCol?: ColumnOption;
  /** Parasite density column(s), written to `parasite_density_info`. */
  readonly parasiteDensityCol?: DensityColumnsOption;
  /** Method column(s); same shape as `parasiteDensityCol`, which must then be set. */
  readonly parasiteDensityMethodCol?: DensityColumnsOption;
  readonly specimenAccessionCol?: ColumnOption;
  /** Storage plate column number. Needs `storagePlateRowCol`. */
  readonly storagePlateColCol?: ColumnOption;
  readonly storagePlateNameCol?: ColumnOption;
  /** Storage plate row letter. Needs `storagePlateColCol`. */
  readonly storagePlateRowCol?: ColumnOption;
  /** Storage plate position such as `A01`; instead of row and column. */
  readonly storagePlatePositionCol?: ColumnOption;
  readonly specimenCollectDeviceCol?: ColumnOption;
  /** Comments. Split into a list. */
  readonly specimenCommentsCol?: ColumnOption;
  readonly specimenStoreLocCol?: ColumnOption;
  readonly specimenTypeCol?: ColumnOption;
  /** Treatment outcomes. Split into a list. */
  readonly treatmentStatusCol?: ColumnOption;
  /** More columns to copy under their own names. */
  readonly additionalSpecimenCols?: readonly string[] | null;
  /**
   * Output fields whose string values are split on the delimiter. Default
   * `alternate_identifiers`, `drug_usage`, `specimen_comments`,
   * `treatment_status`, `specimen_taxon_id`. `null` means none.
   */
  readonly listValuesSpecimenValues?: readonly string[] | null;
  /** Default `","`. */
  readonly listValuesSpecimenValuesDelimiter?: string;
}

/** Options for {@link librarySampleInfoTableToPmo}. Column options name a column of the table. */
export interface LibrarySampleInfoTableOptions extends WarningOptions {
  /** Default `"library_sample_name"`. Required; must have no missing values. */
  readonly librarySampleNameCol?: string;
  /** Default `"specimen_name"`; `null` to leave it out. Checked for missing values when set. */
  readonly specimenNameCol?: ColumnOption;
  /** Default `"panel_name"`; `null` to leave it out. Checked for missing values when set. */
  readonly panelNameCol?: ColumnOption;
  /** Checked for missing values when set. */
  readonly sequencingInfoNameCol?: ColumnOption;
  /** Alternative names. Split into a list. */
  readonly alternateIdentifiersCol?: ColumnOption;
  readonly experimentAccessionCol?: ColumnOption;
  readonly fastqsLocCol?: ColumnOption;
  readonly libraryPrepPlateNameCol?: ColumnOption;
  /** Needs `libraryPrepPlateRowCol`. */
  readonly libraryPrepPlateColCol?: ColumnOption;
  /** Needs `libraryPrepPlateColCol`. */
  readonly libraryPrepPlateRowCol?: ColumnOption;
  /** Plate position such as `A01`; instead of row and column. */
  readonly libraryPrepPlatePositionCol?: ColumnOption;
  /** Parasite density column(s), written to `qpcr_parasite_density_info`. */
  readonly parasiteDensityCol?: DensityColumnsOption;
  /** Method column(s); same shape as `parasiteDensityCol`, which must then be set. */
  readonly parasiteDensityMethodCol?: DensityColumnsOption;
  readonly runAccessionCol?: ColumnOption;
  /** More columns to copy under their own names. */
  readonly additionalLibrarySampleInfoCols?: readonly string[] | null;
  /** Output fields split on the delimiter. Default `alternate_identifiers`. `null` means none. */
  readonly listValuesLibraryValues?: readonly string[] | null;
  /** Default `","`. */
  readonly listValuesLibraryValuesDelimiter?: string;
}

const DEFAULT_SPECIMEN_LIST_VALUES = [
  "alternate_identifiers",
  "drug_usage",
  "specimen_comments",
  "treatment_status",
  "specimen_taxon_id",
] as const;

const DEFAULT_LIBRARY_LIST_VALUES = ["alternate_identifiers"] as const;

/** Specimen fields the schema types as integers or numbers. */
const SPECIMEN_NUMERIC_FIELDS: ReadonlyMap<string, NumericKind> = new Map([
  ["specimen_taxon_id", "taxon-id"],
  ["host_taxon_id", "taxon-id"],
  ["gravidity", "integer"],
  ["host_age", "number"],
]);

/**
 * Builds `specimen_info` records from a specimen table, one per row in table
 * order. Duplicate specimen names are not rejected; each duplicate gets the
 * plate and density values of the first row with that name, as in Python.
 *
 * @throws {PmoError} when selected columns repeat (`metatable/duplicate-selected-columns`),
 *   are absent (`metatable/missing-columns`), hold missing values where they are
 *   required or recommended (`metatable/null-values`), when plate or density options
 *   conflict, or when a plate position cannot be parsed. Text in a numeric field
 *   that does not parse throws `metatable/invalid-taxon-id` (`specimen_taxon_id`,
 *   `host_taxon_id`), `metatable/invalid-integer` (`gravidity`, `plate_col`) or
 *   `metatable/invalid-number` (`host_age`, `parasite_density`), with
 *   {@link InvalidNumericValueDetails}.
 */
export function specimenInfoTableToPmo(
  table: Table,
  options: SpecimenInfoTableOptions = {},
): SpecimenInfoRecord[] {
  const nameCol = options.specimenNameCol ?? "specimen_name";
  const o = options;
  const records = buildMetadata(table, {
    nameField: "specimen_name",
    nameCol,
    optional: [
      [o.specimenTaxonIdCol, "specimen_taxon_id"],
      [o.hostTaxonIdCol, "host_taxon_id"],
      [o.collectionDateCol, "collection_date"],
      [o.collectionCountryCol, "collection_country"],
      [o.projectNameCol, "project_name"],
      [o.alternateIdentifiersCol, "alternate_identifiers"],
      [o.drugUsageCol, "drug_usage"],
      [o.bloodMealCol, "blood_meal"],
      [o.gravidCol, "gravid"],
      [o.gravidityCol, "gravidity"],
      [o.hasTravelOutSixMonthCol, "has_travel_out_six_month"],
      [o.envBroadScaleCol, "env_broad_scale"],
      [o.envLocalScaleCol, "env_local_scale"],
      [o.envMediumCol, "env_medium"],
      [o.geoAdmin1Col, "geo_admin1"],
      [o.geoAdmin2Col, "geo_admin2"],
      [o.geoAdmin3Col, "geo_admin3"],
      [o.hostAgeCol, "host_age"],
      [o.hostSexCol, "host_sex"],
      [o.hostSubjectNameCol, "host_subject_name"],
      [o.latLonCol, "lat_lon"],
      [o.specimenAccessionCol, "specimen_accession"],
      [o.specimenTypeCol, "specimen_type"],
      [o.treatmentStatusCol, "treatment_status"],
      [o.specimenCollectDeviceCol, "specimen_collect_device"],
      [o.specimenCommentsCol, "specimen_comments"],
      [o.specimenStoreLocCol, "specimen_store_loc"],
    ],
    recommended: [
      o.specimenTaxonIdCol,
      o.hostTaxonIdCol,
      o.collectionDateCol,
      o.collectionCountryCol,
      o.projectNameCol,
    ],
    unique: [
      nameCol,
      o.specimenTaxonIdCol,
      o.hostTaxonIdCol,
      o.collectionDateCol,
      o.collectionCountryCol,
      o.projectNameCol,
      o.alternateIdentifiersCol,
      o.drugUsageCol,
      o.envBroadScaleCol,
      o.envLocalScaleCol,
      o.envMediumCol,
      o.geoAdmin1Col,
      o.geoAdmin2Col,
      o.geoAdmin3Col,
      o.hostAgeCol,
      o.hostSexCol,
      o.hostSubjectNameCol,
      o.latLonCol,
      o.specimenAccessionCol,
      o.specimenTypeCol,
      o.treatmentStatusCol,
      o.storagePlateColCol,
      o.storagePlateNameCol,
      o.storagePlateRowCol,
      o.storagePlatePositionCol,
      o.specimenCollectDeviceCol,
      o.specimenCommentsCol,
      o.specimenStoreLocCol,
      o.bloodMealCol,
      o.gravidCol,
      o.gravidityCol,
      o.hasTravelOutSixMonthCol,
    ],
    additional: o.additionalSpecimenCols,
    nameFields: ["specimen_name", "project_name"],
    plate: {
      colCol: o.storagePlateColCol,
      nameCol: o.storagePlateNameCol,
      rowCol: o.storagePlateRowCol,
      positionCol: o.storagePlatePositionCol,
      entry: "storage_plate_info",
    },
    density: {
      densityCol: o.parasiteDensityCol,
      methodCol: o.parasiteDensityMethodCol,
      entry: "parasite_density_info",
    },
    plateFirst: false,
    numericFields: SPECIMEN_NUMERIC_FIELDS,
    listValues:
      o.listValuesSpecimenValues === undefined ? DEFAULT_SPECIMEN_LIST_VALUES : (o.listValuesSpecimenValues ?? []),
    delimiter: o.listValuesSpecimenValuesDelimiter ?? ",",
  });
  return records.filter(isSpecimenInfoRecord);
}

/**
 * Builds `library_sample_info` records from a library sample table, one per
 * row in table order.
 *
 * @throws {PmoError} on the same conditions as {@link specimenInfoTableToPmo}.
 */
export function librarySampleInfoTableToPmo(
  table: Table,
  options: LibrarySampleInfoTableOptions = {},
): LibrarySampleInfoRecord[] {
  const o = options;
  const nameCol = o.librarySampleNameCol ?? "library_sample_name";
  const specimenNameCol = o.specimenNameCol === undefined ? "specimen_name" : o.specimenNameCol;
  const panelNameCol = o.panelNameCol === undefined ? "panel_name" : o.panelNameCol;
  const records = buildMetadata(table, {
    nameField: "library_sample_name",
    nameCol,
    optional: [
      [specimenNameCol, "specimen_name"],
      [panelNameCol, "panel_name"],
      [o.sequencingInfoNameCol, "sequencing_info_name"],
      [o.alternateIdentifiersCol, "alternate_identifiers"],
      [o.experimentAccessionCol, "experiment_accession"],
      [o.fastqsLocCol, "fastqs_loc"],
      [o.runAccessionCol, "run_accession"],
    ],
    recommended: [specimenNameCol, panelNameCol, o.sequencingInfoNameCol],
    unique: [
      nameCol,
      o.sequencingInfoNameCol,
      specimenNameCol,
      panelNameCol,
      o.alternateIdentifiersCol,
      o.experimentAccessionCol,
      o.fastqsLocCol,
    ],
    additional: o.additionalLibrarySampleInfoCols,
    nameFields: ["library_sample_name", "specimen_name", "panel_name", "sequencing_info_name"],
    plate: {
      colCol: o.libraryPrepPlateColCol,
      nameCol: o.libraryPrepPlateNameCol,
      rowCol: o.libraryPrepPlateRowCol,
      positionCol: o.libraryPrepPlatePositionCol,
      entry: "library_prep_plate_info",
    },
    density: {
      densityCol: o.parasiteDensityCol,
      methodCol: o.parasiteDensityMethodCol,
      entry: "qpcr_parasite_density_info",
    },
    plateFirst: true,
    numericFields: new Map(),
    listValues:
      o.listValuesLibraryValues === undefined ? DEFAULT_LIBRARY_LIST_VALUES : (o.listValuesLibraryValues ?? []),
    delimiter: o.listValuesLibraryValuesDelimiter ?? ",",
  });
  return records.filter(isLibrarySampleInfoRecord);
}

// ---------------------------------------------------------------------------
// Shared builder
// ---------------------------------------------------------------------------

type MutableRecord = Record<string, MetadataRecordValue>;

interface PlateSpec {
  readonly colCol: ColumnOption;
  readonly nameCol: ColumnOption;
  readonly rowCol: ColumnOption;
  readonly positionCol: ColumnOption;
  readonly entry: string;
}

interface DensitySpec {
  readonly densityCol: unknown;
  readonly methodCol: unknown;
  readonly entry: string;
}

interface BuildSpec {
  /** The PMO field that identifies a row: plate and density values are looked up by it. */
  readonly nameField: string;
  readonly nameCol: string;
  /** Optional column → field pairs, in Python's dict order. */
  readonly optional: readonly (readonly [ColumnOption, string])[];
  readonly recommended: readonly ColumnOption[];
  readonly unique: readonly ColumnOption[];
  readonly additional: readonly string[] | null | undefined;
  /** Fields that hold names and are written as strings. */
  readonly nameFields: readonly string[];
  readonly plate: PlateSpec;
  readonly density: DensitySpec;
  readonly plateFirst: boolean;
  readonly listValues: readonly string[];
  readonly delimiter: string;
  /** Fields the schema types as numbers, and how text in them is parsed. */
  readonly numericFields: ReadonlyMap<string, NumericKind>;
}

function isSet(column: ColumnOption): column is string {
  return column !== null && column !== undefined;
}

/** Python truthiness for a column option: set and not the empty string. */
function isTruthy(column: ColumnOption): column is string {
  return isSet(column) && column !== "";
}

function buildMetadata(table: Table, spec: BuildSpec): MutableRecord[] {
  if (!Array.isArray(table)) {
    throw new PmoError("metatable/not-a-table", "contents must be a table (an array of rows).");
  }

  // column_mapping: source column → PMO field, with Python dict semantics
  // (a repeated key keeps its first position and takes the last value).
  const mapping = new Map<string, string>([[spec.nameCol, spec.nameField]]);
  for (const [column, field] of spec.optional) {
    if (isSet(column)) mapping.set(column, field);
  }
  for (const column of spec.additional ?? []) mapping.set(column, column);

  // The fields Python strips empty values from: the values of a dict keyed by
  // the optional column options, where every unset option shares the key None.
  const optionalByColumn = new Map<string | null, string>();
  for (const [column, field] of spec.optional) optionalByColumn.set(isSet(column) ? column : null, field);
  const removable = new Set(optionalByColumn.values());

  checkUniqueColumns(spec.unique);
  const columns = columnNames(table);
  const hasRows = table.length > 0;
  // A table with no rows has no columns here, so its columns cannot be checked.
  if (hasRows) checkColumnsExist(columns, [...mapping.keys()]);

  const recommendedPresent = new Set(spec.recommended.filter((c): c is string => isSet(c) && mapping.has(c)));
  checkNullValues(table, [spec.nameCol, ...recommendedPresent]);

  // After `rename(columns=mapping)`, each column is known by its new name.
  const renamed = (column: string): string => mapping.get(column) ?? column;
  const sourcesOf = (name: string): string[] => columns.filter((column) => renamed(column) === name);

  const fieldSources: [field: string, source: string][] = [];
  for (const field of new Set(mapping.values())) {
    const sources = sourcesOf(field);
    if (sources.length > 1) {
      throw new PmoError(
        "metatable/duplicate-output-columns",
        `More than one column would be written as '${field}': ${sources.join(", ")}.`,
        { field, columns: sources },
      );
    }
    const source = sources[0];
    if (source !== undefined) fieldSources.push([field, source]);
  }

  const dtypes = new Map<string, PandasDtype>(
    fieldSources.map(([, source]) => [source, pandasDtype(table.map((row) => row[source]))]),
  );
  const nameFields = new Set(spec.nameFields);
  const records: MutableRecord[] = table.map((row) => {
    const record: MutableRecord = {};
    for (const [field, source] of fieldSources) {
      const cell = row[source];
      record[field] =
        nameFields.has(field) && isPresent(cell) ? String(cell) : toJsonCell(cell, dtypes.get(source) ?? "object");
    }
    return record;
  });

  /** Reads a column of the renamed table; a column that is not there is a KeyError in Python. */
  const lookup = (column: string): string => {
    const source = sourcesOf(column)[0];
    if (source === undefined) {
      throw new PmoError("metatable/missing-columns", `Column '${column}' is not in the table.`, {
        columns: [column],
      });
    }
    return source;
  };
  const rowFor = rowLookup(table, spec.nameField, lookup);
  const rowIndex = new Map<Row, number>();
  table.forEach((row, index) => {
    if (!rowIndex.has(row)) rowIndex.set(row, index);
  });
  const indexOf = (row: Row): number => rowIndex.get(row) ?? -1;

  if (spec.plateFirst) {
    addPlateInfo(spec.plate, table, records, lookup, rowFor, indexOf);
    addParasiteDensityInfo(spec.density, records, lookup, rowFor, indexOf);
  } else {
    addParasiteDensityInfo(spec.density, records, lookup, rowFor, indexOf);
    addPlateInfo(spec.plate, table, records, lookup, rowFor, indexOf);
  }

  const renamedColumns = new Set(columns.map(renamed));
  for (const field of spec.listValues) {
    if (!renamedColumns.has(field)) continue;
    for (const record of records) listify(record, field, spec.delimiter);
  }

  // Deliberate: Python writes text in numeric fields as strings, which fail the schema.
  for (const [field, source] of fieldSources) {
    const kind = spec.numericFields.get(field);
    if (kind === undefined) continue;
    records.forEach((record, row) => {
      const value = record[field];
      const at = { column: source, field, row };
      if (typeof value === "string") {
        // A blank cell is written as "" and removed below, as in Python.
        if (value !== "") record[field] = parseNumeric(value, kind, at);
      } else if (isScalarList(value)) {
        record[field] = value.map((part) => (typeof part === "string" ? parseNumeric(part, kind, at) : part));
      }
    });
  }

  for (const record of records) {
    for (const [key, value] of Object.entries(record)) {
      if (removable.has(key) && isEmptyValue(value)) delete record[key];
    }
  }
  return records;
}

function checkUniqueColumns(columns: readonly ColumnOption[]): void {
  const set = columns.filter(isSet);
  if (set.length !== new Set(set).size) {
    const repeated = [...new Set(set.filter((column, index) => set.indexOf(column) !== index))];
    throw new PmoError("metatable/duplicate-selected-columns", "Selected columns must be unique.", {
      columns: repeated,
    });
  }
}

function checkColumnsExist(present: readonly string[], wanted: readonly string[]): void {
  const have = new Set(present);
  const missing = wanted.filter((column) => !have.has(column));
  if (missing.length > 0) {
    throw new PmoError(
      "metatable/missing-columns",
      `The following columns are not in the table: ${missing.join(", ")}`,
      { columns: missing },
    );
  }
}

function checkNullValues(table: Table, columns: readonly string[]): void {
  const withNulls = columns.filter((column) => table.some((row) => isMissing(row[column])));
  if (withNulls.length > 0) {
    throw new PmoError(
      "metatable/null-values",
      `The following columns contain null values: ${withNulls.join(", ")}`,
      { columns: withNulls },
    );
  }
}

/**
 * Python finds a record's source row with `df[df[name] == record[name]]` and
 * takes the first match, so duplicate names share the first row's values.
 * Names are compared as strings here.
 */
function rowLookup(
  table: Table,
  nameField: string,
  lookup: (column: string) => string,
): (record: MutableRecord) => Row {
  let firstRowByName: Map<string, Row> | undefined;
  return (record) => {
    const name = record[nameField];
    if (name === undefined) {
      throw new PmoError("metatable/missing-name-field", `The records have no '${nameField}' field.`, {
        field: nameField,
      });
    }
    if (firstRowByName === undefined) {
      const source = lookup(nameField);
      firstRowByName = new Map();
      for (const row of table) {
        const key = nameKey(row[source]);
        if (!firstRowByName.has(key)) firstRowByName.set(key, row);
      }
    }
    const row = firstRowByName.get(nameKey(name));
    if (row === undefined) {
      throw new PmoError("metatable/missing-name-field", `No row has ${nameField} '${String(name)}'.`, {
        field: nameField,
      });
    }
    return row;
  };
}

function nameKey(value: unknown): string {
  return isMissing(value) ? "" : String(value);
}

// ---------------------------------------------------------------------------
// pandas_table_to_json
// ---------------------------------------------------------------------------

/**
 * One cell as `json.loads(df.to_json(orient="records"))` returns it, with
 * Python's object hook that turns `None` into `""`.
 */
function toJsonCell(cell: Cell, dtype: PandasDtype): MetaScalar {
  if (!isPresent(cell)) return "";
  if (typeof cell !== "number") return cell;
  return encodeNumber(cell, dtype) ?? "";
}

/**
 * A number as pandas' bundled ujson writes it with `double_precision=10`.
 * Infinities become null. Integers are exact unless the column is float64
 * and the value is past 1e16.
 */
function encodeNumber(value: number, dtype: PandasDtype): number | null {
  if (!Number.isFinite(value)) return null;
  if (Number.isInteger(value) && (dtype !== "float64" || Math.abs(value) <= 1e16)) return value === 0 ? 0 : value;
  return encodeDouble(value);
}

/**
 * pandas' `Buffer_AppendDoubleUnchecked`: values outside [1e-15, 1e16] go
 * through `%.10g`; the rest keep 10 decimals, rounding the fraction with its
 * own half-way rule.
 */
function encodeDouble(value: number): number {
  const negative = value < 0;
  const magnitude = Math.abs(value);
  const signed = (n: number): number => (negative && n !== 0 ? -n : n);
  if (magnitude > 1e16 || (magnitude !== 0 && magnitude < 1e-15)) {
    return signed(Number(magnitude.toPrecision(10)));
  }
  let whole = Math.trunc(magnitude);
  const scaled = (magnitude - whole) * 1e10;
  let fraction = Math.trunc(scaled);
  const remainder = scaled - fraction;
  if (remainder > 0.5) fraction += 1;
  else if (remainder === 0.5 && (fraction === 0 || fraction % 2 === 1)) fraction += 1;
  if (fraction >= 1e10) {
    fraction = 0;
    whole += 1;
  }
  return signed(Number(`${BigInt(whole).toString()}.${String(fraction).padStart(10, "0")}`));
}

// ---------------------------------------------------------------------------
// List columns and empty values
// ---------------------------------------------------------------------------

function listify(record: MutableRecord, field: string, delimiter: string): void {
  const value = record[field];
  if (value === undefined || Array.isArray(value)) return;
  if (typeof value === "string") {
    // Deliberate: Python writes [""] for a blank cell.
    if (value === "") {
      delete record[field];
      return;
    }
    if (delimiter === "") {
      throw new PmoError("metatable/empty-delimiter", "The list delimiter cannot be empty.", { field });
    }
    record[field] = value.split(delimiter);
    return;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    record[field] = [value];
    return;
  }
  throw new PmoError("metatable/invalid-list-value", `Column '${field}' must contain strings or lists of strings.`, {
    field,
  });
}

function isScalarList(value: MetadataRecordValue | undefined): value is MetaScalar[] {
  return Array.isArray(value) && value.every((part) => typeof part !== "object");
}

/** `remove_optional_null_values`: None, "", {}, [] and NaN are empty. */
function isEmptyValue(value: unknown): boolean {
  if (isMissing(value) || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && value !== null) return Object.keys(value).length === 0;
  return false;
}

// ---------------------------------------------------------------------------
// Numeric fields
// ---------------------------------------------------------------------------

/** How text in a numeric field is parsed: `int()` for the first two, `float()` for `number`. */
type NumericKind = "taxon-id" | "integer" | "number";

const NUMERIC_ERROR_CODES: Readonly<Record<NumericKind, string>> = {
  "taxon-id": "metatable/invalid-taxon-id",
  integer: "metatable/invalid-integer",
  number: "metatable/invalid-number",
};

const PYTHON_INT = /^\s*([+-]?)(\d+(?:_\d+)*)\s*$/;
const PYTHON_FLOAT = /^\s*([+-]?(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[eE][+-]?\d+(?:_\d+)*)?)\s*$/;

/** Text as Python's `int()` reads it (ASCII digits, optional sign, `_` separators), or `null`. */
function parsePythonInt(text: string): number | null {
  const match = PYTHON_INT.exec(text);
  const digits = match?.[2];
  if (digits === undefined) return null;
  const parsed = Number(digits.replaceAll("_", ""));
  return match?.[1] === "-" && parsed !== 0 ? -parsed : parsed;
}

/** Text as Python's `float()` reads it, or `null`. Infinities and NaN, which JSON cannot hold, are `null`. */
function parsePythonFloat(text: string): number | null {
  const literal = PYTHON_FLOAT.exec(text)?.[1];
  if (literal === undefined) return null;
  const parsed = Number(literal.replaceAll("_", ""));
  if (!Number.isFinite(parsed)) return null;
  return parsed === 0 ? 0 : parsed;
}

/** Parses text in a numeric field, or throws with the column, field, value and row. */
function parseNumeric(
  text: string,
  kind: NumericKind,
  at: { readonly column: string; readonly field: string; readonly row: number },
): number {
  const parsed = kind === "number" ? parsePythonFloat(text) : parsePythonInt(text);
  if (parsed !== null) return parsed;
  const details: InvalidNumericValueDetails = { column: at.column, field: at.field, value: text, row: at.row };
  const expected = kind === "number" ? "a number" : "a whole number";
  throw new PmoError(
    NUMERIC_ERROR_CODES[kind],
    `Column '${at.column}' (${at.field}) must hold ${expected}; row ${at.row} has '${text}'.`,
    details,
  );
}

// ---------------------------------------------------------------------------
// add_plate_info
// ---------------------------------------------------------------------------

const PLATE_POSITION = /^([A-H])0*([1-9]|1[0-2])$/i;

/** `_is_blank`: missing, or a string of only whitespace. */
function isBlank(value: unknown): boolean {
  if (isMissing(value)) return true;
  return typeof value === "string" && value.trim() === "";
}

function addPlateInfo(
  plate: PlateSpec,
  table: Table,
  records: MutableRecord[],
  lookup: (column: string) => string,
  rowFor: (record: MutableRecord) => Row,
  indexOf: (row: Row) => number,
): void {
  const { colCol, nameCol, rowCol, positionCol } = plate;
  if (!isSet(colCol) && !isSet(nameCol) && !isSet(rowCol) && !isSet(positionCol)) return;
  if (isSet(rowCol) !== isSet(colCol)) {
    throw new PmoError("metatable/plate-row-col-mismatch", "If either plate row or column is set, then both must be.", {
      rowCol,
      colCol,
    });
  }

  // Position mode: the row letter and column number parsed from each table row.
  let parsed: Map<Row, { row: string; col: number } | null> | undefined;
  if (isTruthy(positionCol)) {
    if (isTruthy(colCol)) {
      throw new PmoError(
        "metatable/plate-position-conflict",
        "Plate position can be specified using either row and col, or position, but not both.",
        { positionCol, rowCol, colCol },
      );
    }
    parsed = parsePlatePositions(table, positionCol, lookup);
  }
  if (records.length === 0) return;

  const dtypeOf = (source: string): PandasDtype => pandasDtype(table.map((row) => row[source]));
  const rowSource = !parsed && isTruthy(rowCol) ? lookup(rowCol) : undefined;
  const rowDtype = rowSource === undefined ? "object" : dtypeOf(rowSource);

  for (const record of records) {
    const tableRow = rowFor(record);
    const name: Cell = isTruthy(nameCol) ? tableRow[lookup(nameCol)] : null;
    let rowValue: Cell;
    let colValue: Cell;
    if (parsed) {
      const position = parsed.get(tableRow) ?? null;
      rowValue = position?.row ?? null;
      colValue = position?.col ?? null;
    } else {
      rowValue = rowSource === undefined ? null : tableRow[rowSource];
      colValue = isTruthy(colCol) ? tableRow[lookup(colCol)] : null;
    }

    const info: PlateInfoRecord = {};
    if (isPresent(name) && !isBlank(name)) info.plate_name = name;
    if (isPresent(rowValue) && !isBlank(rowValue)) {
      info.plate_row = pythonStr(rowValue, rowDtype).trim().toUpperCase();
    }
    if (isPresent(colValue) && !isBlank(colValue)) {
      const col = pythonInt(colValue);
      // Deliberate: Python keeps text int() cannot parse, which fails the schema.
      if (typeof col === "string" && isTruthy(colCol)) {
        info.plate_col = parseNumeric(col, "integer", { column: lookup(colCol), field: "plate_col", row: indexOf(tableRow) });
      } else if (col !== null) info.plate_col = col;
    }
    if (Object.keys(info).length > 0) record[plate.entry] = info;
  }
}

function parsePlatePositions(
  table: Table,
  positionCol: string,
  lookup: (column: string) => string,
): Map<Row, { row: string; col: number } | null> {
  const parsed = new Map<Row, { row: string; col: number } | null>();
  if (table.length === 0) return parsed;
  const source = lookup(positionCol);
  const invalid: Cell[] = [];
  for (const row of table) {
    const value = row[source];
    if (isBlank(value)) {
      parsed.set(row, null);
      continue;
    }
    const match = typeof value === "string" ? PLATE_POSITION.exec(value.trim()) : null;
    const letter = match?.[1];
    const number = match?.[2];
    if (letter === undefined || number === undefined) {
      invalid.push(value);
      continue;
    }
    parsed.set(row, { row: letter.toUpperCase(), col: Number(number) });
  }
  if (invalid.length > 0) {
    throw new PmoError(
      "metatable/invalid-plate-position",
      `Values in '${positionCol}' must start with a single letter A-H/a-h followed by number 1-12.`,
      { column: positionCol, values: invalid },
    );
  }
  return parsed;
}

/**
 * Python's `int(value)` where it succeeds, else the value unchanged.
 * `null` for values Python could not write (infinities).
 */
function pythonInt(value: PresentCell): PresentCell | null {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return Number.isFinite(value) ? Math.trunc(value) || 0 : null;
  return parsePythonInt(value) ?? value;
}

/** Python's `str(value)` for a cell, where a float64 column writes `1.0` for 1. */
function pythonStr(value: PresentCell, dtype: PandasDtype): string {
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "number" && dtype === "float64" && Number.isInteger(value) && Math.abs(value) < 1e16) {
    return `${value}.0`;
  }
  return String(value);
}

// ---------------------------------------------------------------------------
// add_parasite_density_info
// ---------------------------------------------------------------------------

function isStringOrList(value: unknown): value is string | readonly unknown[] {
  return typeof value === "string" || Array.isArray(value);
}

function densityMethodPairs(densityCol: unknown, methodCol: unknown): [unknown, unknown][] {
  const unset = (value: unknown): boolean => value === null || value === undefined;
  if (unset(densityCol) && unset(methodCol)) return [];
  if (Array.isArray(densityCol)) {
    const densities: readonly unknown[] = densityCol;
    if (unset(methodCol)) return densities.map((column) => [column, null]);
    if (Array.isArray(methodCol)) {
      const methods: readonly unknown[] = methodCol;
      if (densities.length !== methods.length) {
        throw new PmoError(
          "metatable/density-method-length-mismatch",
          "If both parasite_density_col and parasite_density_method_col are lists, they must be the same length.",
          { densityCol, methodCol },
        );
      }
      return densities.map((column, index) => [column, methods[index]]);
    }
    throw new PmoError(
      "metatable/density-method-type",
      "If parasite_density_col is a list, parasite_density_method_col must be a list or None.",
      { densityCol, methodCol },
    );
  }
  if (typeof densityCol === "string") {
    if (unset(methodCol) || typeof methodCol === "string") return [[densityCol, methodCol ?? null]];
    throw new PmoError(
      "metatable/density-method-type",
      "If parasite_density_col is a string, parasite_density_method_col must be a string or None.",
      { densityCol, methodCol },
    );
  }
  if (unset(densityCol)) {
    if (isStringOrList(methodCol)) {
      throw new PmoError(
        "metatable/density-method-without-density",
        "parasite_density_method_col is set but parasite_density_col is None.",
        { methodCol },
      );
    }
    return [];
  }
  throw new PmoError(
    "metatable/invalid-density-columns",
    "Invalid types for parasite_density_col and parasite_density_method_col.",
    { densityCol, methodCol },
  );
}

function addParasiteDensityInfo(
  density: DensitySpec,
  records: MutableRecord[],
  lookup: (column: string) => string,
  rowFor: (record: MutableRecord) => Row,
  indexOf: (row: Row) => number,
): void {
  const pairs = densityMethodPairs(density.densityCol, density.methodCol);
  const read = (row: Row, column: unknown): Cell => {
    if (typeof column !== "string" || column === "") return null;
    return row[lookup(column)];
  };
  // Python runs this loop, and its row lookup, even when there are no pairs.
  for (const record of records) {
    const row = rowFor(record);
    const infos: ParasiteDensityRecord[] = [];
    for (const [densityCol, methodCol] of pairs) {
      const value = read(row, densityCol);
      const method = read(row, methodCol);
      // Deliberate: Python keeps NaN here and writes it to the JSON.
      if (!isPresent(value)) continue;
      // Deliberate: Python writes text densities as strings, which fail the schema.
      const density =
        typeof value === "string" && typeof densityCol === "string"
          ? parseNumeric(value, "number", { column: lookup(densityCol), field: "parasite_density", row: indexOf(row) })
          : value;
      const info: ParasiteDensityRecord = { parasite_density: density };
      if (isPresent(method)) info.parasite_density_method = method;
      infos.push(info);
    }
    if (infos.length > 0) record[density.entry] = infos;
  }
}

// ---------------------------------------------------------------------------
// Record guards
// ---------------------------------------------------------------------------

function isSpecimenInfoRecord(record: MutableRecord): record is SpecimenInfoRecord & MutableRecord {
  return typeof record["specimen_name"] === "string";
}

function isLibrarySampleInfoRecord(record: MutableRecord): record is LibrarySampleInfoRecord & MutableRecord {
  return typeof record["library_sample_name"] === "string";
}
