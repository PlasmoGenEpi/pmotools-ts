# pmotools-ts

Build, validate, read and write
[Portable Microhaplotype Object](https://github.com/PlasmoGenEpi/portable-microhaplotype-object)
(PMO) files in TypeScript. It runs in browsers and in Node 20+, and it has no
runtime dependencies.

This is a port of the builder half of
[pmotools-python](https://github.com/PlasmoGenEpi/pmotools-python) v1.2.2. Every
function is tested against recorded calls to the Python library, so the same
tables give the same PMO.

Status: unreleased. The package is marked private and nothing is published.

## What it covers

| pmotools-python | pmotools-ts |
|---|---|
| `mhap_table_to_pmo` | `mhapTableToPmo` |
| `panel_info_table_to_pmo`, `merge_panel_info_dicts` | `panelInfoTableToPmo`, `mergePanelInfoDicts` |
| `specimen_info_table_to_pmo`, `library_sample_info_table_to_pmo` | `specimenInfoTableToPmo`, `librarySampleInfoTableToPmo` |
| `read_count_by_stage_table_to_pmo` | `readCountByStageTableToPmo` |
| `merge_to_pmo` | `mergeToPmo` |
| `PMOChecker.validate_pmo_json` | `validatePmo` (schemas 1.0.0 and 1.1.0) |
| `PMOWriter`, `read_in_pmo` | `stringifyPmo`, `gzipPmo`, `parsePmo` |
| `pd.read_csv` type inference | `inferColumnTypes` |
| no equivalent | `checkPmoIntegrity` |

Not ported: combining and subsetting PMOs (`PMOReader.combine_multiple_pmos`,
`PMOProcessor`), table exports (`PMOExporter`), `PMOUpdater`, and the CLI.

## Example

```ts
import {
  inferColumnTypes,
  mhapTableToPmo,
  panelInfoTableToPmo,
  mergeToPmo,
  validatePmo,
  checkPmoIntegrity,
  gzipPmo,
} from "pmotools-ts";

// Rows of strings, from any CSV parser.
const alleles = inferColumnTypes(alleleRows);
const targets = inferColumnTypes(panelRows);

const mhapInfo = mhapTableToPmo(alleles, {
  librarySampleNameCol: "SampleID",
  targetNameCol: "Locus",
  seqCol: "ASV",
  readsCol: "Reads",
});
const panelTargetInfo = panelInfoTableToPmo(targets, {
  panelName: "Mad4hatter",
  targetNameCol: "amplicon",
});

const pmo = mergeToPmo({ mhapInfo, panelTargetInfo });

const verdict = validatePmo(pmo);
if (!verdict.valid) console.table(verdict.errors);
const issues = checkPmoIntegrity(pmo);

const bytes = await gzipPmo(pmo); // save as something.pmo.json.gz
```

Tables are arrays of plain objects, one per row. Options have the Python
keyword names in camelCase and the same defaults. Bad input throws a `PmoError`
with a stable `code`. Softer problems go to an `onWarning` callback, or use
`collectWarnings` to get them back as a list.

## Size

Minified and gzipped, the whole library is 67 KB. Both schema validators make
up most of that. Without `validatePmo` it is 21 KB.

## Where it differs from pmotools-python

The default is identical output. The port differs only where Python writes
invalid JSON, crashes by accident, changes its caller's data, or compares a
number with its text form. Each difference is recorded in an oracle case with a
`divergence` note. The main ones:

- Names (`specimen_name`, `library_sample_name`, `target_name`, `panel_name`,
  run and project names) are written and compared as strings. In Python a
  numeric sample name such as `101` never resolves in `merge_to_pmo`.
- A missing read count, sequence, run name or read-count name throws. Python
  writes a bare `NaN`.
- A missing parasite density is left out. Python writes `NaN`.
- A blank cell in a list column (`alternate_identifiers`, `drug_usage`, ...)
  leaves the field out. Python writes `[""]`, which fails the schema.
- Text in a metadata field the schema types as a number is parsed: taxon IDs
  (`"5833,5855"` becomes `[5833, 5855]`), `host_taxon_id`, `gravidity` and
  `plate_col` as `int()` reads them, `host_age` and `parasite_density` as
  `float()` does. Text that does not parse throws. Python writes the strings,
  which fail the schema.
- One library sample may appear in several bioinformatics runs when no library
  metadata is given. Python raises "Duplicate library sample names".
- `mergePanelInfoDicts` keeps the first definition of a repeated target, as
  Python does, and also warns when a later definition conflicts.
- `readCountByStageTableToPmo` gives the same output as Python and also warns
  about repeated stages and about reads for unknown samples or runs, which
  Python drops without a word.
- The header's `generation_method` names pmotools-ts.

`validatePmo` reaches the same verdict as Python's `jsonschema` on all 19,486
recorded checks. The vendored schemas are untouched. A build step rewrites
their regular expressions so JavaScript matches what Python's `re` matches.

## Development

```bash
pnpm install
pnpm test        # 951 tests, most replaying Python oracle cases
pnpm typecheck
pnpm build
```

Regenerating the oracle cases needs [uv](https://docs.astral.sh/uv/):

```bash
cd conformance && uv sync && cd ..
pnpm oracle
```

`AGENTS.md` describes the layout, the conventions and how to add oracle cases.

## License

GPL-3.0, the license of pmotools-python, from which this is derived.
