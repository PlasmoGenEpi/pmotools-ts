"""Oracle cases for column type inference (src/table/infer.ts).

The PMO Builder app reads uploads with ``pd.read_csv(file, sep=None,
engine="python")``. These cases record what that does to each column, so the
TypeScript port can type a string grid the same way.

Each inline case calls :func:`read_csv_typed` on a small CSV text. It reads
the text twice with the python engine: once untyped (``dtype=str,
keep_default_na=False``), which is the string grid a browser CSV parser would
hand over, and once with pandas defaults, which is the typed result. Both are
in the recorded value. Inline cases use an explicit separator so the
csv.Sniffer does not change what is being tested; the type inference that
follows is the same code path as with ``sep=None``.

The example tables are read with ``sep=None`` exactly like the app. Small ones
are recorded whole; large ones record, per column, the distinct raw strings
and what each became (inference is per column, so dtype plus that mapping
fixes every cell), and the test rebuilds the grid by splitting the file.
"""

from __future__ import annotations

import io
import math
import random

import numpy as np
import pandas as pd

from oracle.common import TABLES, run_case

#: Example tables to run through the inference, as the app reads them.
EXAMPLE_FILES = [
    "example_contributors.txt",
    "example_raw_reads.txt",
    "reads_per_stage.txt",
    "mad4hatter_amplicon_coverage.txt",
    "mad4hatter_allele_data_example.csv",
    "mad4hatter_allele_data_example_multi_bioinfo.csv",
    "mad4hatter_demultiplexed_example.csv",
    "mad4hatter_panel_info_example.csv",
]

#: Above this many cells an example table is recorded as a per-column mapping.
WHOLE_TABLE_LIMIT = 2000


def encode_cell(value):
    """A JSON-safe cell. NaN/None become None; infinities become a marker object."""
    if value is None or value is pd.NA:
        return None
    if isinstance(value, np.generic):
        value = value.item()
    if isinstance(value, float):
        if math.isnan(value):
            return None
        if math.isinf(value):
            return {"float": "inf" if value > 0 else "-inf"}
    return value


def encode_grid(df: pd.DataFrame) -> list[list]:
    return [[encode_cell(cell) for cell in row] for row in df.itertuples(index=False, name=None)]


def read_both(source, *, sep, na_values=None, keep_default_na=True, text_columns=None):
    """Read ``source`` untyped and typed. ``source`` is a path or CSV text."""

    def handle():
        return io.StringIO(source) if isinstance(source, str) else source

    raw = pd.read_csv(handle(), sep=sep, engine="python", dtype=str, keep_default_na=False)
    typed_kwargs = {"sep": sep, "engine": "python", "keep_default_na": keep_default_na}
    if na_values is not None:
        typed_kwargs["na_values"] = na_values
    if text_columns:
        typed_kwargs["dtype"] = {name: str for name in text_columns}
    typed = pd.read_csv(handle(), **typed_kwargs)
    assert list(raw.columns) == list(typed.columns)
    assert len(raw) == len(typed)
    return raw, typed


def read_csv_typed(text, sep=",", na_values=None, keep_default_na=True, text_columns=None):
    """Type CSV text with pd.read_csv defaults; also return the untyped grid."""
    raw, typed = read_both(
        text,
        sep=sep,
        na_values=na_values,
        keep_default_na=keep_default_na,
        text_columns=text_columns,
    )
    return {
        "columns": [str(c) for c in typed.columns],
        "dtypes": {str(c): str(t) for c, t in typed.dtypes.items()},
        "raw": encode_grid(raw),
        "rows": encode_grid(typed),
    }


def read_example_table(file):
    """Read an example table like the app (sep=None, python engine)."""
    path = TABLES / file
    raw, typed = read_both(path, sep=None)
    columns = [str(c) for c in typed.columns]
    result = {
        "columns": columns,
        "dtypes": {str(c): str(t) for c, t in typed.dtypes.items()},
        "row_count": len(typed),
    }
    if len(typed) * len(columns) <= WHOLE_TABLE_LIMIT:
        result["raw"] = encode_grid(raw)
        result["rows"] = encode_grid(typed)
        return result
    # Large file: the test splits the file itself, so check that a plain split
    # reproduces pandas' raw grid, then record each column's raw -> typed map.
    lines = path.read_text().splitlines()
    split = [line.split("\t") for line in lines]
    assert split[0] == columns, "header differs from a plain tab split"
    assert split[1:] == encode_grid(raw), "rows differ from a plain tab split"
    result["delimiter"] = "\t"
    mapping = {}
    for column in columns:
        pairs = {}
        for before, after in zip(raw[column].tolist(), typed[column].tolist()):
            encoded = encode_cell(after)
            if before in pairs:
                assert pairs[before] == encoded
            pairs[before] = encoded
        mapping[column] = [[before, after] for before, after in pairs.items()]
    result["mapping"] = mapping
    return result


def col(*cells: str, header: str = "a") -> str:
    """CSV text with column ``header`` holding ``cells`` and a text column ``z`` beside it.

    The second column keeps a row whose only cell is empty from being skipped
    as a blank line.
    """
    lines = [f"{header},z"] + [f"{cell},r{i}" for i, cell in enumerate(cells)]
    return "\n".join(lines) + "\n"


def case(case_id, text, note, *, divergence=None, **kwargs):
    run_case(
        f"infer/{case_id}",
        read_csv_typed,
        kwargs={"text": text, **kwargs},
        note=note,
        divergence=divergence,
    )


def float_fuzz_values(count: int, seed: int) -> list[str]:
    rng = random.Random(seed)
    values = []
    for _ in range(count):
        digits = "".join(rng.choice("0123456789") for _ in range(rng.randint(1, 24)))
        point = rng.randint(0, len(digits))
        text = digits[:point] + "." + digits[point:]
        roll = rng.random()
        if roll < 0.4:
            text += rng.choice("eE") + rng.choice(["", "+", "-"]) + str(rng.randint(0, 300))
        if rng.random() < 0.3:
            text = "-" + text
        values.append(text)
    return values


def main() -> None:
    # --- missing values -------------------------------------------------
    defaults = [
        "", "#N/A", "#N/A N/A", "#NA", "-1.#IND", "-1.#QNAN", "-NaN", "-nan", "1.#IND",
        "1.#QNAN", "<NA>", "N/A", "NA", "NULL", "NaN", "None", "n/a", "nan", "null",
    ]
    case(
        "na/default-strings-numeric",
        col("1", *defaults),
        "Every default NA string becomes missing; ints with NA make float64.",
    )
    case(
        "na/default-strings-text",
        col("x", *defaults),
        "Default NA strings become missing in a text column too.",
    )
    case(
        "na/near-misses",
        col("none", "Null", " NA", "NA ", "na", "NAN", "nil", "-", "1"),
        "Matching is exact: case and surrounding spaces matter, so these stay text.",
    )
    case(
        "na/short-rows",
        "a,b,c\n1,x,True\n2\n3,y\n",
        "Fields missing from short rows are missing in every dtype.",
    )
    case(
        "na/all-missing",
        "a,b,z\n,NA,r0\nnan,,r1\n",
        "A column with only missing values is float64, all missing.",
    )
    case(
        "na/one-text-among-missing",
        col("", "NA", "x", "", "NaN"),
        "One text cell in an otherwise missing column: object, the cell kept as text.",
    )
    case(
        "na/one-number-among-missing",
        col("", "NA", "007", ""),
        "One number in an otherwise missing column: float64.",
    )
    case(
        "na/one-bool-among-missing",
        col("", "TRUE", "NA"),
        "One boolean in an otherwise missing column: object holding a bool and missing.",
    )

    # --- integers ---------------------------------------------------------
    case("int/basic", col("1", "22", "333", "0"), "Whole numbers make int64.")
    case("int/leading-zeros", col("001", "0042", "00", "7"), "Leading zeros are dropped.")
    case("int/signs", col("+5", "-5", "-0", "+0"), "Signs are accepted; -0 is 0 in int64.")
    case(
        "int/whitespace",
        col(" 1", "2 ", "  3  ", "\t4\t", "\x0b5\x0c"),
        "ASCII whitespace around a number is ignored.",
    )
    case(
        "int/mixed-with-text",
        col("001", " 2", "x", "3"),
        "One non-numeric cell keeps the whole column as the original strings.",
    )
    case(
        "int/thousands-like",
        'a,z\n"1,000",r0\n2,r1\n',
        "A thousands separator is not understood: the column stays text.",
    )
    case(
        "int/space-grouped",
        col("1 000", "2"),
        "Space-grouped digits are not a number.",
    )
    case(
        "int/underscore",
        col("1_000", "2"),
        "Python-style underscores are not a number.",
    )
    case(
        "int/non-ascii-digits",
        col("١٢", "１２", "3"),
        "Only ASCII digits count.",
    )
    case(
        "int/with-missing",
        col("1", "", "3", "NA"),
        "Ints with a missing cell become float64.",
    )
    case(
        "int/int64-limits",
        col("9223372036854775807", "-9223372036854775808", "1"),
        "The int64 range stays int64.",
    )
    case(
        "int/beyond-2-53",
        col("9007199254740993", "1"),
        "int64 above 2**53: exact in Python, nearest double in JavaScript.",
    )
    case(
        "int/uint64",
        col("9223372036854775808", "18446744073709551615", "1"),
        "Above int64 max and within uint64: uint64.",
    )
    case(
        "int/uint64-with-negative",
        col("9223372036854775808", "-1", "2"),
        "uint64 with a negative int: left as the original strings.",
    )
    case(
        "int/uint64-with-missing",
        col("9223372036854775808", "NA", "", "2"),
        "uint64 with a missing cell: left as the original strings, NA strings included.",
    )
    case(
        "int/uint64-with-missing-and-text",
        col("9223372036854775808", "NA", "x"),
        "uint64 with text: the usual text fallback, so NA strings do become missing.",
    )
    case(
        "int/uint64-with-float",
        col("9223372036854775808", "1.5", "-2.5"),
        "uint64 with floats: float64, the big value parsed the pandas way.",
    )
    case(
        "int/above-uint64",
        col("18446744073709551616", "NA", "1"),
        "Above uint64 max: text fallback, NA becomes missing.",
    )
    case(
        "int/below-int64",
        col("-9223372036854775809", "1"),
        "Below int64 min: text fallback.",
    )
    case(
        "int/above-uint64-with-float",
        col("18446744073709551616", "1.5"),
        "An out-of-range integer forces text even beside floats.",
    )
    case(
        "int/long-with-missing",
        col("1234567890123456789", "NA"),
        "A 19-digit int in a float64 column keeps only 17 significant digits.",
    )

    # --- floats -----------------------------------------------------------
    case("float/decimal-forms", col("1.5", ".5", "5.", "+.5", "-.5", "0001.5000"), "Decimal forms.")
    case(
        "float/exponents",
        col("1e3", "1E-3", "1e+3", "-1.5E2", "01e3", "1e0001", "1.e2"),
        "Exponents; any exponent makes the column float64.",
    )
    case("float/int-and-float", col("2.5", "2", "1"), "Ints beside a float become float64.")
    case("float/whole-float", col("1.0", "2"), "1.0 makes the column float64 even though it is whole.")
    case("float/negative-zero", col("-0", "-0.0", "1.5"), "-0 in a float64 column is negative zero.")
    case(
        "float/infinity",
        col("inf", "INF", "+inf", "-Inf", "Infinity", "+Infinity", "infinity", "-INFINITY", "1"),
        "Infinity spellings, any case, are numbers.",
    )
    case(
        "float/infinity-with-space",
        col(" inf", "2"),
        "Unlike digits, an infinity with surrounding space is not a number.",
    )
    case(
        "float/infinity-with-text",
        col("Infinity", "-inf", "x"),
        "Infinity strings in a text column stay text.",
    )
    case(
        "float/malformed",
        col("1e", "2"),
        "A dangling exponent marker is not a number.",
    )
    for index, bad in enumerate(["e5", "-", "++5", "5-", "0x1A", "1.5.2", "1e1.5", ".", "+", "1e+"]):
        case(
            f"float/malformed-{index:02d}",
            col(bad, "2"),
            f"{bad!r} is not a number, so the column is text.",
        )
    case(
        "float/overflow",
        col("1.8e308", "1"),
        "A value that overflows to infinity is not a number: text.",
    )
    case(
        "float/max",
        col("1.7976931348623157e308", "1e308", "1"),
        "The largest doubles still parse.",
    )
    case(
        "float/big-exponent-on-zero",
        col("0e999", "1"),
        "An exponent above 308 is rejected even on zero: text.",
    )
    case(
        "float/underflow",
        col("1e-400", "4.9e-324", "2e-324", "1e-320", "0.0e-999", "1"),
        "Tiny values become subnormals or zero; they never fail.",
    )
    case(
        "float/exponent-wraparound",
        col("1e4294967296", "1e4294967295", "1e2147483648", "1e-4294967296", "2"),
        "pandas accumulates the exponent in a 32-bit int, which wraps.",
    )
    case(
        "float/exponent-too-long",
        col("1e99999999999999999", "2"),
        "More than 17 exponent digits leaves trailing characters: text.",
    )
    case(
        "float/digit-truncation",
        col(
            "0.12345678901234567890",
            "0.0000000000000000000000000001e10",
            "123456789012345678901234.5",
            "9223372036854775808.5",
            "1",
        ),
        "pandas keeps only the first 17 digits, leading zeros included.",
    )
    fuzz = float_fuzz_values(1500, seed=20261113)
    case(
        "float/fuzz",
        "a,z\n" + "".join(f"{value},r{i}\n" for i, value in enumerate(fuzz)),
        "Random decimals: pandas' own parser often differs from correctly rounded parsing.",
    )

    # --- booleans ---------------------------------------------------------
    case(
        "bool/spellings",
        col("True", "TRUE", "true", "False", "FALSE", "false"),
        "The six accepted spellings make a bool column.",
    )
    case(
        "bool/with-missing",
        col("true", "NA", "False", ""),
        "Booleans with missing cells: object holding bools and missing.",
    )
    for index, other in enumerate(["t", "yes", "1", "True ", "tRUE", "on"]):
        case(
            f"bool/fallback-{index:02d}",
            col("True", "False", other),
            f"{other!r} is not a boolean, so every cell stays text.",
        )
    case(
        "bool/ones-and-zeros",
        col("1", "0", "1"),
        "1 and 0 are ints, not booleans.",
    )

    # --- options ----------------------------------------------------------
    case(
        "options/no-na-strings",
        col("", "NA", "nan", "1"),
        "With no NA strings, empty and NA cells are text, and 'nan' is not a number.",
        keep_default_na=False,
    )
    case(
        "options/no-na-strings-number",
        col("1", "2"),
        "With no NA strings, a plain number column is still int64.",
        keep_default_na=False,
    )
    case(
        "options/custom-only",
        col("missing", "NA", "1"),
        "A custom list replaces the defaults.",
        na_values=["missing", "NA"],
        keep_default_na=False,
    )
    case(
        "options/custom-only-numeric",
        col("missing", "", "1"),
        "A custom list without '' keeps empty cells as text.",
        na_values=["missing"],
        keep_default_na=False,
    )
    case(
        "options/extend-defaults",
        col("-999", "-999.0", "NA", "3"),
        "Extra NA strings on top of the defaults.",
        na_values=["-999"],
    )
    case(
        "options/numeric-na-numeric-column",
        col("0", "00", "0.0", "0e0", "1"),
        "A numeric NA string also matches equal numbers while the column is numeric.",
        na_values=["0"],
        keep_default_na=False,
    )
    case(
        "options/numeric-na-text-column",
        col("0", "00", "foo", "0.0"),
        "In a text column only the string and its 'N.0' form match.",
        na_values=["0"],
        keep_default_na=False,
    )
    case(
        "options/numeric-na-fractional",
        col("1.5", "1.50", "foo"),
        "A fractional NA string has no extra string forms.",
        na_values=["1.5"],
        keep_default_na=False,
    )
    case(
        "options/numeric-na-exponent",
        col("1000", "1000.0", "1e3", "foo"),
        "'1e3' as NA also matches the strings '1000' and '1000.0'.",
        na_values=["1e3"],
        keep_default_na=False,
    )
    case(
        "options/numeric-na-exponent-numbers",
        col("100", "1e2", "2"),
        "'1e2' as NA matches the number 100.",
        na_values=["1e2"],
        keep_default_na=False,
    )
    case(
        "options/inf-na",
        col("inf", "INF", "2"),
        "'inf' as NA matches every infinity spelling numerically.",
        na_values=["inf"],
        keep_default_na=False,
    )
    case(
        "options/bool-na",
        col("True", "False"),
        "A boolean spelling as NA, the rest still becomes bool (with missing).",
        na_values=["True"],
        keep_default_na=False,
    )
    case(
        "options/text-columns",
        "a,b,c\n001,True,1.50\nNA,,x\n2,False,\n",
        "Text columns keep their strings; NA strings still become missing.",
        text_columns=["a", "b"],
    )
    case(
        "options/text-columns-with-custom-na",
        "a,b\n001,1\nmissing,NA\n",
        "Text columns use the custom NA list too.",
        na_values=["missing"],
        keep_default_na=False,
        text_columns=["a"],
    )

    # --- shape --------------------------------------------------------------
    case("shape/no-rows", "a,b\n", "A header with no rows: no cells to type.")

    # --- example tables -----------------------------------------------------
    for file in EXAMPLE_FILES:
        run_case(
            f"infer/example/{file.replace('.', '_')}",
            read_example_table,
            kwargs={"file": file},
            note=f"conformance/data/tables/{file} read the way the app reads it.",
        )


if __name__ == "__main__":
    main()
