#!/usr/bin/env node

import { parseArgs, validateBookmark } from "./lib/bookmarks.js";

export interface CliOutput {
  /** Write a normal command result. */
  log(message: string): void;
  /** Write a command error. */
  error(message: string): void;
}

export { parseArgs, validateBookmark } from "./lib/bookmarks.js";
export type { ParsedArgs, ValidationResult } from "./lib/bookmarks.js";

/**
 * Execute the bookmark validation command.
 *
 * @param args - Command-line arguments excluding the executable and script path.
 * @param output - The output sink used for command results and errors.
 * @returns `0` for valid input, `1` for invalid bookmarks, or `2` for usage errors.
 */
export function run(args: string[], output: CliOutput = console): number {
  let parsed: ReturnType<typeof parseArgs>;

  try {
    parsed = parseArgs(args);
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 2;
  }

  if (parsed.validate.length === 0) {
    output.error("Usage: mona-bookmarks --validate <url> [--validate <url> ...]");
    return 2;
  }

  const results = parsed.validate.map(validateBookmark);
  output.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));
  return results.every((result) => result.valid) ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = run(process.argv.slice(2));
}
