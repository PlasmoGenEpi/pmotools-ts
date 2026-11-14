import { describe, expect, it } from "vitest";

import {
  librarySampleInfoTableToPmo,
  specimenInfoTableToPmo,
  type LibrarySampleInfoRecord,
  type SpecimenInfoRecord,
} from "../src/builders/metatable.js";
import { PmoError, collectWarnings, type WarningSink } from "../src/errors.js";
import type { Table } from "../src/table/core.js";
import { NAN_SENTINEL, camelizeKeys, loadCases, toRows, type OracleCase } from "./helpers/conformance.js";

type Builder = (table: Table, options: Record<string, unknown>) => unknown;

/**
 * Calls a builder with oracle inputs. The inputs are untyped JSON, and some
 * cases pass deliberately wrong types (a string instead of a table, a number
 * as a column option), so the call goes through `Reflect.apply` to reach the
 * runtime checks the way a JavaScript caller would.
 */
function runCase(builder: (...args: never[]) => unknown, oracle: OracleCase, onWarning: WarningSink): unknown {
  const { contents, ...kwargs } = oracle.kwargs;
  const recorded = oracle.tables["contents"];
  const table = recorded === undefined ? contents : toRows(recorded);
  const result: unknown = Reflect.apply(builder, undefined, [table, { ...camelizeKeys(kwargs), onWarning }]);
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Python's records with every field that is exactly `[""]` removed: the blank-list-cell divergence. */
function withoutBlankLists(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((record: unknown) =>
    isRecord(record)
      ? Object.fromEntries(
          Object.entries(record).filter(
            ([, field]) => !(Array.isArray(field) && field.length === 1 && field[0] === ""),
          ),
        )
      : record,
  );
}

/** Python's records with NaN densities dropped and NaN methods omitted: the missing-density divergence. */
function withoutNanDensities(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((record: unknown) => {
    if (!isRecord(record)) return record;
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(record)) {
      if (!key.endsWith("parasite_density_info") || !Array.isArray(field)) {
        out[key] = field;
        continue;
      }
      const infos = field
        .filter((info: unknown) => isRecord(info) && info["parasite_density"] !== NAN_SENTINEL)
        .map((info: unknown) =>
          isRecord(info)
            ? Object.fromEntries(Object.entries(info).filter(([, v]) => v !== NAN_SENTINEL))
            : info,
        );
      if (infos.length > 0) out[key] = infos;
    }
    return out;
  });
}

function okValue(oracle: OracleCase): unknown {
  if (oracle.result.kind !== "ok") throw new Error(`${oracle.id} has no recorded value`);
  return oracle.result.value;
}

/** Strict comparison: same values and same key order, after a JSON round trip. */
function expectSameJson(actual: unknown, expected: unknown): void {
  expect(JSON.parse(JSON.stringify(actual))).toEqual(expected);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
}

const SPECIMEN_DEFAULT_ROWS = [
  {
    specimen_name: "sample1",
    specimen_taxon_id: [5833],
    host_taxon_id: 9606,
    collection_date: "01/02/2023",
    collection_country: "Mozambique",
    project_name: "project1",
  },
  {
    specimen_name: "sample2",
    specimen_taxon_id: [5833],
    host_taxon_id: 9606,
    collection_date: "01/02/2023",
    collection_country: "Ghana",
    project_name: "project2",
  },
];

/** Python's records with text in numeric fields parsed: the numeric-text divergence. */
function withParsedNumbers(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  const parse = (field: unknown): unknown => (typeof field === "string" ? Number(field.trim()) : field);
  return value.map((record: unknown) => {
    if (!isRecord(record)) return record;
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(record)) {
      if (key === "specimen_taxon_id" && Array.isArray(field)) out[key] = field.map(parse);
      else if (["host_taxon_id", "gravidity", "host_age"].includes(key)) out[key] = parse(field);
      else if (key.endsWith("parasite_density_info") && Array.isArray(field)) {
        out[key] = field.map((info: unknown) =>
          isRecord(info) ? { ...info, parasite_density: parse(info["parasite_density"]) } : info,
        );
      } else out[key] = field;
    }
    return out;
  });
}

function numericTextDivergence(oracle: OracleCase, actual: () => unknown): void {
  const expected = withParsedNumbers(okValue(oracle));
  expect(expected).not.toEqual(okValue(oracle));
  expectSameJson(actual(), expected);
}

/** Asserts the builder throws a numeric-field error with exactly these details. */
function numericError(code: string, details: Record<string, unknown>) {
  return (_oracle: OracleCase, actual: () => unknown): void => {
    let thrown: unknown;
    try {
      actual();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(PmoError);
    if (thrown instanceof PmoError) {
      expect(thrown.code).toBe(code);
      expect(thrown.details).toEqual(details);
    }
  };
}

/** What pmotools-ts returns for each case marked as a divergence. */
const DIVERGENCES: Record<string, (oracle: OracleCase, actual: () => unknown) => void> = {
  "metatable/specimen/all_columns": numericTextDivergence,
  "metatable/specimen/list_values_types": numericTextDivergence,
  "metatable/specimen/numeric_fields_as_text": numericTextDivergence,
  "metatable/specimen/taxon_id_multiple": (oracle, actual) => {
    numericTextDivergence(oracle, actual);
    expect(actual()).toMatchObject([
      { specimen_taxon_id: [5833] },
      { specimen_taxon_id: [5833, 5855] },
      { specimen_taxon_id: [5855, 5833] },
    ]);
  },
  "metatable/specimen/taxon_id_invalid": numericError("metatable/invalid-taxon-id", {
    column: "specimen_taxon_id",
    field: "specimen_taxon_id",
    value: "5833;5855",
    row: 1,
  }),
  "metatable/specimen/numeric_field_invalid": numericError("metatable/invalid-number", {
    column: "host_age",
    field: "host_age",
    value: "unknown",
    row: 0,
  }),
  "metatable/specimen/storage_plate_col_not_numeric": numericError("metatable/invalid-integer", {
    column: "c",
    field: "plate_col",
    value: "x",
    row: 0,
  }),
  "metatable/specimen/density_string": numericError("metatable/invalid-number", {
    column: "d",
    field: "parasite_density",
    value: "n/a",
    row: 1,
  }),
  "metatable/library/numeric_fields_as_text": numericError("metatable/invalid-number", {
    column: "d",
    field: "parasite_density",
    value: "not measured",
    row: 1,
  }),
  "metatable/specimen/specimen_fields": blankListDivergence,
  "metatable/specimen/other_optional_fields": blankListDivergence,
  "metatable/specimen/list_values_blank": blankListDivergence,
  "metatable/specimen/list_values_custom": blankListDivergence,
  "metatable/library/new_optional_fields": blankListDivergence,
  "metatable/library/removes_empty_optional_fields": blankListDivergence,
  "metatable/library/alternate_identifiers_blank": blankListDivergence,
  "metatable/specimen/density_nan": nanDensityDivergence,
  "metatable/specimen/density_method_nan": nanDensityDivergence,
  "metatable/library/density_nan": nanDensityDivergence,
  "metatable/specimen/datetime_column": (_oracle, actual) => {
    const records = actual();
    expect(records).toMatchObject([
      { collection_date: "2024-01-02T00:00:00" },
      { collection_date: "2023-12-31T00:00:00" },
    ]);
  },
  "metatable/specimen/list_values_none": (_oracle, actual) => {
    expect(actual()).toEqual(SPECIMEN_DEFAULT_ROWS.map((row) => ({ ...row, specimen_taxon_id: 5833 })));
  },
  "metatable/specimen/list_column_present_but_unselected": (_oracle, actual) => {
    expect(actual()).toEqual(SPECIMEN_DEFAULT_ROWS);
  },
  "metatable/specimen/numeric_names": (oracle, actual) => {
    expect(okValue(oracle)).toEqual([
      { specimen_name: 101, project_name: 7, host_subject_name: 5 },
      { specimen_name: 102, project_name: 7, host_subject_name: 6 },
    ]);
    expectSameJson(actual(), [
      { specimen_name: "101", project_name: "7", host_subject_name: 5 },
      { specimen_name: "102", project_name: "7", host_subject_name: 6 },
    ]);
  },
  "metatable/library/numeric_names": (_oracle, actual) => {
    expectSameJson(actual(), [
      { library_sample_name: "1", specimen_name: "10", panel_name: "4", sequencing_info_name: "3", run_accession: 5 },
      { library_sample_name: "2", specimen_name: "20", panel_name: "4", sequencing_info_name: "3", run_accession: 6 },
    ]);
  },
};

function blankListDivergence(oracle: OracleCase, actual: () => unknown): void {
  const expected = withoutBlankLists(okValue(oracle));
  expect(expected).not.toEqual(okValue(oracle));
  expectSameJson(actual(), expected);
}

function nanDensityDivergence(oracle: OracleCase, actual: () => unknown): void {
  const expected = withoutNanDensities(okValue(oracle));
  expect(expected).not.toEqual(okValue(oracle));
  expectSameJson(actual(), expected);
}

const SUITES: [string, Builder][] = [
  ["metatable/specimen", specimenInfoTableToPmo],
  ["metatable/library", librarySampleInfoTableToPmo],
];

for (const [directory, builder] of SUITES) {
  describe(`${directory} oracle cases`, () => {
    const cases = loadCases(directory);
    it("has cases", () => {
      expect(cases.length).toBeGreaterThan(30);
    });
    for (const oracle of cases) {
      it(oracle.id.slice(directory.length + 1), () => {
        const warnings: unknown[] = [];
        const actual = (): unknown => runCase(builder, oracle, (warning) => warnings.push(warning));
        const divergence = DIVERGENCES[oracle.id];
        if (oracle.divergence !== null) {
          expect(divergence, `no TypeScript assertion for divergence ${oracle.id}`).toBeDefined();
          divergence?.(oracle, actual);
        } else {
          expect(divergence, `${oracle.id} is not marked as a divergence`).toBeUndefined();
          if (oracle.result.kind === "error") {
            expect(actual).toThrow(PmoError);
          } else {
            expectSameJson(actual(), oracle.result.value);
          }
        }
        expect(warnings).toHaveLength(oracle.warnings.length);
      });
    }
  });
}

describe("metatable builders", () => {
  it("does not mutate the input rows", () => {
    const rows = [
      { specimen_name: "s1", well: "a01", d: 1.5, list: "a,b" },
      { specimen_name: "s2", well: "H12", d: null, list: "" },
    ];
    const table: Table = Object.freeze(rows.map((row) => Object.freeze({ ...row })));
    const snapshot = structuredClone(rows);
    const result = specimenInfoTableToPmo(table, {
      storagePlatePositionCol: "well",
      parasiteDensityCol: "d",
      alternateIdentifiersCol: "list",
    });
    expect(table).toEqual(snapshot);
    expect(result).toEqual([
      {
        specimen_name: "s1",
        alternate_identifiers: ["a", "b"],
        parasite_density_info: [{ parasite_density: 1.5 }],
        storage_plate_info: { plate_row: "A", plate_col: 1 },
      },
      { specimen_name: "s2", storage_plate_info: { plate_row: "H", plate_col: 12 } },
    ]);
  });

  it("gives stable error codes", () => {
    const code = (run: () => unknown): string | undefined => {
      try {
        run();
      } catch (error) {
        if (error instanceof PmoError) return error.code;
        throw error;
      }
      return undefined;
    };
    const table: Table = [{ specimen_name: "s1", p: "Z9", r: "A", c: 1 }];
    expect(code(() => specimenInfoTableToPmo(table, { hostAgeCol: "age" }))).toBe("metatable/missing-columns");
    expect(code(() => specimenInfoTableToPmo(table, { hostAgeCol: "p", latLonCol: "p" }))).toBe(
      "metatable/duplicate-selected-columns",
    );
    expect(code(() => specimenInfoTableToPmo([{ specimen_name: null }]))).toBe("metatable/null-values");
    expect(code(() => specimenInfoTableToPmo(table, { storagePlatePositionCol: "p" }))).toBe(
      "metatable/invalid-plate-position",
    );
    expect(code(() => specimenInfoTableToPmo(table, { storagePlateRowCol: "r" }))).toBe(
      "metatable/plate-row-col-mismatch",
    );
    expect(
      code(() =>
        specimenInfoTableToPmo(table, { storagePlatePositionCol: "p", storagePlateRowCol: "r", storagePlateColCol: "c" }),
      ),
    ).toBe("metatable/plate-position-conflict");
    expect(code(() => specimenInfoTableToPmo(table, { parasiteDensityMethodCol: "r" }))).toBe(
      "metatable/density-method-without-density",
    );
    expect(code(() => specimenInfoTableToPmo(table, { parasiteDensityCol: ["c"], parasiteDensityMethodCol: [] }))).toBe(
      "metatable/density-method-length-mismatch",
    );
    expect(
      code(() =>
        librarySampleInfoTableToPmo([{ library_sample_name: "l1" }], {
          specimenNameCol: null,
          panelNameCol: null,
          runAccessionCol: "library_sample_name",
        }),
      ),
    ).toBe("metatable/missing-name-field");
    expect(code(() => specimenInfoTableToPmo(table, { listValuesSpecimenValuesDelimiter: "" }))).toBeUndefined();
    expect(
      code(() =>
        specimenInfoTableToPmo(table, { alternateIdentifiersCol: "p", listValuesSpecimenValuesDelimiter: "" }),
      ),
    ).toBe("metatable/empty-delimiter");
  });

  it("writes taxon IDs and other numeric fields from text as numbers", () => {
    const run = (cell: unknown, options: Record<string, unknown> = {}): unknown =>
      Reflect.apply(specimenInfoTableToPmo, undefined, [
        [{ specimen_name: "s1", t: cell }],
        { specimenTaxonIdCol: "t", ...options },
      ]);
    expect(run(5833)).toEqual([{ specimen_name: "s1", specimen_taxon_id: [5833] }]);
    expect(run("5833")).toEqual([{ specimen_name: "s1", specimen_taxon_id: [5833] }]);
    expect(run("5_833, 36329")).toEqual([{ specimen_name: "s1", specimen_taxon_id: [5833, 36329] }]);
    expect(run("5833|5855", { listValuesSpecimenValuesDelimiter: "|" })).toEqual([
      { specimen_name: "s1", specimen_taxon_id: [5833, 5855] },
    ]);
    // Without listification the scalar is still parsed.
    expect(run("5833", { listValuesSpecimenValues: [] })).toEqual([{ specimen_name: "s1", specimen_taxon_id: 5833 }]);
    const failure = (thunk: () => unknown): PmoError | undefined => {
      try {
        thunk();
      } catch (error) {
        if (error instanceof PmoError) return error;
        throw error;
      }
      return undefined;
    };
    for (const bad of ["5833,", "5833.0", "1e3", "Pf", "5833 5855"]) {
      expect(failure(() => run(bad))?.code, bad).toBe("metatable/invalid-taxon-id");
    }
    expect(failure(() => run("5833,abc"))?.details).toEqual({
      column: "t",
      field: "specimen_taxon_id",
      value: "abc",
      row: 0,
    });
    const table: Table = [{ specimen_name: "s1", host: " 9606 ", g: "2", age: ".25", d: "1_000.5" }];
    expect(
      specimenInfoTableToPmo(table, { hostTaxonIdCol: "host", gravidityCol: "g", hostAgeCol: "age", parasiteDensityCol: "d" }),
    ).toEqual([
      { specimen_name: "s1", host_taxon_id: 9606, gravidity: 2, host_age: 0.25, parasite_density_info: [{ parasite_density: 1000.5 }] },
    ]);
    expect(failure(() => specimenInfoTableToPmo(table, { gravidityCol: "age" }))?.code).toBe("metatable/invalid-integer");
    expect(failure(() => specimenInfoTableToPmo([{ specimen_name: "s1", a: "inf" }], { hostAgeCol: "a" }))?.code).toBe(
      "metatable/invalid-number",
    );
    expect(
      failure(() =>
        librarySampleInfoTableToPmo([{ library_sample_name: "l1", r: "A", c: "one" }], {
          specimenNameCol: null,
          panelNameCol: null,
          libraryPrepPlateRowCol: "r",
          libraryPrepPlateColCol: "c",
        }),
      )?.details,
    ).toEqual({ column: "c", field: "plate_col", value: "one", row: 0 });
  });

  it("returns typed records", () => {
    const specimens: SpecimenInfoRecord[] = specimenInfoTableToPmo([{ specimen_name: 7, project_name: "p" }], {
      projectNameCol: "project_name",
    });
    const libraries: LibrarySampleInfoRecord[] = librarySampleInfoTableToPmo([
      { library_sample_name: "l1", specimen_name: "s1", panel_name: "p1" },
    ]);
    expect(specimens[0]?.specimen_name).toBe("7");
    expect(libraries[0]?.panel_name).toBe("p1");
  });

  it("emits no warnings", () => {
    const { warnings } = collectWarnings((onWarning) =>
      specimenInfoTableToPmo([{ specimen_name: "s1" }], { onWarning }),
    );
    expect(warnings).toEqual([]);
  });
});
