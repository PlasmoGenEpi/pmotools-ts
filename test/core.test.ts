import { describe, expect, it } from "vitest";

import {
  columnNames,
  compareCodePoints,
  dropDuplicates,
  duplicatedMask,
  groupBySorted,
  isMissing,
  pandasDtype,
  sortedUnique,
  uniqueInOrder,
} from "../src/table/core.js";

describe("table core", () => {
  it("treats null, undefined and NaN as missing", () => {
    expect([null, undefined, Number.NaN, 0, "", false].map(isMissing)).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it("infers the dtype pandas would", () => {
    expect(pandasDtype([1, 2, 3])).toBe("int64");
    expect(pandasDtype([1, null, 3])).toBe("float64");
    expect(pandasDtype([1.5, 2])).toBe("float64");
    expect(pandasDtype([null, null])).toBe("float64");
    expect(pandasDtype([true, false])).toBe("bool");
    expect(pandasDtype(["a", 1])).toBe("object");
    expect(pandasDtype([])).toBe("object");
  });

  it("sorts numbers numerically and strings by code point", () => {
    expect(sortedUnique([10, 9, 9, null])).toEqual([9, 10]);
    expect(sortedUnique(["t2", "t10", "B", "a"])).toEqual(["B", "a", "t10", "t2"]);
    expect(compareCodePoints("\u{1F600}", "�")).toBeGreaterThan(0);
  });

  it("keeps first-seen order for unique values", () => {
    expect(uniqueInOrder(["b", "a", "b", null, undefined])).toEqual(["b", "a", null]);
  });

  it("groups with sorted keys, original row order and missing keys dropped", () => {
    const table = [
      { t: "b", n: 1 },
      { t: "a", n: 2 },
      { t: null, n: 3 },
      { t: "b", n: 4 },
    ];
    const groups = groupBySorted(table, ["t"]);
    expect(groups.map((group) => group.key)).toEqual([["a"], ["b"]]);
    expect(groups.map((group) => group.indices)).toEqual([[1], [0, 3]]);
  });

  it("finds duplicates like pandas", () => {
    const table = [{ a: 1 }, { a: "1" }, { a: 1 }, { a: null }, { a: undefined }];
    expect(duplicatedMask(table, ["a"])).toEqual([false, false, true, false, true]);
    expect(duplicatedMask(table, ["a"], "none")).toEqual([true, false, true, true, true]);
    expect(dropDuplicates(table, ["a"])).toHaveLength(3);
  });

  it("lists columns across ragged rows", () => {
    expect(columnNames([{ a: 1 }, { b: 2, a: 3 }])).toEqual(["a", "b"]);
  });
});
