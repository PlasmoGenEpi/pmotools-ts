/**
 * Counts over a PMO, and choosing specimens by their metadata. Ports
 * `count_specimen_per_meta_fields`, `count_targets_per_panel`,
 * `count_specimen_by_field_value` and
 * `extract_from_pmo_samples_with_meta_groupings` of pmotools-python's
 * `PMOProcessor`.
 */
import { PmoError } from "../errors.js";
import { filterPmoBySpecimenIds } from "./filter.js";
import { getSpecimenNames, indexesOfNames } from "./names.js";
import {
  compareCodePoints,
  pythonStr,
  tableFromRecords,
  type ColumnTable,
  type PmoData,
  type RowRecord,
  type TableCell,
} from "./table.js";

/**
 * How many specimens have each `specimen_info` field. Columns `field`,
 * `present_in_specimens_count`, `total_specimen_count`; fields in the order
 * they first appear.
 */
export function countSpecimenPerMetaFields(pmo: PmoData): ColumnTable {
  const counts = new Map<string, number>();
  for (const specimen of pmo.specimen_info) {
    for (const field of Object.keys(specimen)) counts.set(field, (counts.get(field) ?? 0) + 1);
  }
  const total = pmo.specimen_info.length;
  return {
    columns: ["field", "present_in_specimens_count", "total_specimen_count"],
    rows: [...counts].map(([field, count]) => [field, count, total]),
  };
}

/** How many distinct targets each panel has. Columns `panel_name`, `panel_target_count`. */
export function countTargetsPerPanel(pmo: PmoData): ColumnTable {
  return {
    columns: ["panel_name", "panel_target_count"],
    rows: pmo.panel_info.map((panel) => [
      panel.panel_name,
      new Set(panel.reactions.flatMap((reaction) => reaction.panel_targets)).size,
    ]),
  };
}

/**
 * How many specimens have each combination of values of `metaFields`, sorted
 * by those values. A specimen without a field counts under `"NA"`. Values are
 * compared as Python writes them (`str(value)`). Columns: the fields, then
 * `specimens_count`, `specimens_freq`, `total_specimen_count`.
 */
export function countSpecimenByFieldValue(
  pmo: PmoData,
  metaFields: readonly string[],
): ColumnTable {
  const total = pmo.specimen_info.length;
  const counts = new Map<string, { values: string[]; count: number }>();
  for (const specimen of pmo.specimen_info) {
    const record: Readonly<Record<string, unknown>> = specimen;
    const values = metaFields.map((field) =>
      field in record ? pythonStr(record[field]) : "NA",
    );
    const key = JSON.stringify(values);
    const found = counts.get(key);
    if (found === undefined) counts.set(key, { values, count: 1 });
    else found.count += 1;
  }
  const rows = [...counts.values()]
    .toSorted((a, b) => {
      for (let index = 0; index < metaFields.length; index += 1) {
        const order = compareCodePoints(a.values[index] ?? "", b.values[index] ?? "");
        if (order !== 0) return order;
      }
      return 0;
    })
    .map(({ values, count }): TableCell[] => [...values, count, count / total, total]);
  return {
    columns: [...metaFields, "specimens_count", "specimens_freq", "total_specimen_count"],
    rows,
  };
}

/**
 * One group of conditions: a specimen is in the group when, for every field,
 * it has the field and its value (as Python writes it) is one of the values.
 */
export interface MetaGroup {
  /** The group's name. Only for the reader: the counts table lists groups in order. */
  readonly name?: string;
  readonly criteria: Readonly<Record<string, readonly string[]>>;
}

/**
 * Reads groups written as pmotools-python's command line takes them:
 * `field1=value1,value2:field2=value3;field1=value4`. Groups are separated by
 * `;`, conditions by `:`, values by `,`. Throws a `PmoError`
 * (`process/meta-condition`) for a condition without exactly one `=`.
 */
export function parseMetaGroups(text: string): MetaGroup[] {
  return text.split(";").map((groupText) => {
    const criteria: Record<string, string[]> = {};
    for (const condition of groupText.split(":")) {
      const parts = condition.split("=");
      const [field, values] = parts;
      if (parts.length !== 2 || field === undefined || values === undefined) {
        throw new PmoError(
          "process/meta-condition",
          `"${groupText}" should be a field and values separated by =, such as collection_country=Mali,Ghana.`,
          { condition },
        );
      }
      criteria[field] = values.split(",");
    }
    return { criteria };
  });
}

/** What {@link extractFromPmoSamplesWithMetaGroupings} returns. */
export interface MetaGroupingResult {
  /** The PMO with the specimens of every group. */
  readonly pmo: PmoData;
  /**
   * One row per group: a column per field, its values joined with `,`, and
   * `count`, the number of specimens in the group. A specimen in two groups
   * counts in both.
   */
  readonly groupCounts: ColumnTable;
}

/**
 * Keeps the specimens that fall in any of `groups` (or groups written as
 * {@link parseMetaGroups} reads them), with their library samples and data.
 *
 * Throws a `PmoError` (`process/unknown-meta-fields`) for a field no specimen
 * has, and the errors of {@link parseMetaGroups}.
 */
export function extractFromPmoSamplesWithMetaGroupings(
  pmo: PmoData,
  groups: string | readonly MetaGroup[],
): MetaGroupingResult {
  const chosen = typeof groups === "string" ? parseMetaGroups(groups) : groups;
  const fields = new Set(pmo.specimen_info.flatMap((specimen) => Object.keys(specimen)));
  const unknown = [
    ...new Set(chosen.flatMap((group) => Object.keys(group.criteria))),
  ].filter((field) => !fields.has(field));
  if (unknown.length > 0) {
    throw new PmoError(
      "process/unknown-meta-fields",
      `No specimen has ${unknown.map((field) => `"${field}"`).join(", ")}.`,
      { fields: unknown },
    );
  }

  const counts = chosen.map(() => 0);
  const names: string[] = [];
  for (const specimen of pmo.specimen_info) {
    const record: Readonly<Record<string, unknown>> = specimen;
    chosen.forEach((group, index) => {
      const passes = Object.entries(group.criteria).every(
        ([field, values]) => field in record && values.includes(pythonStr(record[field])),
      );
      if (passes) {
        counts[index] = (counts[index] ?? 0) + 1;
        names.push(specimen.specimen_name);
      }
    });
  }

  const records: RowRecord[] = chosen.map((group, index) => {
    const record: RowRecord = new Map();
    for (const [field, values] of Object.entries(group.criteria)) record.set(field, values.join(","));
    return record;
  });
  const table = tableFromRecords(records);
  const groupCounts: ColumnTable = {
    columns: [...table.columns, "count"],
    rows: table.rows.map((row, index) => [...row, counts[index] ?? 0]),
  };
  const ids = indexesOfNames(getSpecimenNames(pmo), names, "specimen");
  return { pmo: filterPmoBySpecimenIds(pmo, ids), groupCounts };
}

/** A run as the count tables name it: its `bioinformatics_run_id`, or `detected_microhaplotypes_count_idx_<n>` by position. */
type RunKey = number | string;

function runKeyOf(run: { readonly bioinformatics_run_id?: number | null }, index: number): RunKey {
  return "bioinformatics_run_id" in run && typeof run.bioinformatics_run_id === "number"
    ? run.bioinformatics_run_id
    : `detected_microhaplotypes_count_idx_${index}`;
}

/** Orders run keys as pandas does for a mixed column: numbers first, then text. */
function compareRunKeys(a: RunKey, b: RunKey): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "number") return -1;
  if (typeof b === "number") return 1;
  return compareCodePoints(a, b);
}

function targetNameOf(pmo: PmoData, mhapsTargetId: number): string {
  const target = pmo.representative_microhaplotypes.targets[mhapsTargetId];
  return target === undefined ? String(mhapsTargetId) : (pmo.target_info[target.target_id]?.target_name ?? "");
}

/**
 * How many targets each library sample has, per run. A target counts when its
 * microhaplotypes there have at least `minReads` reads in all. Columns
 * `bioinformatics_run_id`, `library_sample_name`, `target_number`; one row per
 * library sample of each run, in file order.
 */
export function countTargetsPerLibrarySample(
  pmo: PmoData,
  options: { readonly minReads?: number } = {},
): ColumnTable {
  const minReads = options.minReads ?? 0;
  const rows: TableCell[][] = [];
  pmo.detected_microhaplotypes.forEach((run, index) => {
    const key = runKeyOf(run, index);
    for (const sample of run.library_samples) {
      const name = pmo.library_sample_info[sample.library_sample_id]?.library_sample_name ?? null;
      const targets = sample.target_results.filter(
        (result) => result.mhaps.reduce((sum, mhap) => sum + mhap.reads, 0) >= minReads,
      ).length;
      rows.push([key, name, targets]);
    }
  });
  return { columns: ["bioinformatics_run_id", "library_sample_name", "target_number"], rows };
}

/**
 * How many library samples have each target, per run (or summed across runs
 * with `collapseAcrossRuns`). A sample counts when the target's
 * microhaplotypes there have at least `minReads` reads in all. Sorted by run,
 * then target name.
 */
export function countLibrarySamplesPerTarget(
  pmo: PmoData,
  options: { readonly minReads?: number; readonly collapseAcrossRuns?: boolean } = {},
): ColumnTable {
  const minReads = options.minReads ?? 0;
  const perRun: { key: RunKey; target: string; count: number }[] = [];
  pmo.detected_microhaplotypes.forEach((run, index) => {
    const key = runKeyOf(run, index);
    const counts = new Map<string, number>();
    for (const sample of run.library_samples) {
      for (const result of sample.target_results) {
        if (result.mhaps.reduce((sum, mhap) => sum + mhap.reads, 0) < minReads) continue;
        const target = targetNameOf(pmo, result.mhaps_target_id);
        counts.set(target, (counts.get(target) ?? 0) + 1);
      }
    }
    for (const [target, count] of counts) perRun.push({ key, target, count });
  });
  if (options.collapseAcrossRuns === true) {
    const totals = new Map<string, number>();
    for (const row of perRun) totals.set(row.target, (totals.get(row.target) ?? 0) + row.count);
    return {
      columns: ["target_name", "sample_count"],
      rows: [...totals]
        .toSorted(([a], [b]) => compareCodePoints(a, b))
        .map(([target, count]): TableCell[] => [target, count]),
    };
  }
  return {
    columns: ["bioinformatics_run_id", "target_name", "sample_count"],
    rows: perRun
      .toSorted((a, b) => compareRunKeys(a.key, b.key) || compareCodePoints(a.target, b.target))
      .map((row): TableCell[] => [row.key, row.target, row.count]),
  };
}

/** Which detections {@link extractAlleleCountsFreqFromPmo} counts, and whether to sum runs. */
export interface AlleleCountsOptions {
  readonly bioinformaticsRunIds?: readonly number[];
  readonly librarySampleNames?: readonly string[];
  readonly targetNames?: readonly string[];
  readonly collapseAcrossRuns?: boolean;
}

/**
 * How many library samples carry each microhaplotype of each target, and its
 * share of the target's detections. Per run, with columns
 * `bioinformatics_run_id`, `target_name`, `mhap_id`, `count`, `freq`,
 * `total_haps_per_target`; or summed across runs with
 * `collapseAcrossRuns`, with columns `target_name`, `mhap_id`, `count`,
 * `freq`, `target_total` (the names differ as in pmotools-python). A run with
 * no `bioinformatics_run_id` is named `detected_microhaplotypes_count_idx_<n>`.
 */
export function extractAlleleCountsFreqFromPmo(
  pmo: PmoData,
  options: AlleleCountsOptions = {},
): ColumnTable {
  const runs = options.bioinformaticsRunIds === undefined ? null : new Set(options.bioinformaticsRunIds);
  const samples = options.librarySampleNames === undefined ? null : new Set(options.librarySampleNames);
  const targets = options.targetNames === undefined ? null : new Set(options.targetNames);
  const counts = new Map<string, { key: RunKey; target: string; mhap: number; count: number }>();
  const totals = new Map<string, number>();
  pmo.detected_microhaplotypes.forEach((run, index) => {
    const key = runKeyOf(run, index);
    if (runs !== null && !(typeof key === "number" && runs.has(key))) return;
    for (const sample of run.library_samples) {
      const name = pmo.library_sample_info[sample.library_sample_id]?.library_sample_name ?? "";
      if (samples !== null && !samples.has(name)) continue;
      for (const result of sample.target_results) {
        const target = targetNameOf(pmo, result.mhaps_target_id);
        if (targets !== null && !targets.has(target)) continue;
        for (const mhap of result.mhaps) {
          const id = JSON.stringify([key, target, mhap.mhap_id]);
          const found = counts.get(id);
          if (found === undefined) counts.set(id, { key, target, mhap: mhap.mhap_id, count: 1 });
          else found.count += 1;
          const totalId = JSON.stringify([key, target]);
          totals.set(totalId, (totals.get(totalId) ?? 0) + 1);
        }
      }
    }
  });
  const rows = [...counts.values()];
  if (options.collapseAcrossRuns === true) {
    const summed = new Map<string, { target: string; mhap: number; count: number }>();
    const targetTotals = new Map<string, number>();
    for (const row of rows) {
      const id = JSON.stringify([row.target, row.mhap]);
      const found = summed.get(id);
      if (found === undefined) summed.set(id, { target: row.target, mhap: row.mhap, count: row.count });
      else found.count += row.count;
      targetTotals.set(row.target, (targetTotals.get(row.target) ?? 0) + row.count);
    }
    return {
      columns: ["target_name", "mhap_id", "count", "freq", "target_total"],
      rows: [...summed.values()]
        .toSorted((a, b) => compareCodePoints(a.target, b.target) || a.mhap - b.mhap)
        .map((row): TableCell[] => {
          const total = targetTotals.get(row.target) ?? 0;
          return [row.target, row.mhap, row.count, total > 0 ? row.count / total : 0, total];
        }),
    };
  }
  return {
    columns: ["bioinformatics_run_id", "target_name", "mhap_id", "count", "freq", "total_haps_per_target"],
    rows: rows
      .toSorted(
        (a, b) =>
          compareRunKeys(a.key, b.key) || compareCodePoints(a.target, b.target) || a.mhap - b.mhap,
      )
      .map((row): TableCell[] => {
        const total = totals.get(JSON.stringify([row.key, row.target])) ?? 0;
        return [row.key, row.target, row.mhap, row.count, total > 0 ? row.count / total : 0, total];
      }),
  };
}
