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

/**
 * Serialises a PMO the way `PMOWriter.write_out_pmo` does: two-space indent,
 * keys in insertion order, non-ASCII escaped, no trailing newline.
 * `NaN` and infinities are written as `null` (Python writes bare `NaN`,
 * which is not JSON).
 *
 * @throws {PmoError} `io/not-serialisable` when the value cannot be written
 *   as JSON (undefined, a function, a `BigInt` or a cycle).
 */
export function stringifyPmo(pmo: unknown, options: StringifyPmoOptions = {}): string {
  const { indent = 2, ensureAscii = true } = options;
  let json: string | undefined;
  try {
    json = JSON.stringify(pmo, null, indent);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new PmoError("io/not-serialisable", `PMO cannot be written as JSON: ${reason}`, { reason });
  }
  if (json === undefined) {
    throw new PmoError("io/not-serialisable", "PMO cannot be written as JSON", { found: typeof pmo });
  }
  return ensureAscii ? escapeNonAscii(json) : json;
}

/**
 * Serialises a PMO with {@link stringifyPmo} and gzips it, giving the bytes
 * of a `.pmo.json.gz` file.
 *
 * @example
 * const blob = new Blob([await gzipPmo(pmo)], { type: "application/gzip" });
 */
export async function gzipPmo(
  pmo: unknown,
  options: StringifyPmoOptions = {},
): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new Blob([stringifyPmo(pmo, options)]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
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
