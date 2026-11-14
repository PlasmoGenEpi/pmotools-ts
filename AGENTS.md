# Working in pmotools-ts

pmotools-ts is a TypeScript port of the parts of
[pmotools-python](https://github.com/PlasmoGenEpi/pmotools-python) needed to
build, validate, read and write Portable Microhaplotype Object (PMO) files in a
browser or in Node, with no Python. It is checked against pmotools-python
v1.2.2, which acts as the oracle.

## Layout

| Path | What it holds |
|---|---|
| `src/table/core.ts` | `Cell`, `Row`, `Table`, and the pandas-equivalent helpers every builder shares |
| `src/errors.ts` | `PmoError`, `PmoWarning`, `onWarning`, `collectWarnings` |
| `src/builders/` | Table-to-PMO builders, one file per Python builder module |
| `src/merge/` | `mergeToPmo`: assembles builder outputs into one PMO |
| `src/validate/` | JSON Schema validation and reference-integrity checks |
| `src/io/` | Reading and writing PMO JSON, plain or gzipped |
| `src/types/` | PMO types generated from the JSON Schema |
| `schemas/` | JSON Schemas vendored from pmotools-python, unmodified |
| `conformance/oracle/` | Python generators that record what pmotools-python does |
| `conformance/cases/<module>/` | The recorded cases, checked in |
| `conformance/data/` | Example tables and PMO files the generators read |
| `test/` | Vitest tests; `test/helpers/conformance.ts` loads oracle cases |

## Commands

```bash
pnpm typecheck                      # tsc --noEmit over src, test, scripts
pnpm vitest run test/<file>.test.ts # one test file
pnpm test                           # everything
pnpm oracle                         # regenerate every oracle case
cd conformance && .venv/bin/python -m oracle.gen_<module>   # one generator
```

The Python environment in `conformance/.venv` is already synced. Use
`.venv/bin/python` directly; do not run `uv sync` or `uv add`.

## Conventions

**Tables are arrays of plain rows.** A builder takes `Table` (`readonly Row[]`)
where Python takes a DataFrame. Do not add a dataframe library. Use the helpers
in `src/table/core.ts` for missing values, grouping, ordering and duplicates so
every builder agrees with pandas in the same way.

**Missing means `null`, `undefined` or `NaN`.** Test with `isMissing` or
`isPresent`. An empty string is a value, not a missing cell, unless the Python
code treats it as blank at that spot.

**Functions are camelCase; PMO data stays snake_case.** `mhap_table_to_pmo`
becomes `mhapTableToPmo`. A Python keyword argument `target_name_col` becomes
the option `targetNameCol`. Keys inside PMO data (`target_name`, `mhap_id`) are
the file format and never change. Take the table as the first argument and
everything else as one options object, with the same defaults as Python.

**Bad input throws `PmoError`; softer problems call `onWarning`.** Give each a
stable `code` of the form `"<module>/<reason>"` and put the offending names in
`details`. Match Python on *when* an error or warning happens. Wording does not
have to match.

**Never mutate arguments.** Several Python functions modify their inputs; the
port must not.

**Types.** `strict` and `noUncheckedIndexedAccess` are on. No `any`. Avoid `as`
casts: narrow with type guards, and treat parsed JSON as `unknown` until
checked. Export the types of what a function takes and returns. Write a JSDoc
comment on every export.

**No new dependencies** without asking. There are no runtime dependencies; `ajv` is used only at build time to generate the validators.

## Matching Python

The default is that output is deep-equal to pmotools-python v1.2.2 for the same
input, after `JSON.parse`. That includes key order of groups, which duplicate
wins, and which optional keys are present or absent.

Differ from Python only where Python's result is one of:

- not valid JSON (a bare `NaN`);
- an unintended crash (a `TypeError` or `KeyError` from a bug, not a deliberate
  `ValueError`);
- a mutation of the caller's data;
- the result of comparing a number with its string form (names are compared
  and written as strings here).

Record each deliberate difference in the oracle case with `divergence="..."`
saying what pmotools-ts does instead and why, and assert the TypeScript
behaviour in the test for that case.

Numbers need no special handling: Python may write `10.0` where JavaScript
writes `10`, and the two are equal once parsed.

## Oracle cases

Each module has `conformance/oracle/gen_<module>.py` with a `main()` that calls
`run_case(case_id, function, tables=..., kwargs=..., note=...)` from
`oracle/common.py` once per case. The case ID is a path under
`conformance/cases/`, for example `mhap/basic`.

Cover the plain path with the example tables in `conformance/data/tables/`,
then add small inline DataFrames for each branch and edge: optional columns,
missing values, numeric-looking names, duplicates, and every error and warning
the Python function can raise. The Python test suite for the module is a good
list of cases to port.

The matching Vitest file loads the cases with `loadCases("<module>")`, converts
tables with `toRows` and keyword arguments with `camelizeKeys`, calls the
TypeScript function, and compares: deep equality for results, and for errors
that a `PmoError` is thrown where Python raised.
