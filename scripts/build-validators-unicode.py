"""Record which code points Python's ``re`` matches with ``\\w``, ``\\d`` and ``\\s``.

pmotools-python validates with ``jsonschema``, which runs schema patterns
through Python's ``re.search`` on ``str``. There ``\\w``, ``\\d`` and ``\\s`` are
Unicode-aware, and their exact membership depends on the Unicode database of
the Python that runs them. JavaScript's ``\\w``/``\\d`` are ASCII-only and its
``\\s`` is a different set, while ``\\p{...}`` classes follow whatever Unicode
version the browser ships. To get one answer in every JavaScript engine, the
validator build (scripts/build-validators.mjs) spells these classes out as
explicit code point ranges taken from this file.

Regenerate with the oracle's Python (3.13, Unicode 15.1), from the repo root:

    conformance/.venv/bin/python scripts/build-validators-unicode.py
"""

from __future__ import annotations

import json
import pathlib
import re
import sys
import unicodedata

OUTPUT = pathlib.Path(__file__).with_name("build-validators-unicode.json")


def ranges(pattern: str) -> list[list[int]]:
    """Code point ranges [first, last] that ``pattern`` matches as one character."""
    compiled = re.compile(pattern)
    out: list[list[int]] = []
    start = None
    for cp in range(0x110000):
        hit = compiled.fullmatch(chr(cp)) is not None
        if hit and start is None:
            start = cp
        elif not hit and start is not None:
            out.append([start, cp - 1])
            start = None
    if start is not None:
        out.append([start, 0x10FFFF])
    return out


def main() -> int:
    data = {
        "python": sys.version.split()[0],
        "unicode": unicodedata.unidata_version,
        "w": ranges(r"\w"),
        "d": ranges(r"\d"),
        "s": ranges(r"\s"),
    }
    OUTPUT.write_text(json.dumps(data, separators=(",", ":")) + "\n")
    print(f"wrote {OUTPUT} (Python {data['python']}, Unicode {data['unicode']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
