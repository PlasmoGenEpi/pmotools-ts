/**
 * Reading and writing PMO files, plain or gzipped.
 *
 * Ports `PMOReader.read_in_pmo` (the file path), `PMOWriter.write_out_pmo`
 * and `PMOWriter.add_pmo_extension_as_needed` from pmotools-python. Uses only
 * web-standard APIs (`CompressionStream`, `DecompressionStream`, `Blob`,
 * `Response`, `TextDecoder`), so it runs unchanged in browsers and Node 20+.
 *
 * Reading does not check that the data is a valid PMO; that is the
 * validation module's job.
 */

import { PmoError } from "../errors.js";
import { jsonChunks } from "./jsonChunks.js";

/** Anything a PMO can be read from. Gzip is detected by its magic bytes. */
export type PmoInput = string | Uint8Array | ArrayBuffer | Blob;

/** Options for {@link stringifyPmo} and {@link gzipPmo}. */
export interface StringifyPmoOptions {
  /** Spaces (or a string) per indent level. Default `2`, as Python writes. */
  readonly indent?: number | string;
  /**
   * Escape every character outside printable ASCII as `\uXXXX`, as Python's
   * `json.dump` does by default. Default `true`. The parsed data is the same
   * either way; this only changes the bytes.
   */
  readonly ensureAscii?: boolean;
}

/** Options for {@link pmoStream} and {@link pmoBlob}. */
export interface PmoStreamOptions extends StringifyPmoOptions {
  /** Gzip the bytes, as for a `.json.gz` file. Default `false`. */
  readonly gzip?: boolean;
}

/** Options for {@link addPmoExtension}. */
export interface PmoExtensionOptions {
  /** Add `.json.gz` rather than `.json`. Default `true`, as in Python. */
  readonly gzip?: boolean;
}

/** True when the bytes start with the gzip magic number `1f 8b`. */
export function isGzip(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

/**
 * Replaces Python's non-standard `NaN`, `Infinity` and `-Infinity` tokens,
 * outside strings, with `null`. Python's `json.load` accepts them and
 * `json.dump` writes them, so Python-written PMOs can contain them.
 */
function replaceNonFiniteTokens(text: string): string {
  let out = "";
  let start = 0;
  let inString = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (char === "\\") i += 1;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    for (const token of ["-Infinity", "Infinity", "NaN"]) {
      if (text.startsWith(token, i)) {
        out += `${text.slice(start, i)}null`;
        i += token.length - 1;
        start = i + 1;
        break;
      }
    }
  }
  return out + text.slice(start);
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Parses PMO JSON text. A leading byte-order mark is ignored, and Python's
 * `NaN`/`Infinity` tokens are read as `null`.
 *
 * @throws {PmoError} `io/invalid-json` when the text is not JSON;
 *   `io/not-an-object` when the top level is not a JSON object.
 */
export function parsePmoText(text: string): unknown {
  const body = text.startsWith("﻿") ? text.slice(1) : text;
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (strictError) {
    try {
      parsed = JSON.parse(replaceNonFiniteTokens(body));
    } catch {
      const reason = strictError instanceof Error ? strictError.message : String(strictError);
      throw new PmoError("io/invalid-json", `PMO is not valid JSON: ${reason}`, { reason });
    }
  }
  if (!isJsonObject(parsed)) {
    const found = parsed === null ? "null" : Array.isArray(parsed) ? "array" : typeof parsed;
    throw new PmoError("io/not-an-object", `PMO must be a JSON object, found ${found}`, { found });
  }
  return parsed;
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  try {
    const stream = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new PmoError("io/invalid-gzip", `Could not decompress gzipped PMO: ${reason}`, { reason });
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes);
  } catch {
    throw new PmoError("io/invalid-utf8", "PMO is not valid UTF-8 text");
  }
}

/**
 * Reads a PMO from text, bytes or a `Blob`/`File`, gunzipping first when the
 * bytes start with the gzip magic number (the file name is not consulted).
 * Returns the parsed data unchecked; validate it before use.
 *
 * @throws {PmoError} `io/invalid-gzip`, `io/invalid-utf8`, `io/invalid-json`
 *   or `io/not-an-object`.
 *
 * @example
 * const pmo = await parsePmo(fileInput.files[0]);
 */
export async function parsePmo(input: PmoInput): Promise<unknown> {
  if (typeof input === "string") return parsePmoText(input);
  let bytes: Uint8Array;
  if (input instanceof Uint8Array) bytes = input;
  else if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else bytes = new Uint8Array(await input.arrayBuffer());
  if (isGzip(bytes)) bytes = await gunzip(bytes);
  return parsePmoText(decodeUtf8(bytes));
}

function escapeNonAscii(json: string): string {
  return json.replace(/[\u007f-￿]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function notSerialisable(error: unknown): PmoError {
  if (error instanceof PmoError) return error;
  const reason = error instanceof Error ? error.message : String(error);
  return new PmoError("io/not-serialisable", `PMO cannot be written as JSON: ${reason}`, { reason });
}

/**
 * Serialises a PMO the way `PMOWriter.write_out_pmo` does: two-space indent,
 * keys in insertion order, non-ASCII escaped, no trailing newline.
 * `NaN` and infinities are written as `null` (Python writes bare `NaN`,
 * which is not JSON).
 *
 * The text must fit in one string, about 512 MB in Chrome and Node. For a
 * larger PMO use {@link pmoStream}, {@link pmoBlob} or
 * {@link stringifyPmoChunks}.
 *
 * @throws {PmoError} `io/not-serialisable` when the value cannot be written
 *   as JSON (undefined, a function, a `BigInt`, a cycle, or too long for a
 *   string).
 */
export function stringifyPmo(pmo: unknown, options: StringifyPmoOptions = {}): string {
  const { indent = 2, ensureAscii = true } = options;
  let json: string | undefined;
  try {
    json = JSON.stringify(pmo, null, indent);
  } catch (error) {
    throw notSerialisable(error);
  }
  if (json === undefined) {
    throw new PmoError("io/not-serialisable", "PMO cannot be written as JSON", { found: typeof pmo });
  }
  return ensureAscii ? escapeNonAscii(json) : json;
}

/**
 * The text of {@link stringifyPmo} in pieces of about a million characters,
 * so a PMO of any size can be written without holding its whole text. The
 * pieces joined are exactly what {@link stringifyPmo} gives.
 *
 * @throws {PmoError} `io/not-serialisable`, as {@link stringifyPmo} does,
 *   when a piece is taken.
 *
 * @example
 * for (const piece of stringifyPmoChunks(pmo)) await writer.write(piece);
 */
export function* stringifyPmoChunks(
  pmo: unknown,
  options: StringifyPmoOptions = {},
): Generator<string, void, undefined> {
  const { indent = 2, ensureAscii = true } = options;
  let any = false;
  try {
    for (const piece of jsonChunks(pmo, indent)) {
      any = true;
      yield ensureAscii ? escapeNonAscii(piece) : piece;
    }
  } catch (error) {
    throw notSerialisable(error);
  }
  if (!any) throw new PmoError("io/not-serialisable", "PMO cannot be written as JSON", { found: typeof pmo });
}

/**
 * The bytes of a PMO file as a stream: the UTF-8 text of
 * {@link stringifyPmo}, gzipped when `gzip` is set. The text is made a piece
 * at a time as the stream is read, so a PMO too large for one string can
 * still be written, for example to a file or a download.
 *
 * A PMO that cannot be written as JSON errors the stream with a
 * {@link PmoError} `io/not-serialisable`.
 *
 * @example
 * await pmoStream(pmo, { gzip: true }).pipeTo(writable);
 */
export function pmoStream(pmo: unknown, options: PmoStreamOptions = {}): ReadableStream<Uint8Array<ArrayBuffer>> {
  const pieces = stringifyPmoChunks(pmo, options);
  const encoder = new TextEncoder();
  const text = new ReadableStream<Uint8Array<ArrayBuffer>>({
    pull(controller) {
      const next = pieces.next();
      if (next.done === true) controller.close();
      else controller.enqueue(encoder.encode(next.value));
    },
    cancel() {
      pieces.return(undefined);
    },
  });
  return options.gzip === true ? text.pipeThrough(new CompressionStream("gzip")) : text;
}

/**
 * A PMO file as a `Blob`, from {@link pmoStream}. A browser can keep a large
 * `Blob` on disk, so this suits downloads of PMOs too large for one string.
 *
 * @throws {PmoError} `io/not-serialisable` (the promise rejects).
 *
 * @example
 * const url = URL.createObjectURL(await pmoBlob(pmo, { gzip: true }));
 */
export async function pmoBlob(pmo: unknown, options: PmoStreamOptions = {}): Promise<Blob> {
  const type = options.gzip === true ? "application/gzip" : "application/json";
  return new Response(pmoStream(pmo, options), { headers: { "content-type": type } }).blob();
}

/**
 * Serialises a PMO as {@link stringifyPmo} does and gzips it, giving the
 * bytes of a `.pmo.json.gz` file. The text is never held whole, so this works
 * for a PMO too large for one string.
 *
 * @throws {PmoError} `io/not-serialisable` (the promise rejects).
 *
 * @example
 * const blob = new Blob([await gzipPmo(pmo)], { type: "application/gzip" });
 */
export async function gzipPmo(
  pmo: unknown,
  options: StringifyPmoOptions = {},
): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await new Response(pmoStream(pmo, { ...options, gzip: true })).arrayBuffer());
}

/**
 * Adds `.json.gz` (or `.json` with `gzip: false`) to a file name unless it
 * already ends that way, like `PMOWriter.add_pmo_extension_as_needed`.
 * `"name.json"` becomes `"name.json.gz"`; `"STDOUT"` is returned unchanged,
 * as in Python.
 */
export function addPmoExtension(fileName: string, options: PmoExtensionOptions = {}): string {
  const { gzip = true } = options;
  if (fileName === "STDOUT") return fileName;
  if (!gzip) return fileName.endsWith(".json") ? fileName : `${fileName}.json`;
  if (fileName.endsWith(".json.gz")) return fileName;
  return fileName.endsWith(".json") ? `${fileName}.gz` : `${fileName}.json.gz`;
}
