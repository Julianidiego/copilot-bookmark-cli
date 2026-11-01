import { describe, expect, it, vi } from "vitest";
import { parseArgs, run, validateBookmark } from "../src/cli.js";

describe("validateBookmark", () => {
  it("accepts HTTP and HTTPS URLs", () => {
    expect(validateBookmark("https://example.com/bookmark")).toEqual({
      input: "https://example.com/bookmark",
      valid: true,
      url: "https://example.com/bookmark",
    });
  });

  it("rejects unsupported protocols", () => {
    expect(validateBookmark("javascript:alert(1)")).toMatchObject({
      valid: false,
      error: "Bookmark URL must use http or https.",
    });
  });

  it("rejects malformed URLs", () => {
    expect(validateBookmark("not a URL")).toMatchObject({
      valid: false,
      error: "Bookmark URL is not valid.",
    });
  });
});

describe("parseArgs", () => {
  it("supports multiple validation targets", () => {
    expect(parseArgs(["--validate", "https://one.test", "--validate", "https://two.test"])).toEqual({
      validate: ["https://one.test", "https://two.test"],
    });
  });

  it("requires a value for --validate", () => {
    expect(() => parseArgs(["--validate"])).toThrow("--validate requires a URL.");
  });
});

describe("run", () => {
  it("returns a failure status when a URL is invalid", () => {
    const output = { log: vi.fn(), error: vi.fn() };

    expect(run(["--validate", "not a URL"], output)).toBe(1);
    expect(output.log).toHaveBeenCalledOnce();
  });
});
