"""Fixtures for the end-to-end test.

The example metadata ships as a spreadsheet, which pmotools-ts does not read.
This writes it out as tab-separated text so the end-to-end test can start from
text for every input, as a browser app would after parsing an upload.

Run from ``conformance/``: ``.venv/bin/python -m oracle.gen_e2e``
"""

from __future__ import annotations

import pandas as pd

from oracle.common import TABLES

SHEETS = ["mad4hatter_metadata_example"]


def main() -> None:
    for name in SHEETS:
        frame = pd.read_excel(TABLES / f"{name}.xlsx")
        frame.to_csv(TABLES / f"{name}.tsv", sep="\t", index=False)
        # The text must type back to what read_excel gave, or the test would not
        # be exercising the same input as the merge oracle cases.
        reread = pd.read_csv(TABLES / f"{name}.tsv", sep="\t")
        pd.testing.assert_frame_equal(frame, reread)


if __name__ == "__main__":
    main()
