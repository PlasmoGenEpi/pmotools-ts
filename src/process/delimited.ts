/**
 * Writing a {@link ColumnTable} as delimited text, such as CSV or TSV.
 */
import type { ColumnTable, TableCell } from "./table.js";

/** Options for {@link formatDelimited}. */
export interface DelimitedOptions {
  /** The field delimiter. Default `,`; use `\t` for TSV. */
  readonly delimiter?: string;
  /** The line ending. Default `\n`. */
  readonly newline?: string;
}

function cellText(cell: TableCell): string {
  if (cell === null) return "";
  if (typeof cell === "boolean") return cell ? "True" : "False";
  return String(cell);
}

/**
 * The table as delimited text with a header row. A missing cell is empty; a
 * field holding the delimiter, a quote or a line break is quoted, with quotes
 * doubled, as pandas' `to_csv` does. `true` and `false` are written `True`
 * and `False`, also as pandas does.
 */
export function formatDelimited(table: ColumnTable, options: DelimitedOptions = {}): string {
  const delimiter = options.delimiter ?? ",";
  const newline = options.newline ?? "\n";
  const quote = (text: string): string =>
    text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  const lines = [
    table.columns.map(quote).join(delimiter),
    ...table.rows.map((row) => row.map((cell) => quote(cellText(cell))).join(delimiter)),
  ];
  return lines.join(newline) + newline;
}
