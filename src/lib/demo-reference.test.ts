import { describe, expect, it } from "vitest";
import { createDemoReference } from "./demo-reference";

describe("createDemoReference", () => {
  it("produces a labelled, unambiguous reference", () => {
    for (let i = 0; i < 200; i += 1) {
      expect(createDemoReference()).toMatch(/^AUR-DEMO-[A-HJKMNP-Z2-9]{6}$/);
    }
  });

  it("skips bytes that would bias the distribution", () => {
    const sequences = [
      [255, 250, 248, 0, 1, 2],
      [3, 4, 5, 6, 7, 8],
    ];
    const random = (bytes: Uint8Array) => {
      bytes.set(sequences.shift() ?? [9, 9, 9, 9, 9, 9]);
      return bytes;
    };
    expect(createDemoReference(random)).toBe("AUR-DEMO-ABCDEF");
  });
});
