// Generates the standalone PMO validators in src/validate/generated/ from the
// vendored JSON Schemas in schemas/.
//
// Usage, from the repository root: node scripts/build-validators.mjs [--check]
// With --check nothing is written; the script exits 1 if any checked-in file
// differs from what it would write.
//
// pmotools-python validates PMO files with `jsonschema` (Python), which runs
// every schema `pattern` through Python's `re.search`. Ajv compiles the same
// patterns as JavaScript regular expressions with the `u` flag. The two regex
// dialects disagree on a few points, so this script first derives a patched
// copy of each schema in which every `pattern` is translated from Python
// semantics into an equivalent JavaScript regex. The only other change drops
// annotations (rule 6 below).
// It then compiles the patched schemas with Ajv and writes Ajv's standalone
// code, so nothing is compiled at run time and the browser never needs
// `new Function`.
//
// Translation rules, applied token by token (see translatePattern):
//
//   1. `\w`, `\d`, `\s` become explicit code point ranges recorded from Python
//      (scripts/build-validators-unicode.json, made by
//      build-validators-unicode.py). Python's classes are Unicode-aware: `\w`
//      matches "ô" so "Côte d'Ivoire" passes `^[\w ,._:'–-]+$`, `\d` matches
//      every Unicode decimal digit, `\s` includes U+001C..U+001F and U+0085.
//      JavaScript's `\w`/`\d` are ASCII-only and its `\s` is a different set.
//      `\p{...}` would follow the browser's Unicode version instead of
//      Python's, so the ranges are spelled out. Inside a character class the
//      ranges are spliced in; outside one they are wrapped in `[...]`.
//   2. `$` outside a class becomes `(?=\n?$)`. Without MULTILINE, Python's `$`
//      also matches just before a newline that ends the string, so "abc\n"
//      passes `^[a-z]+$` in Python. JavaScript's `$` matches only at the end.
//   3. `.` outside a class becomes `[^\n]`. Python's `.` excludes only "\n";
//      JavaScript's also excludes "\r", U+2028 and U+2029.
//   4. An escaped character that has no escape meaning, such as `\ ` (backslash
//      space), becomes the bare character. Python reads it as that literal
//      character; JavaScript's `u` flag rejects it as an invalid escape.
//   5. A `{`, `}` or `]` that Python reads as a literal (not a quantifier or a
//      class end) is escaped, because the `u` flag rejects it bare; so is a
//      `[` inside a class, and a `]` placed first in a class. (No current
//      pattern needs this; it is here so a schema update cannot silently
//      change meaning.)
//
// Everything else is copied as is, including the schema's own flaws, because
// a file that Python accepts must be accepted here too:
//   - unanchored patterns (dates, strand) still match anywhere in the string,
//     exactly like `re.search`;
//   - `[A-z]` still admits `[ \ ] ^ _ \``, as it does in Python;
//   - the double-escaped pattern on `parasite_density` and the patterns on
//     integer fields stay; `pattern` only applies to strings, in both
//     validators, so they never run.
// Any construct this translator does not know (other escapes such as `\b`,
// backreferences, `(?P`...) aborts the build rather than guess.
//
// Two more changes that do not affect any verdict:
//   6. `description` and `title` are dropped. They are annotations, but Ajv's
//      standalone code embeds schema objects it refers to, and the
//      descriptions roughly double the size of those.
//   7. Error `schemaPath`s are made absolute. Ajv compiles each `$defs` entry
//      to its own function (inlineRefs: false keeps the code small) and
//      reports schema paths relative to that entry, e.g. `#/properties/chrom`;
//      the build rewrites them to `#/$defs/GenomicLocation/properties/chrom`.
//
// The non-standard top-level keys `metamodel_version` and `version` are
// declared to Ajv as annotation keywords instead of being removed.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Ajv2019 } from "ajv/dist/2019.js";
import standaloneCode from "ajv/dist/standalone/index.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "src/validate/generated");
const VERSIONS = ["1.0.0", "1.1.0"];

const unicode = JSON.parse(readFileSync(join(ROOT, "scripts/build-validators-unicode.json"), "utf8"));

/** Ranges as the body of a character class, e.g. `\u{30}-\u{39}\u{660}-\u{669}`. */
function classBody(ranges) {
  const hex = (cp) => `\\u{${cp.toString(16)}}`;
  return ranges.map(([a, b]) => (a === b ? hex(a) : `${hex(a)}-${hex(b)}`)).join("");
}

const PY_CLASSES = { w: classBody(unicode.w), d: classBody(unicode.d), s: classBody(unicode.s) };
// Escapes that mean the same single character in Python and JavaScript.
const SAME_CHAR_ESCAPES = new Set(["n", "r", "t", "f", "v"]);
// Characters JavaScript's `u` flag allows after a backslash as an identity escape.
const SYNTAX_CHARS = new Set([..."^$\\.*+?()[]{}|/"]);

/** Translates one Python `re` pattern to a JavaScript `u`-flag pattern with the same matches. */
export function translatePattern(py) {
  let out = "";
  let inClass = false;
  let i = 0;
  const fail = (why) => {
    throw new Error(`Cannot translate pattern ${JSON.stringify(py)} at ${i}: ${why}`);
  };
  while (i < py.length) {
    const c = py[i];
    if (c === "\\") {
      const n = py[i + 1];
      if (n === undefined) fail("trailing backslash");
      i += 2;
      if (n in PY_CLASSES) {
        out += inClass ? PY_CLASSES[n] : `[${PY_CLASSES[n]}]`; // rule 1
      } else if (SAME_CHAR_ESCAPES.has(n)) {
        out += `\\${n}`;
      } else if (/[A-Za-z0-9]/.test(n)) {
        fail(`unsupported escape \\${n}`);
      } else if (SYNTAX_CHARS.has(n) || (n === "-" && inClass)) {
        out += `\\${n}`;
      } else {
        out += n; // rule 4
      }
      continue;
    }
    if (inClass) {
      if (c === "[") out += "\\[";
      else out += c;
      if (c === "]") inClass = false;
      i += 1;
      continue;
    }
    if (c === "[") {
      inClass = true;
      out += "[";
      i += 1;
      if (py[i] === "^") {
        out += "^";
        i += 1;
      }
      if (py[i] === "]") {
        out += "\\]"; // Python: a `]` first in a class is a literal
        i += 1;
      }
      continue;
    }
    if (c === "(" && py[i + 1] === "?" && !/^\(\?(?::|=|!|<=|<!)/.test(py.slice(i))) {
      fail("unsupported group syntax");
    }
    if (c === "{") {
      const quantifier = /^\{\d+(?:,\d*)?\}/.exec(py.slice(i));
      if (quantifier) {
        out += quantifier[0];
        i += quantifier[0].length;
      } else {
        out += "\\{"; // rule 5
        i += 1;
      }
      continue;
    }
    if (c === "}" || c === "]") {
      out += `\\${c}`; // rule 5
    } else if (c === ".") {
      out += "[^\\n]"; // rule 3
    } else if (c === "$") {
      out += "(?=\\n?$)"; // rule 2
    } else {
      out += c;
    }
    i += 1;
  }
  if (inClass) fail("unterminated character class");
  return out;
}

/**
 * Returns a deep copy of `schema` with every `pattern` keyword translated.
 * Walks only schema positions, so a property that happened to be called
 * "pattern" would not be touched.
 */
function patchSchema(node) {
  if (Array.isArray(node)) return node.map(patchSchema);
  if (node === null || typeof node !== "object") return node;
  const copy = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "description" || key === "title") {
      continue; // rule 6
    } else if (key === "pattern" && typeof value === "string") {
      copy[key] = translatePattern(value);
    } else if (key === "properties" || key === "$defs") {
      copy[key] = Object.fromEntries(Object.entries(value).map(([name, sub]) => [name, patchSchema(sub)]));
    } else if (key === "items" || key === "anyOf" || key === "allOf" || key === "oneOf" || key === "not") {
      copy[key] = patchSchema(value);
    } else {
      copy[key] = value;
    }
  }
  return copy;
}

/** Collects `pattern` keywords by their JSON pointer, to report the original pattern in error messages. */
function collectPatterns(node, pointer, out) {
  if (Array.isArray(node)) {
    node.forEach((sub, index) => collectPatterns(sub, `${pointer}/${index}`, out));
    return out;
  }
  if (node === null || typeof node !== "object") return out;
  for (const [key, value] of Object.entries(node)) {
    const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
    if (key === "pattern" && typeof value === "string") out[`${pointer}/pattern`] = value;
    else collectPatterns(value, `${pointer}/${escaped}`, out);
  }
  return out;
}

/**
 * Rule 7: prefixes each function's relative `schemaPath`s with the `$defs`
 * entry that function was compiled from. Ajv records, on the root schema
 * environment, which generated function each `$ref` resolved to.
 */
function absoluteSchemaPaths(ajv, code) {
  const root = ajv.getSchema("pmo").schemaEnv;
  const prefixByFunction = new Map([[root.validateName.str, "#"]]);
  for (const [ref, env] of Object.entries(root.refs)) {
    const hash = ref.slice(ref.indexOf("#"));
    if (!/^#\/\$defs\/[A-Za-z0-9_]+$/.test(hash) || !env.validateName) {
      throw new Error(`unexpected $ref target ${ref}`);
    }
    prefixByFunction.set(env.validateName.str, hash);
  }
  const starts = [...code.matchAll(/^function (validate\d+)\(/gm)];
  if (starts.length !== prefixByFunction.size) {
    throw new Error(`expected ${prefixByFunction.size} functions, found ${starts.length}`);
  }
  let out = code.slice(0, starts[0].index);
  if (out.includes("schemaPath:")) throw new Error("schemaPath outside a function");
  starts.forEach((match, index) => {
    const prefix = prefixByFunction.get(match[1]);
    if (prefix === undefined) throw new Error(`no $defs entry for ${match[1]}`);
    const block = code.slice(match.index, starts[index + 1]?.index ?? code.length);
    out += block.replaceAll('schemaPath:"#/', `schemaPath:"${prefix}/`);
  });
  if (/schemaPath:"(?!#\/)/.test(out)) throw new Error("schemaPath in an unexpected form");
  return out;
}

function versionSlug(version) {
  return `v${version.replace(/\./g, "_")}`;
}

function build(version) {
  const source = `schemas/portable_microhaplotype_object_v${version}.schema.json`;
  const schema = JSON.parse(readFileSync(join(ROOT, source), "utf8"));
  const patched = patchSchema(schema);

  const ajv = new Ajv2019({
    allErrors: true,
    // Our own messages are written from keyword and params in
    // src/validate/schema.ts; Ajv's would only add size.
    messages: false,
    // One function per $def instead of copying GenomicLocation and friends
    // into every place that refers to them.
    inlineRefs: false,
    // The schemas put `pattern` and `minimum` on fields of the wrong type,
    // which JSON Schema ignores (and so does Python). strictTypes would
    // reject that.
    strictTypes: false,
    code: { source: true, esm: true, lines: true },
  });
  ajv.addVocabulary(["metamodel_version", "version"]);
  ajv.addSchema(patched, "pmo");
  const code = absoluteSchemaPaths(ajv, standaloneCode(ajv, { validate: "pmo" }));

  const patterns = collectPatterns(schema, "#", {});
  const slug = versionSlug(version);
  const header = `// @ts-nocheck
/* eslint-disable */
// Validator for PMO JSON Schema v${version}.
// Generated from ${source} by scripts/build-validators.mjs. Do not edit by hand.
// Patterns were translated from Python regex semantics; see that script.
`;
  const footer = `
/** Original (untranslated) schema patterns, keyed by schema path. */
export const patterns: Readonly<Record<string, string>> = ${JSON.stringify(patterns, null, 1)};
`;
  const typed = code.replace(
    /^export const validate = /m,
    "export const validate: import(\"../standalone.js\").StandaloneValidator = ",
  );
  if (typed === code) throw new Error("unexpected standalone output: no `export const validate`");
  if (/\brequire\(/.test(typed)) throw new Error("standalone output needs a runtime require()");
  return { file: join(OUT_DIR, `pmo_${slug}.ts`), text: header + typed + "\n" + footer };
}

const check = process.argv.includes("--check");
let stale = 0;
if (!check) mkdirSync(OUT_DIR, { recursive: true });
for (const version of VERSIONS) {
  const { file, text } = build(version);
  if (check) {
    let current = null;
    try {
      current = readFileSync(file, "utf8");
    } catch {
      // missing counts as stale
    }
    if (current !== text) {
      stale += 1;
      console.log(`stale: ${file}`);
    } else {
      console.log(`up to date: ${file}`);
    }
  } else {
    writeFileSync(file, text);
    console.log(`wrote ${file}`);
  }
}
if (stale > 0) process.exit(1);
