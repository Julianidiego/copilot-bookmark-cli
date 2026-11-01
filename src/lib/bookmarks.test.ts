import { describe, expect, it } from "vitest";
import { isValidDomain } from "./bookmarks.js";

describe("isValidDomain", () => {
  it("accepts valid domain names", () => {
    expect(isValidDomain("example.com")).toBe(true);
    expect(isValidDomain("subdomain.example.co.uk")).toBe(true);
    expect(isValidDomain("example.com.")).toBe(true);
  });

  it("rejects URLs and IP addresses", () => {
    expect(isValidDomain("https://example.com")).toBe(false);
    expect(isValidDomain("192.168.1.1")).toBe(false);
  });

  it("rejects malformed domain names", () => {
    expect(isValidDomain("example")).toBe(false);
    expect(isValidDomain("-example.com")).toBe(false);
    expect(isValidDomain("example-.com")).toBe(false);
    expect(isValidDomain("example..com")).toBe(false);
    expect(isValidDomain("example .com")).toBe(false);
  });
});
