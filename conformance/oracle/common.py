"""Shared helpers for oracle case generators.

A case records one call to pmotools-python: the inputs, and what came back
(a value or an exception, plus any warnings). The TypeScript tests replay the
same inputs and compare. Each ``gen_<module>.py`` in this package exposes a
``main()`` that calls :func:`run_case` once per case.
"""

from __future__ import annotations

import copy
import json
import math
import pathlib
import warnings
from typing import Any, Callable

import numpy as np
import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parent.parent
CASES = ROOT / "cases"
DATA = ROOT / "data"
TABLES = DATA / "tables"
PMOS = DATA / "pmo"

#: Stands in for NaN and infinities, which JSON cannot represent.
NAN = "__NaN__"


def read_table(name: str) -> pd.DataFrame:
    """Read a delimited example table the way the PMO Builder app does."""
    return pd.read_csv(TABLES / name, sep=None, engine="python")


def to_plain(value: Any) -> Any:
    """Convert pandas/numpy values into JSON-safe Python values."""
    if isinstance(value, dict):
        return {str(k): to_plain(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set, np.ndarray, pd.Series)):
        return [to_plain(v) for v in value]
    if isinstance(value, pd.DataFrame):
        return table_to_json(value)
    if value is None or value is pd.NA or value is pd.NaT:
        return None
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    if isinstance(value, np.generic):
        value = value.item()
    if isinstance(value, float) and not math.isfinite(value):
        return NAN
    return value


def table_to_json(df: pd.DataFrame) -> dict:
    """Serialise a DataFrame as columns + row arrays. Missing cells become null."""
    rows = []
    for record in df.itertuples(index=False, name=None):
        row = []
        for cell in record:
            plain = to_plain(cell)
            row.append(None if plain == NAN else plain)
        rows.append(row)
    return {
        "columns": [str(c) for c in df.columns],
        "dtypes": {str(c): str(t) for c, t in df.dtypes.items()},
        "rows": rows,
    }


def run_case(
    case_id: str,
    function: Callable[..., Any],
    *,
    tables: dict[str, pd.DataFrame] | None = None,
    kwargs: dict[str, Any] | None = None,
    note: str | None = None,
    divergence: str | None = None,
) -> dict:
    """Call ``function(**tables, **kwargs)`` and write the outcome to cases/<case_id>.json.

    ``tables`` are the DataFrame arguments, keyed by parameter name. ``kwargs``
    are every other argument and must be JSON-serialisable. ``note`` says what
    the case is for. Set ``divergence`` when pmotools-ts deliberately does
    something different from the recorded Python outcome, and say what and why;
    the TypeScript test for that case then asserts the TypeScript behaviour.
    """
    tables = tables or {}
    kwargs = kwargs or {}
    recorded_tables = {name: table_to_json(df) for name, df in tables.items()}
    recorded_kwargs = to_plain(copy.deepcopy(kwargs))

    call_tables = {name: df.copy(deep=True) for name, df in tables.items()}
    call_kwargs = copy.deepcopy(kwargs)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        try:
            value = function(**call_tables, **call_kwargs)
            result = {"kind": "ok", "value": to_plain(value)}
        except Exception as error:  # noqa: BLE001 - the exception is the recorded outcome
            result = {
                "kind": "error",
                "type": type(error).__name__,
                "message": str(error),
            }

    case = {
        "id": case_id,
        "function": function.__name__,
        "note": note,
        "divergence": divergence,
        "tables": recorded_tables,
        "kwargs": recorded_kwargs,
        "result": result,
        "warnings": [
            {"category": w.category.__name__, "message": str(w.message)} for w in caught
        ],
    }
    path = CASES / f"{case_id}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(case, indent=1, allow_nan=False, ensure_ascii=False) + "\n")
    return case
