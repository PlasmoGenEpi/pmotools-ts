# Changelog

## 0.2.0

- `createMhapTableBuilder` builds the allele table's fragment from rows added
  a chunk at a time, for tables too large to hold at once. Its result is
  exactly `mhapTableToPmo`'s, which now runs through it and is about 15%
  faster.
- `mergeToPmo` takes `shareMicrohaplotypes`, which shares the large arrays
  with `mhapInfo` instead of copying them.
- `stringifyPmoChunks`, `pmoStream` and `pmoBlob` write a PMO a piece at a
  time, so the JSON can pass the 512 MB limit on one string. `gzipPmo` uses
  them and now works for PMOs of any size.
- `stringifyPmo` and `gzipPmo` report a PMO too long for one string as
  `io/not-serialisable`.

## 0.1.0

First release. Ports the builder, validation, reading, writing, subsetting,
counting and table-export parts of pmotools-python v1.2.2. See the README for
what is covered and where it differs.
