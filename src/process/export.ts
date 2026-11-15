/**
 * Flat tables from a PMO: one per section, and the allele table. Ports
 * pmotools-python's `PMOExporter`.
 *
 * Fields holding a primitive go in as they are; lists of primitives are
 * joined with `separator` (`,` by default); objects (travel records,
 * parasite densities, plate positions) are left out, except where a function
 * says otherwise. References by index are written as the name they point to.
 */
import { PmoError } from "../errors.js";
import { getBioinformaticsRunNames, indexesOfNames, getSpecimenNames } from "./names.js";
import {
  exportCell,
  exportFields,
  priorityThenSorted,
  tableFromRecords,
  type ColumnTable,
  type PmoData,
  type RowRecord,
  type TableCell,
} from "./table.js";

/** Options for the section exporters. */
export interface ExportOptions {
  /** Joins the items of a list field. Default `,`. */
  readonly separator?: string;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function missingSection(section: string): PmoError {
  return new PmoError("process/missing-section", `The PMO has no ${section}.`, { section });
}

/** One row per specimen. `project_id` becomes `project_name` when the PMO has `project_info`. */
export function exportSpecimenMetaTable(pmo: PmoData, options: ExportOptions = {}): ColumnTable {
  const separator = options.separator ?? ",";
  const projects = pmo.project_info;
  return tableFromRecords(
    pmo.specimen_info.map((specimen) => {
      const row: RowRecord = new Map();
      for (const [key, value] of Object.entries(specimen)) {
        if (key === "project_id" && "project_info" in pmo && typeof value === "number") {
          row.set("project_name", projects?.[value]?.project_name ?? null);
        } else {
          const cell = exportCell(value, separator);
          if (cell !== undefined) row.set(key, cell);
        }
      }
      return row;
    }),
  );
}

/** One row per travel record, starting with the specimen's name. */
export function exportSpecimenTravelMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  const separator = options.separator ?? ",";
  return tableFromRecords(
    pmo.specimen_info.flatMap((specimen) =>
      (specimen.travel_out_six_month ?? []).map((travel) =>
        exportFields(travel, separator, new Map([["specimen_name", specimen.specimen_name]])),
      ),
    ),
  );
}

/**
 * One row per library sample. `specimen_id` and `panel_id` become
 * `specimen_name` and `panel_name`; `sequencing_info_id` becomes
 * `sequencing_info_name` when the PMO has `sequencing_info`.
 */
export function exportLibrarySampleMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  const separator = options.separator ?? ",";
  return tableFromRecords(
    pmo.library_sample_info.map((library) => {
      const row: RowRecord = new Map();
      for (const [key, value] of Object.entries(library)) {
        if (key === "sequencing_info_id" && "sequencing_info" in pmo && typeof value === "number") {
          row.set("sequencing_info_name", pmo.sequencing_info?.[value]?.sequencing_info_name ?? null);
        } else if (key === "specimen_id" && typeof value === "number") {
          row.set("specimen_name", pmo.specimen_info[value]?.specimen_name ?? null);
        } else if (key === "panel_id" && typeof value === "number") {
          row.set("panel_name", pmo.panel_info[value]?.panel_name ?? null);
        } else {
          const cell = exportCell(value, separator);
          if (cell !== undefined) row.set(key, cell);
        }
      }
      return row;
    }),
  );
}

/** One row per bioinformatics run, with `run_id` (its index) first. Throws a `PmoError` (`process/missing-section`) without `bioinformatics_run_info`. */
export function exportBioinformaticsRunInfoMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  if (!("bioinformatics_run_info" in pmo)) throw missingSection("bioinformatics_run_info");
  const separator = options.separator ?? ",";
  return tableFromRecords(
    (pmo.bioinformatics_run_info ?? []).map((run, index) =>
      exportFields(run, separator, new Map([["run_id", index]])),
    ),
  );
}

/**
 * One row per method of each set of bioinformatics methods, with
 * `bioinformatics_methods_id` and `method_id` counted from 1, as in
 * pmotools-python. Throws a `PmoError` (`process/missing-section`) without
 * `bioinformatics_methods_info`.
 */
export function exportBioinformaticsMethodsInfoMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  if (!("bioinformatics_methods_info" in pmo)) throw missingSection("bioinformatics_methods_info");
  const separator = options.separator ?? ",";
  const records: RowRecord[] = [];
  (pmo.bioinformatics_methods_info ?? []).forEach((info, infoIndex) => {
    const base: RowRecord = new Map();
    if (Object.keys(info).length > 0) base.set("bioinformatics_methods_id", infoIndex + 1);
    exportFields(info, separator, base);
    info.methods.forEach((method, methodIndex) => {
      const row: RowRecord = new Map(base);
      row.set("method_id", methodIndex + 1);
      for (const [key, value] of Object.entries(method)) {
        // pmotools-python copies the value as it is; a list is joined here
        // so that the table can be written to a file.
        const cell = exportCell(value, separator);
        row.set(key, cell === undefined ? JSON.stringify(value) : cell);
      }
      records.push(row);
    });
  });
  return tableFromRecords(records);
}

function simpleSection(
  pmo: PmoData,
  key: "sequencing_info" | "project_info",
  options: ExportOptions,
): ColumnTable {
  if (!(key in pmo)) throw missingSection(key);
  const separator = options.separator ?? ",";
  const list: readonly Readonly<Record<string, unknown>>[] = pmo[key] ?? [];
  return tableFromRecords(list.map((item) => exportFields(item, separator)));
}

/** One row per sequencing record. Throws a `PmoError` (`process/missing-section`) without `sequencing_info`. */
export function exportSequencingInfoMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  return simpleSection(pmo, "sequencing_info", options);
}

/** One row per project. Throws a `PmoError` (`process/missing-section`) without `project_info`. */
export function exportProjectInfoMetaTable(pmo: PmoData, options: ExportOptions = {}): ColumnTable {
  return simpleSection(pmo, "project_info", options);
}

/**
 * One row per target of each panel: the panel's fields, `target_name`, and
 * `reaction_name` (the reactions it is in, joined with `separator`).
 */
export function exportPanelInfoMetaTable(pmo: PmoData, options: ExportOptions = {}): ColumnTable {
  const separator = options.separator ?? ",";
  const records: RowRecord[] = [];
  for (const panel of pmo.panel_info) {
    const base = exportFields(panel, separator);
    const reactions = new Map<string, string[]>();
    for (const reaction of panel.reactions) {
      for (const id of reaction.panel_targets) {
        const name = pmo.target_info[id]?.target_name ?? String(id);
        const list = reactions.get(name);
        if (list === undefined) reactions.set(name, [reaction.reaction_name]);
        else list.push(reaction.reaction_name);
      }
    }
    for (const [target, names] of reactions) {
      const row: RowRecord = new Map(base);
      row.set("target_name", target);
      row.set("reaction_name", names.join(separator));
      records.push(row);
    }
  }
  return tableFromRecords(records);
}

/**
 * One row per target: its primers' sequences and locations
 * (`forward_primer_start` and so on), its insert location (`insert_chrom`
 * and so on), and its other fields. `target_name` and the primer sequences
 * come first, the rest in alphabetical order.
 */
export function exportTargetInfoMetaTable(pmo: PmoData, options: ExportOptions = {}): ColumnTable {
  const separator = options.separator ?? ",";
  const records = pmo.target_info.map((target) => {
    const row: RowRecord = new Map();
    for (const [key, value] of Object.entries(target)) {
      if ((key === "forward_primer" || key === "reverse_primer") && isRecord(value)) {
        row.set(`${key}_seq`, typeof value["seq"] === "string" ? value["seq"] : null);
        const location = value["location"];
        if (isRecord(location)) {
          for (const [part, item] of Object.entries(location)) {
            const cell = exportCell(item, separator);
            if (cell !== undefined) row.set(`${key}_${part}`, cell);
          }
        }
      } else if (key === "insert_location" && isRecord(value)) {
        for (const [part, item] of Object.entries(value)) {
          const cell = exportCell(item, separator);
          if (cell !== undefined) row.set(`insert_${part}`, cell);
        }
      } else {
        const cell = exportCell(value, separator);
        if (cell !== undefined) row.set(key, cell);
      }
    }
    return row;
  });
  return tableFromRecords(
    records,
    priorityThenSorted(["target_name", "forward_primer_seq", "reverse_primer_seq"]),
  );
}

/** The header in one row: `pmo_version` first, the generation method as two columns. */
export function exportPmoHeaderTable(pmo: PmoData, options: ExportOptions = {}): ColumnTable {
  const separator = options.separator ?? ",";
  const row: RowRecord = new Map();
  for (const [key, value] of Object.entries(pmo.pmo_header)) {
    if (key === "generation_method" && isRecord(value)) {
      row.set("generation_method.program_version", exportCell(value["program_version"], separator) ?? null);
      row.set("generation_method.program_name", exportCell(value["program_name"], separator) ?? null);
    } else {
      const cell = exportCell(value, separator);
      if (cell !== undefined) row.set(key, cell);
    }
  }
  return tableFromRecords([row], priorityThenSorted(["pmo_version"]));
}

/** One row per genome, with `genome_id` (its index). Throws a `PmoError` (`process/missing-section`) without `targeted_genomes`. */
export function exportTargetedGenomesMetaTable(
  pmo: PmoData,
  options: ExportOptions = {},
): ColumnTable {
  if (!("targeted_genomes" in pmo)) throw missingSection("targeted_genomes");
  const separator = options.separator ?? ",";
  return tableFromRecords(
    (pmo.targeted_genomes ?? []).map((genome, index) =>
      exportFields(genome, separator, new Map([["genome_id", index]])),
    ),
    priorityThenSorted(["name", "genome_version", "taxon_id", "genome_id", "url"]),
  );
}

/** Options for {@link extractAllelesPerSampleTable}. */
export interface AlleleTableOptions {
  /** `specimen_info` fields to add. Each must be present on at least one specimen. */
  readonly additionalSpecimenInfoFields?: readonly string[];
  /** `library_sample_info` fields to add. Each must be present on at least one library sample. */
  readonly additionalLibrarySampleInfoFields?: readonly string[];
  /** Fields of each detected microhaplotype to add, such as `reads` or `umis`. */
  readonly additionalMicrohapFields?: readonly string[];
  /** Fields of each representative microhaplotype to add, other than `seq`. */
  readonly additionalRepresentativeInfoFields?: readonly string[];
  /** Names of the library sample, target and sequence columns. Default `library_sample_name`, `target_name`, `seq`. */
  readonly defaultBaseColNames?: readonly string[];
}

function checkFields(
  fields: readonly string[] | undefined,
  records: Iterable<Readonly<Record<string, unknown>>>,
  section: string,
  except?: string,
): void {
  if (fields === undefined) return;
  const found = new Set<string>();
  for (const record of records) {
    for (const field of fields) if (field in record && field !== except) found.add(field);
  }
  const missing = fields.filter((field) => !found.has(field));
  if (missing.length > 0) {
    throw new PmoError(
      "process/fields-without-data",
      `No ${section} have data for ${missing.map((field) => `"${field}"`).join(", ")}.`,
      { section, fields: missing },
    );
  }
}

function fieldCell(record: Readonly<Record<string, unknown>>, field: string): TableCell {
  if (!(field in record)) return "NA";
  return exportCell(record[field], ",") ?? JSON.stringify(record[field]);
}

/**
 * The allele table: one row per detected microhaplotype, with the library
 * sample's name, the target's name, the microhaplotype's sequence, and
 * `bioinformatics_run_name` (or `detected_microhaplotypes_count_idx_<n>` when
 * the PMO names no runs). Extra fields come after, `"NA"` where a record
 * lacks one.
 *
 * Throws a `PmoError` (`process/fields-without-data`) for an extra field no
 * record has, and (`process/base-columns`) unless there are three base
 * column names.
 */
export function extractAllelesPerSampleTable(
  pmo: PmoData,
  options: AlleleTableOptions = {},
): ColumnTable {
  checkFields(options.additionalSpecimenInfoFields, pmo.specimen_info, "specimen_info");
  checkFields(
    options.additionalLibrarySampleInfoFields,
    pmo.library_sample_info,
    "library_sample_info",
  );
  checkFields(
    options.additionalMicrohapFields,
    pmo.detected_microhaplotypes.flatMap((run) =>
      run.library_samples.flatMap((sample) =>
        sample.target_results.flatMap((result) => result.mhaps),
      ),
    ),
    "detected_microhaplotypes",
  );
  checkFields(
    options.additionalRepresentativeInfoFields,
    pmo.representative_microhaplotypes.targets.flatMap((target) => target.microhaplotypes),
    "representative_microhaplotypes",
    "seq",
  );
  const base = options.defaultBaseColNames ?? ["library_sample_name", "target_name", "seq"];
  const [sampleColumn, targetColumn, seqColumn] = base;
  if (
    base.length !== 3 ||
    sampleColumn === undefined ||
    targetColumn === undefined ||
    seqColumn === undefined
  ) {
    throw new PmoError(
      "process/base-columns",
      `Give three base column names, not ${base.length}.`,
      { count: base.length },
    );
  }

  const runNames = "bioinformatics_run_info" in pmo ? getBioinformaticsRunNames(pmo) : null;
  const representative = pmo.representative_microhaplotypes.targets;
  const records: RowRecord[] = [];
  pmo.detected_microhaplotypes.forEach((run, runIndex) => {
    const runIdValue = "bioinformatics_run_id" in run ? (run.bioinformatics_run_id ?? null) : null;
    for (const sample of run.library_samples) {
      const library = pmo.library_sample_info[sample.library_sample_id];
      const specimen = library === undefined ? undefined : pmo.specimen_info[library.specimen_id];
      for (const result of sample.target_results) {
        const rep = representative[result.mhaps_target_id];
        const targetName = rep === undefined ? null : (pmo.target_info[rep.target_id]?.target_name ?? null);
        for (const mhap of result.mhaps) {
          const repMhap = rep?.microhaplotypes[mhap.mhap_id];
          const row: RowRecord = new Map<string, TableCell>([
            [sampleColumn, library?.library_sample_name ?? null],
            [targetColumn, targetName],
            [seqColumn, repMhap?.seq ?? null],
          ]);
          row.set(
            "bioinformatics_run_name",
            runNames !== null && runIdValue !== null
              ? (runNames[runIdValue] ?? null)
              : `detected_microhaplotypes_count_idx_${runIndex}`,
          );
          for (const field of options.additionalLibrarySampleInfoFields ?? [])
            row.set(field, fieldCell(library ?? {}, field));
          for (const field of options.additionalSpecimenInfoFields ?? [])
            row.set(field, fieldCell(specimen ?? {}, field));
          for (const field of options.additionalMicrohapFields ?? [])
            row.set(field, fieldCell(mhap, field));
          for (const field of options.additionalRepresentativeInfoFields ?? [])
            row.set(field, fieldCell(repMhap ?? {}, field));
          records.push(row);
        }
      }
    }
  });
  return tableFromRecords(records);
}

/** Which specimens {@link listLibrarySampleNamesPerSpecimenName} lists. Give at most one. */
export interface LibrarySamplesPerSpecimenOptions {
  readonly selectSpecimenIds?: readonly number[];
  readonly selectSpecimenNames?: readonly string[];
}

/**
 * One row per library sample of each specimen: `specimen_name`,
 * `library_sample_name`, and `library_sample_count` (how many the specimen
 * has). Specimens with no library sample are not listed.
 */
export function listLibrarySampleNamesPerSpecimenName(
  pmo: PmoData,
  options: LibrarySamplesPerSpecimenOptions = {},
): ColumnTable {
  if (options.selectSpecimenIds !== undefined && options.selectSpecimenNames !== undefined) {
    throw new PmoError(
      "process/select-specimens",
      "Choose specimens by id or by name, not both.",
    );
  }
  const ids =
    options.selectSpecimenNames !== undefined
      ? indexesOfNames(getSpecimenNames(pmo), options.selectSpecimenNames, "specimen")
      : options.selectSpecimenIds;
  const chosen = ids === undefined ? null : new Set(ids);
  const bySpecimen = new Map<string, string[]>();
  for (const library of pmo.library_sample_info) {
    if (chosen !== null && !chosen.has(library.specimen_id)) continue;
    const name = pmo.specimen_info[library.specimen_id]?.specimen_name ?? String(library.specimen_id);
    const list = bySpecimen.get(name);
    if (list === undefined) bySpecimen.set(name, [library.library_sample_name]);
    else list.push(library.library_sample_name);
  }
  return {
    columns: ["specimen_name", "library_sample_name", "library_sample_count"],
    rows: [...bySpecimen].flatMap(([specimen, libraries]) =>
      libraries.map((library): TableCell[] => [specimen, library, libraries.length]),
    ),
  };
}
