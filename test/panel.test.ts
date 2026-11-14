import { describe, expect, it } from "vitest";

import {
  checkGenomeInfo,
  mergePanelInfoDicts,
  panelInfoTableToPmo,
  type GenomeInfoInput,
  type PanelInfoFragment,
  type PanelInfoOptions,
} from "../src/builders/panel.js";
import { collectWarnings, PmoError, type PmoWarning } from "../src/errors.js";
import type { Row } from "../src/table/core.js";
import { camelizeKeys, loadCases, toRows, type OracleCase } from "./helpers/conformance.js";

type Outcome =
  | { readonly kind: "ok"; readonly value: unknown; readonly warnings: PmoWarning[] }
  | { readonly kind: "error"; readonly error: unknown; readonly warnings: PmoWarning[] };

function run(call: (onWarning: (warning: PmoWarning) => void) => unknown): Outcome {
  const warnings: PmoWarning[] = [];
  try {
    const { result } = collectWarnings((onWarning) =>
      call((warning) => {
        warnings.push(warning);
        onWarning(warning);
      }),
    );
    // Round-trip through JSON, as a PMO file would be.
    return { kind: "ok", value: result === undefined ? null : JSON.parse(JSON.stringify(result)), warnings };
  } catch (error) {
    return { kind: "error", error, warnings };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Thrown when a recorded argument cannot be expressed with the TypeScript option types. */
class Unrepresentable extends Error {}

function isGenomeList(value: unknown): value is GenomeInfoInput[] {
  return Array.isArray(value) && value.every(isRecord);
}

/** Builds typed options from recorded Python keyword arguments, rejecting any it does not understand. */
function toPanelOptions(kwargs: Readonly<Record<string, unknown>>): Omit<PanelInfoOptions, "onWarning"> {
  const options = camelizeKeys(kwargs);
  const used = new Set<string>();
  const take = (key: string): unknown => {
    used.add(key);
    return options[key];
  };
  const text = (key: string): string | undefined => {
    const value = take(key);
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") throw new Error(`${key} must be a string`);
    return value;
  };
  const panelName = text("panelName");
  if (panelName === undefined) throw new Error("panelName is required");
  const genomeInfo = take("genomeInfo");
  if (!(genomeInfo === undefined || genomeInfo === null || isRecord(genomeInfo) || isGenomeList(genomeInfo))) {
    throw new Unrepresentable("genomeInfo is not an object or a list of objects");
  }
  const additional = take("additionalTargetInfoCols");
  if (!(additional === undefined || additional === null || (Array.isArray(additional) && additional.every((c) => typeof c === "string")))) {
    throw new Error("additionalTargetInfoCols must be a list of strings");
  }
  const result: Omit<PanelInfoOptions, "onWarning"> = {
    panelName,
    genomeInfo: genomeInfo ?? null,
    additionalTargetInfoCols: additional ?? null,
    targetNameCol: text("targetNameCol"),
    forwardPrimersSeqCol: text("forwardPrimersSeqCol"),
    reversePrimersSeqCol: text("reversePrimersSeqCol"),
    reactionNameCol: text("reactionNameCol"),
    reactionNameColDelimiter: text("reactionNameColDelimiter"),
    forwardPrimersStartCol: text("forwardPrimersStartCol"),
    forwardPrimersEndCol: text("forwardPrimersEndCol"),
    reversePrimersStartCol: text("reversePrimersStartCol"),
    reversePrimersEndCol: text("reversePrimersEndCol"),
    insertStartCol: text("insertStartCol"),
    insertEndCol: text("insertEndCol"),
    chromCol: text("chromCol"),
    strandCol: text("strandCol"),
    refSeqCol: text("refSeqCol"),
    geneNameCol: text("geneNameCol"),
    genomeIdCol: text("genomeIdCol"),
    targetAttributesCol: text("targetAttributesCol"),
    targetAttributesColDelimiter: text("targetAttributesColDelimiter"),
  };
  const unknownKeys = Object.keys(options).filter((key) => !used.has(key));
  if (unknownKeys.length > 0) throw new Error(`Unhandled kwargs: ${unknownKeys.join(", ")}`);
  return result;
}

function targetTable(oracle: OracleCase): Row[] {
  const table = oracle.tables["target_table"];
  if (table === undefined) throw new Error(`${oracle.id} has no target_table`);
  return toRows(table);
}

function replay(oracle: OracleCase): Outcome {
  switch (oracle.function) {
    case "panel_info_table_to_pmo":
    case "panel_info_table_to_pmo_mutation_probe": {
      const rows = targetTable(oracle);
      let options: Omit<PanelInfoOptions, "onWarning">;
      try {
        options = toPanelOptions(oracle.kwargs);
      } catch (error) {
        if (!(error instanceof Unrepresentable)) throw error;
        // The option types do not allow this argument; the same check runs in
        // checkGenomeInfo, so replay it there.
        return run(() => checkGenomeInfo(oracle.kwargs["genome_info"]));
      }
      return run((onWarning) => panelInfoTableToPmo(rows, { ...options, onWarning }));
    }
    case "check_genome_info":
      return run(() => checkGenomeInfo(oracle.kwargs["genome_info"]));
    case "merge_panel_info_dicts": {
      const panels = oracle.kwargs["panel_info_dicts"];
      if (!Array.isArray(panels)) throw new Error("panel_info_dicts must be a list");
      return run((onWarning) => mergePanelInfoDicts(panels, { onWarning }));
    }
    default:
      throw new Error(`No replay for ${oracle.function}`);
  }
}

function expectMatchesPython(oracle: OracleCase, outcome: Outcome): void {
  if (oracle.result.kind === "error") {
    if (outcome.kind === "ok") throw new Error(`Python raised ${oracle.result.type}, TypeScript returned a value`);
    expect(outcome.error).toBeInstanceOf(PmoError);
  } else {
    if (outcome.kind === "error") throw outcome.error;
    expect(outcome.value).toEqual(oracle.result.value);
    // Same key order, as Python writes it.
    expect(JSON.stringify(outcome.value)).toBe(JSON.stringify(oracle.result.value));
  }
  expect(outcome.warnings.length).toBe(oracle.warnings.length);
}

function okValue(outcome: Outcome): unknown {
  if (outcome.kind === "error") throw outcome.error;
  return outcome.value;
}

function fragment(outcome: Outcome): PanelInfoFragment {
  const value = okValue(outcome);
  if (!isRecord(value) || !Array.isArray(value["panel_info"]) || !Array.isArray(value["target_info"])) {
    throw new Error("not a panel fragment");
  }
  return {
    panel_info: value["panel_info"],
    target_info: value["target_info"],
  };
}

function errorCode(outcome: Outcome): string {
  if (outcome.kind === "ok") throw new Error("expected an error");
  if (!(outcome.error instanceof PmoError)) throw outcome.error;
  return outcome.error.code;
}

/** Replaces Python's NaN placeholder with null and then compares. */
function withNanAsNull(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_, v: unknown) => (v === "__NaN__" ? null : v)));
}

/** Assertions for cases where pmotools-ts deliberately differs; keyed by case ID. */
const DIVERGENT: Record<string, (oracle: OracleCase, outcome: Outcome) => void> = {
  "panel/table-mutation-adds-reaction-column": (oracle) => {
    expect(oracle.result).toMatchObject({ value: { columns_after_call: expect.arrayContaining(["reaction"]) } });
    const rows = targetTable(oracle).map((row) => Object.freeze({ ...row }));
    const before = JSON.stringify(rows);
    panelInfoTableToPmo(Object.freeze(rows), { panelName: "test_panel" });
    expect(JSON.stringify(rows)).toBe(before);
  },
  "panel/table-missing-primer-seq-nan": (oracle, outcome) => {
    expect(okValue(outcome)).toEqual(withNanAsNull(oracle.result.kind === "ok" ? oracle.result.value : null));
  },
  "panel/table-missing-target-name-nan": (oracle, outcome) => {
    expect(okValue(outcome)).toEqual(withNanAsNull(oracle.result.kind === "ok" ? oracle.result.value : null));
  },
  "panel/table-integer-target-names": (_, outcome) => {
    expect(fragment(outcome).target_info.map((t) => t.target_name)).toEqual(["1", "2", "3"]);
  },
  "panel/table-integer-target-names-missing-location": (oracle, outcome) => {
    expect(oracle.result).toMatchObject({ kind: "error", type: "TypeError" });
    const result = fragment(outcome);
    expect(result.target_info.map((t) => t.target_name)).toEqual(["1", "2", "3"]);
    expect(result.target_info.map((t) => t.insert_location === undefined)).toEqual([false, true, false]);
    expect(outcome.warnings).toHaveLength(1);
    expect(outcome.warnings[0]).toMatchObject({ code: "panel/missing-location", details: { targets: ["2"] } });
  },
  "panel/table-number-and-string-target-name": (oracle, outcome) => {
    expect(oracle.result.kind).toBe("ok");
    expect(errorCode(outcome)).toBe("panel/duplicate-target-names");
  },
  "panel/table-reactions-missing-value": (_, outcome) => {
    expect(fragment(outcome).panel_info[0]?.reactions).toEqual([
      { reaction_name: "p1", panel_targets: [0] },
      { reaction_name: "p2", panel_targets: [2] },
    ]);
  },
  "panel/table-reactions-missing-value-nan": (_, outcome) => {
    expect(fragment(outcome).panel_info[0]?.reactions).toEqual([
      { reaction_name: "p1", panel_targets: [0] },
      { reaction_name: "p2", panel_targets: [2] },
    ]);
  },
  "panel/table-reactions-integer-column": (oracle, outcome) => {
    expect(oracle.result).toMatchObject({ kind: "error", type: "AttributeError" });
    expect(fragment(outcome).panel_info[0]?.reactions).toEqual([
      { reaction_name: "1", panel_targets: [0, 2] },
      { reaction_name: "2", panel_targets: [1] },
    ]);
  },
  "panel/table-reactions-mixed-column": (_, outcome) => {
    expect(fragment(outcome).panel_info[0]?.reactions).toEqual([
      { reaction_name: "p1", panel_targets: [0, 2] },
      { reaction_name: "2", panel_targets: [1, 2] },
    ]);
  },
  "panel/merge-conflict": (oracle, outcome) => {
    expect(okValue(outcome)).toEqual(oracle.result.kind === "ok" ? oracle.result.value : null);
    expect(oracle.warnings).toHaveLength(0);
    expect(outcome.warnings).toEqual([
      expect.objectContaining({ code: "panel/conflicting-target-definition", details: { target: "target2", panel: 1 } }),
    ]);
  },
  "panel/merge-duplicate-location-without-genomes-skipped": (oracle, outcome) => {
    expect(okValue(outcome)).toEqual(oracle.result.kind === "ok" ? oracle.result.value : null);
    expect(outcome.warnings.map((w) => w.code)).toEqual(["panel/conflicting-target-definition"]);
  },
  "panel/merge-number-and-string-names": (_, outcome) => {
    const result = fragment(outcome);
    expect(result.target_info.map((t) => t.target_name)).toEqual(["1"]);
    expect(result.panel_info.map((p) => p.reactions[0]?.panel_targets)).toEqual([[0], [0]]);
    expect(outcome.warnings).toEqual([]);
  },
  "panel/merge-target-without-primer-with-genomes": (oracle, outcome) => {
    expect(oracle.result.kind).toBe("ok");
    expect(errorCode(outcome)).toBe("panel/malformed-target");
  },
};

describe("panel oracle cases", () => {
  const cases = loadCases("panel");

  it("has cases", () => {
    expect(cases.length).toBeGreaterThan(90);
  });

  it("has a TypeScript assertion for exactly the divergent cases", () => {
    const divergent = cases.filter((c) => c.divergence !== null).map((c) => c.id).sort();
    expect(Object.keys(DIVERGENT).sort()).toEqual(divergent);
  });

  for (const oracle of cases) {
    it(oracle.id, () => {
      const outcome = replay(oracle);
      const divergent = DIVERGENT[oracle.id];
      if (divergent !== undefined) divergent(oracle, outcome);
      else expectMatchesPython(oracle, outcome);
    });
  }
});

describe("panelInfoTableToPmo", () => {
  const rows: Row[] = [
    { target_name: "t1", fwd_primer: "AA", rev_primer: "CC", pool: "a" },
    { target_name: "t2", fwd_primer: "GG", rev_primer: "TT", pool: "b" },
  ];

  it("names its warnings and errors with stable codes", () => {
    const { warnings } = collectWarnings((onWarning) =>
      panelInfoTableToPmo(
        [
          { ...rows[0], chrom: "c", s: 1, e: 2 },
          { ...rows[1], chrom: null, s: 1, e: 2 },
        ],
        { panelName: "p", insertStartCol: "s", insertEndCol: "e", chromCol: "chrom", onWarning, genomeInfo: { name: "g", genome_version: "1", taxon_id: 1, url: "u" } },
      ),
    );
    expect(warnings).toEqual([
      expect.objectContaining({ code: "panel/missing-location", details: { location: "Insert", targets: ["t2"] } }),
    ]);
  });

  it("throws panel/location-without-genome for locations without genome info", () => {
    expect(() =>
      panelInfoTableToPmo([{ ...rows[0], chrom: "c", s: 1, e: 2 }], {
        panelName: "p",
        insertStartCol: "s",
        insertEndCol: "e",
        chromCol: "chrom",
      }),
    ).toThrow(expect.objectContaining({ code: "panel/location-without-genome" }));
  });

  it("returns a copy of the genome info", () => {
    const genome = { name: "3D7", genome_version: "3", taxon_id: 5833, url: "u", chromosomes: ["c1"] };
    const result = panelInfoTableToPmo(rows, { panelName: "p", genomeInfo: genome });
    expect(result.targeted_genomes).toEqual([genome]);
    expect(result.targeted_genomes?.[0]).not.toBe(genome);
  });

  it("rejects an empty table", () => {
    expect(() => panelInfoTableToPmo([], { panelName: "p" })).toThrow(
      expect.objectContaining({ code: "panel/empty-table" }),
    );
  });

  it("splits a multi-character reaction delimiter as a regular expression, like pandas", () => {
    const result = panelInfoTableToPmo(
      [
        { ...rows[0], pool: "a1b" },
        { ...rows[1], pool: "a22b" },
      ],
      { panelName: "p", reactionNameCol: "pool", reactionNameColDelimiter: "\\d+" },
    );
    expect(result.panel_info[0]?.reactions.map((r) => r.reaction_name)).toEqual(["a", "b"]);
  });
});

describe("mergePanelInfoDicts", () => {
  it("does not modify its input", () => {
    const panel = panelInfoTableToPmo(
      [{ target_name: "t1", fwd_primer: "AA", rev_primer: "CC", chrom: "c", s: 1, e: 2 }],
      {
        panelName: "p",
        insertStartCol: "s",
        insertEndCol: "e",
        chromCol: "chrom",
        genomeInfo: [
          { name: "a", genome_version: "1", taxon_id: 1, url: "u" },
          { name: "b", genome_version: "1", taxon_id: 1, url: "u" },
        ],
      },
    );
    const before = JSON.stringify(panel);
    const merged = mergePanelInfoDicts([{ ...panel, targeted_genomes: panel.targeted_genomes?.slice().reverse() }, panel]);
    expect(JSON.stringify(panel)).toBe(before);
    // The first panel lists the genomes in the other order, so its genome 0 is "b".
    expect(merged.targeted_genomes?.map((g) => g["name"])).toEqual(["b", "a"]);
    expect(merged.target_info[0]?.insert_location?.genome_id).toBe(0);
  });

  it("accepts its own output", () => {
    const a = panelInfoTableToPmo([{ target_name: "t1", fwd_primer: "AA", rev_primer: "CC" }], { panelName: "a" });
    const b = panelInfoTableToPmo([{ target_name: "t2", fwd_primer: "GG", rev_primer: "TT" }], { panelName: "b" });
    const merged = mergePanelInfoDicts([mergePanelInfoDicts([a]), b]);
    expect(merged.panel_info.map((p) => p.reactions[0]?.panel_targets)).toEqual([[0], [1]]);
  });
});
