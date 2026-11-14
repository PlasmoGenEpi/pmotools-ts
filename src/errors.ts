/**
 * Errors and warnings shared by every module.
 *
 * pmotools-python raises exceptions for bad input and reports softer problems
 * through Python's `warnings` module. Here bad input throws a {@link PmoError},
 * and softer problems go to the caller's `onWarning` callback so a UI can
 * show them.
 */

/** Structured context for an error or warning, such as the offending names. */
export type IssueDetails = Readonly<Record<string, unknown>>;

/**
 * Thrown when input cannot be turned into valid PMO data.
 *
 * `code` is stable and safe to branch on; `message` is for people and may
 * change. Codes are `"<module>/<reason>"` in kebab case, for example
 * `"panel/duplicate-target-names"`.
 */
export class PmoError extends Error {
  override readonly name = "PmoError";
  readonly code: string;
  readonly details: IssueDetails;

  constructor(code: string, message: string, details: IssueDetails = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

/** A problem that did not stop the build. Same `code` convention as {@link PmoError}. */
export interface PmoWarning {
  readonly code: string;
  readonly message: string;
  readonly details: IssueDetails;
}

/** Receives warnings as they are raised. */
export type WarningSink = (warning: PmoWarning) => void;

/** Options every builder accepts. */
export interface WarningOptions {
  /** Called once per warning. Warnings are dropped when this is omitted. */
  readonly onWarning?: WarningSink;
}

/** Reports a warning to the sink, if there is one. */
export function warn(
  sink: WarningSink | undefined,
  code: string,
  message: string,
  details: IssueDetails = {},
): void {
  sink?.({ code, message, details });
}

/**
 * Runs a builder and returns its result together with the warnings it raised.
 *
 * @example
 * const { result, warnings } = collectWarnings((onWarning) =>
 *   mergeToPmo(parts, { onWarning }),
 * );
 */
export function collectWarnings<T>(run: (onWarning: WarningSink) => T): {
  result: T;
  warnings: PmoWarning[];
} {
  const warnings: PmoWarning[] = [];
  const result = run((warning) => warnings.push(warning));
  return { result, warnings };
}
