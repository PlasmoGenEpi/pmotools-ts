/**
 * Names in a PMO, and turning names into the indexes the PMO refers to
 * records by. Ports the name helpers of pmotools-python's `PMOProcessor`.
 */
import { PmoError } from "../errors.js";
import type { PmoData } from "./table.js";

/** Specimen names in the order of `specimen_info`. */
export function getSpecimenNames(pmo: PmoData): string[] {
  return pmo.specimen_info.map((specimen) => specimen.specimen_name);
}

/** Library sample names in the order of `library_sample_info`. */
export function getLibrarySampleNames(pmo: PmoData): string[] {
  return pmo.library_sample_info.map((library) => library.library_sample_name);
}

/** Target names in the order of `target_info`. */
export function getTargetNames(pmo: PmoData): string[] {
  return pmo.target_info.map((target) => target.target_name);
}

/** Panel names in the order of `panel_info`. */
export function getPanelNames(pmo: PmoData): string[] {
  return pmo.panel_info.map((panel) => panel.panel_name);
}

/** Bioinformatics run names in the order of `bioinformatics_run_info`; empty when there is none. */
export function getBioinformaticsRunNames(pmo: PmoData): string[] {
  return (pmo.bioinformatics_run_info ?? []).map((run) => run.bioinformatics_run_name);
}

/** What a name lookup is for: names the error, and its `code`. */
export type NameKind = "specimen" | "library-sample" | "target";

/**
 * The indexes of `names` among `all`. When a name appears twice in `all`,
 * the later index wins, as in pmotools-python. Throws a `PmoError`
 * (`process/unknown-<kind>-names`) listing every name that is not there.
 */
export function indexesOfNames(
  all: readonly string[],
  names: readonly string[],
  kind: NameKind,
): number[] {
  const index = new Map<string, number>();
  all.forEach((name, position) => index.set(name, position));
  const unknown = names.filter((name) => !index.has(name));
  if (unknown.length > 0) {
    throw new PmoError(
      `process/unknown-${kind}-names`,
      `No ${kind.replace("-", " ")} called ${unknown.map((name) => `"${name}"`).join(", ")} in the PMO.`,
      { names: unknown },
    );
  }
  return names.map((name) => index.get(name) ?? -1);
}
