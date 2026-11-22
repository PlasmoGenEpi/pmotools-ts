/**
 * `JSON.stringify` in pieces, for values too large to write as one string.
 *
 * The output, joined, is exactly what `JSON.stringify(value, null, indent)`
 * gives. Large arrays and plain objects are walked here; every part small
 * enough is handed to `JSON.stringify` and indented to where it sits, so the
 * rules for strings, numbers, `toJSON`, skipped properties and so on are the
 * engine's own.
 */

/** Containers with more values than this are walked here rather than handed to `JSON.stringify` whole. */
const DEFAULT_NODE_LIMIT = 50_000;

/** Pieces are given out once they reach about this many characters. */
const DEFAULT_PIECE_LENGTH = 1 << 20;

/** Tuning for tests; the defaults suit real PMOs. */
export interface JsonChunkTuning {
  readonly nodeLimit?: number;
  readonly pieceLength?: number;
}

/** The indent `JSON.stringify` uses for its `space` argument. */
function gapOf(indent: number | string): string {
  if (typeof indent === "string") return indent.slice(0, 10);
  const spaces = Math.min(10, Math.trunc(indent));
  return spaces >= 1 ? " ".repeat(spaces) : "";
}

function hasToJson(value: object): boolean {
  return "toJSON" in value && typeof value.toJSON === "function";
}

/** An array, or an object with no prototype but `Object.prototype` (or none), and no `toJSON`. */
function isWalkable(value: unknown): value is object {
  if (typeof value !== "object" || value === null || hasToJson(value)) return false;
  if (Array.isArray(value)) return true;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** True when `value` holds more than `limit` values, counting containers and their contents. Stops counting at the limit. */
function exceeds(value: unknown, limit: number): boolean {
  const pending: unknown[] = [value];
  let count = 0;
  while (pending.length > 0) {
    const next = pending.pop();
    count += 1;
    if (count > limit) return true;
    if (isWalkable(next)) {
      for (const inner of Object.values(next)) {
        if (typeof inner === "object" && inner !== null) pending.push(inner);
        else count += 1;
      }
    }
  }
  return false;
}

/** Collects text and hands it out in pieces of about `pieceLength` characters. */
class Pieces {
  private parts: string[] = [];
  private length = 0;

  constructor(private readonly pieceLength: number) {}

  add(text: string): void {
    this.parts.push(text);
    this.length += text.length;
  }

  get full(): boolean {
    return this.length >= this.pieceLength;
  }

  take(): string {
    const text = this.parts.join("");
    this.parts = [];
    this.length = 0;
    return text;
  }
}

/**
 * The pieces of `JSON.stringify(value, null, indent)`. Returns nothing when
 * `JSON.stringify` would give `undefined`, and throws what it would throw
 * (a `TypeError` for a cycle or a `BigInt`), as the pieces are taken.
 */
export function* jsonChunks(
  value: unknown,
  indent: number | string,
  tuning: JsonChunkTuning = {},
): Generator<string, void, undefined> {
  const gap = gapOf(indent);
  const nodeLimit = tuning.nodeLimit ?? DEFAULT_NODE_LIMIT;
  const pieces = new Pieces(tuning.pieceLength ?? DEFAULT_PIECE_LENGTH);
  const ancestors = new Set<object>();

  const isLarge = (inner: unknown): inner is object => isWalkable(inner) && exceeds(inner, nodeLimit);

  /**
   * `JSON.stringify` of a small value found under `key`, indented to `depth`.
   * Below the top, a value with `toJSON` is written inside a one-property
   * holder, so `toJSON` is called with its key as `JSON.stringify` would
   * call it.
   */
  const small = (inner: unknown, key: string, depth: number): string | undefined => {
    let text: string | undefined;
    let indentBy = depth;
    if (depth > 0 && typeof inner === "object" && inner !== null && hasToJson(inner)) {
      const holder = JSON.stringify({ [key]: inner }, null, gap);
      const prefix = `{${gap === "" ? "" : `\n${gap}`}${JSON.stringify(key)}${gap === "" ? ":" : ": "}`;
      const suffix = gap === "" ? "}" : "\n}";
      text = holder.startsWith(prefix) ? holder.slice(prefix.length, holder.length - suffix.length) : undefined;
      indentBy = depth - 1;
    } else {
      text = JSON.stringify(inner, null, gap);
    }
    if (text === undefined || gap === "" || indentBy <= 0) return text;
    return text.replaceAll("\n", `\n${gap.repeat(indentBy)}`);
  };

  function* walk(container: object, depth: number): Generator<string, void, undefined> {
    if (ancestors.has(container)) throw new TypeError("Converting circular structure to JSON");
    ancestors.add(container);
    const open = gap === "" ? "" : `\n${gap.repeat(depth + 1)}`;
    const close = gap === "" ? "" : `\n${gap.repeat(depth)}`;
    if (Array.isArray(container)) {
      const items: readonly unknown[] = container;
      pieces.add("[");
      for (let index = 0; index < items.length; index += 1) {
        pieces.add(index === 0 ? open : `,${open}`);
        const item = items[index];
        if (isLarge(item)) yield* walk(item, depth + 1);
        else pieces.add(small(item, String(index), depth + 1) ?? "null");
        if (pieces.full) yield pieces.take();
      }
      // A large array is never empty.
      pieces.add(`${close}]`);
    } else {
      pieces.add("{");
      let first = true;
      for (const [key, inner] of Object.entries(container)) {
        const name = `${first ? open : `,${open}`}${JSON.stringify(key)}${gap === "" ? ":" : ": "}`;
        if (isLarge(inner)) {
          pieces.add(name);
          yield* walk(inner, depth + 1);
        } else {
          const text = small(inner, key, depth + 1);
          if (text === undefined) continue;
          pieces.add(name + text);
        }
        first = false;
        if (pieces.full) yield pieces.take();
      }
      pieces.add(first ? "}" : `${close}}`);
    }
    ancestors.delete(container);
  }

  if (isLarge(value)) {
    yield* walk(value, 0);
    yield pieces.take();
    return;
  }
  const text = small(value, "", 0);
  if (text !== undefined) yield text;
}
