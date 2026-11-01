export interface ValidationResult {
  input: string;
  valid: boolean;
  url?: string;
  error?: string;
}

const supportedProtocols = new Set(["http:", "https:"]);
const domainLabelPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

function invalidResult(input: string, error: string): ValidationResult {
  return { input, valid: false, error };
}

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function hasSupportedProtocol(url: URL): boolean {
  return supportedProtocols.has(url.protocol);
}

export function isValidDomain(value: string): boolean {
  const domain = value.endsWith(".") ? value.slice(0, -1) : value;
  const labels = domain.split(".");

  if (labels.length < 2 || domain.length > 253) {
    return false;
  }

  if (labels.every((label) => /^\d+$/.test(label))) {
    return false;
  }

  return labels.every((label) => domainLabelPattern.test(label));
}

export function validateBookmark(value: string): ValidationResult {
  const input = value.trim();

  if (!input) {
    return invalidResult(value, "Bookmark URL must not be empty.");
  }

  const url = parseUrl(input);
  if (!url) {
    return invalidResult(value, "Bookmark URL is not valid.");
  }

  if (!hasSupportedProtocol(url)) {
    return invalidResult(value, "Bookmark URL must use http or https.");
  }

  return { input: value, valid: true, url: url.toString() };
}

export function parseArgs(args: string[]): { validate: string[] } {
  const validate: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument !== "--validate") {
      throw new Error(`Unknown option: ${argument}`);
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error("--validate requires a URL.");
    }

    validate.push(value);
    index += 1;
  }

  return { validate };
}
