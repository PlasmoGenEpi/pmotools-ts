import { describe, expect, it } from "vitest";

import { isMissing, isPresent, type Cell } from "../src/index.js";

describe("package entry", () => {
  it("exports isMissing and isPresent for testing cells", () => {
    const cells: Cell[] = [null, undefined, Number.NaN, "", 0, false, "x"];
    expect(cells.map(isMissing)).toEqual([true, true, true, false, false, false, false]);
    expect(cells.map(isPresent)).toEqual([false, false, false, true, true, true, true]);
  });
});
