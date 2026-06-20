import { describe, it, expect } from "vitest";
import { generateCodename } from "@/lib/generateCodename";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy();
  });

  it("returns a PascalCase string with no spaces", () => {
    const codename = generateCodename();
    expect(codename).toMatch(/^[A-Z][a-zA-Z]+$/);
  });

  it("returns a codename of reasonable length (3 words combined)", () => {
    const codename = generateCodename();
    // shortest possible: 3 chars per word × 3 words = 9 chars
    expect(codename.length).toBeGreaterThanOrEqual(9);
  });

  it("returns different results across multiple calls", () => {
    const results = new Set(
      Array.from({ length: 10 }, () => generateCodename()),
    );
    // With 15^3 = 3375 combinations, 10 calls are overwhelmingly likely to differ
    expect(results.size).toBeGreaterThan(1);
  });
});
