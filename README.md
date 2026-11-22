# pmotools-ts

Build, validate, read and write
[Portable Microhaplotype Object](https://github.com/PlasmoGenEpi/portable-microhaplotype-object)
(PMO) files in TypeScript. It runs in browsers and in Node 22+, and it has no
runtime dependencies.

This is a port of the builder half of
[pmotools-python](https://github.com/PlasmoGenEpi/pmotools-python) v1.2.2. Every
function is tested against recorded calls to the Python library, so the same
tables give the same PMO.

```bash
npm install pmotools-ts
```

Versions before 1.0 may change the API in a minor release. See
[CHANGELOG.md](CHANGELOG.md).

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
| `PMOProcessor.filter_pmo_by_*`, `extract_from_pmo_with_read_filter`, `extract_from_pmo_samples_with_meta_groupings` | `filterPmoBy…`, `extractFromPmoWithReadFilter`, `extractFromPmoSamplesWithMetaGroupings` |
| `PMOProcessor.get_*_names`, `count_*` | `get…Names`, `countSpecimenPerMetaFields`, `countTargetsPerPanel`, `countSpecimenByFieldValue`, `countTargetsPerLibrarySample`, `countLibrarySamplesPerTarget` |
| `PMOProcessor.extract_allele_counts_freq_from_pmo` | `extractAlleleCountsFreqFromPmo` |
| `PMOExporter.export_*_table`, `extract_alleles_per_sample_table`, `list_library_sample_names_per_specimen_name` | `export…Table`, `extractAllelesPerSampleTable`, `listLibrarySampleNamesPerSpecimenName` |
| `DataFrame.to_csv` | `formatDelimited` |
| no equivalent | `checkPmoIntegrity` |
| no equivalent | `createColumnTyper`, `createMhapTableBuilder`, `stringifyPmoChunks`, `pmoStream`, `pmoBlob`: large tables, see below |

The exporters return a `ColumnTable` (`columns` and `rows`) laid out as the
pandas DataFrame would be.

Not ported: combining PMOs (`PMOReader.combine_multiple_pmos`), BED exports, the Excel export, `PMOUpdater`, and the CLI.

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

## Large tables

An allele table can run to millions of rows. Two things limit what fits in a
browser tab: no string can be much longer than 512 MB, and the table and the
PMO both have to fit in memory. Each has a way around it.

**Type in two passes.** pandas types a column from all its values: one word
in a column of numbers makes the whole column text. `createColumnTyper` reads
the table in chunks once to settle each column's type, keeping a few flags
per column, then types each chunk of a second read. The result is exactly
what `inferColumnTypes` gives for the whole table.

```ts
const typer = createColumnTyper();
for await (const rows of readInChunks(file)) typer.add(rows);
const types = typer.finish(); // types.dtypes: { Reads: "int64", ... }
for await (const rows of readInChunks(file)) builder.add(types.typeRows(rows));
```

**Build from chunks.** `createMhapTableBuilder` takes the allele table a chunk
at a time, so the file can be read in pieces and each piece dropped once
added. It keeps a few numbers per row, not the row, and gives exactly what
`mhapTableToPmo` gives for the whole table. `mhapTableToPmo` is the same
builder fed one chunk.

```ts
const builder = createMhapTableBuilder({ librarySampleNameCol: "SampleID" });
for await (const rows of readInChunks(file)) builder.add(rows);
const mhapInfo = builder.finish();

// Share the large arrays with mhapInfo instead of copying them.
const pmo = mergeToPmo({ mhapInfo, panelTargetInfo }, { shareMicrohaplotypes: true });
```

**Write in pieces.** `stringifyPmo` returns one string, so it fails once the
JSON passes about 512 MB, around 4 million detections. `pmoStream` gives the
file's bytes as a stream, gzipped or not, and `pmoBlob` gives a `Blob`; both
make the text a piece at a time. `gzipPmo` uses the stream too.
`stringifyPmoChunks` gives the text pieces themselves. All of them write
exactly what `stringifyPmo` writes.

```ts
const blob = await pmoBlob(pmo, { gzip: true });
```

Measured in Node with the heap capped at 4 GB, about what a Chrome worker
gets, on generated tables of 250 targets and 150–300 base sequences:

| Allele table | Build, merge, check and gzip | PMO in memory | Peak memory | `.json` | `.json.gz` |
|---|---|---|---|---|---|
| 1 million rows, 259 MB | 1.9 s | 0.12 GB | 0.4 GB | 131 MB | 5.5 MB |
| 10 million rows, 2.6 GB | 17 s | 1.1 GB | 2.2 GB | 1.3 GB | 54 MB |
| 20 million rows, 5.2 GB | 35 s | 2.3 GB | 3.8 GB | 2.6 GB | 109 MB |

The PMO takes about 115 bytes of memory per detected microhaplotype. The
generated sequences repeat more than real ones, so real files gzip less well.

`parsePmo` still reads a whole file as one string, so it opens PMO files of
up to about 512 MB of JSON.

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
- Subsets keep specimens and library samples in the file's order. Python
  writes them in set order, which scrambles ids of 32 and above.
- An id outside the list is refused. Python lets an id equal to the length
  through (then fails, or returns an empty PMO), and reads a negative id from
  the end.
- `extractFromPmoWithReadFilter` works when a run has no
  `bioinformatics_run_id`, which is optional in 1.1.0. Python fails.
- An unknown name throws a `PmoError` listing every unknown name.
- The methods table joins a list field such as `additional_argument`. Python
  leaves the list in one cell.
- A count with nothing to count returns the table's columns and no rows.
  Python fails sorting an empty table.
- `extractAlleleCountsFreqFromPmo` names a run without a
  `bioinformatics_run_id` by its position, as the `count…` functions do.
  Python fails.

`validatePmo` reaches the same verdict as Python's `jsonschema` on all 19,486
recorded checks. The vendored schemas are untouched. A build step rewrites
their regular expressions so JavaScript matches what Python's `re` matches.

## Development

```bash
pnpm install
pnpm test        # 1,323 tests, most replaying Python oracle cases
pnpm typecheck
pnpm build
```

Regenerating the oracle cases needs [uv](https://docs.astral.sh/uv/):

```bash
cd conformance && uv sync && cd ..
pnpm oracle
```

`AGENTS.md` describes the layout, the conventions and how to add oracle cases.

## Releasing

1. Update `version` in `package.json` and `PMOTOOLS_TS_VERSION` in
   `src/merge/mergeToPmo.ts` (a test checks they agree), and add an entry to
   `CHANGELOG.md`.
2. Commit, then tag and push: `git tag v0.2.0 && git push origin main v0.2.0`.

The Release workflow checks that the tag matches `package.json`, runs the
tests, and publishes to npm with provenance through npm trusted publishing. A
prerelease version such as `0.2.0-beta.1` is published under the `next` tag.

## License

GPL-3.0, the license of pmotools-python, from which this is derived.
