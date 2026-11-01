#!/usr/bin/env node

export interface ValidationResult {
  input: string;
  valid: boolean;
  url?: string;
  error?: string;
}

export interface CliOutput {
  log(message: string): void;
  error(message: string): void;
}

export function validateBookmark(value: string): ValidationResult {
  const input = value.trim();

  if (!input) {
    return { input: value, valid: false, error: "Bookmark URL must not be empty." };
  }

  try {
    const url = new URL(input);

    if (!["http:", "https:"].includes(url.protocol)) {
      return {
        input: value,
        valid: false,
        error: "Bookmark URL must use http or https.",
      };
    }

    return { input: value, valid: true, url: url.toString() };
  } catch {
    return { input: value, valid: false, error: "Bookmark URL is not valid." };
  }
}

export function parseArgs(args: string[]): { validate: string[] } {
  const validate: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--validate") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("--validate requires a URL.");
      }
      validate.push(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  return { validate };
}

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
