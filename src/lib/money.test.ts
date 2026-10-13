import { describe, expect, it } from "vitest";
import { formatMoney, majorToMinor } from "./money";

describe("formatMoney", () => {
  it("omits cents for whole amounts", () => {
    expect(formatMoney(125_000)).toBe("$1,250");
    expect(formatMoney(0)).toBe("$0");
  });

  it("shows cents otherwise", () => {
    expect(formatMoney(98_050)).toBe("$980.50");
    expect(formatMoney(1)).toBe("$0.01");
  });

  it("rejects fractional minor units", () => {
    expect(() => formatMoney(10.5)).toThrow(RangeError);
  });
});

describe("majorToMinor", () => {
  it("converts without floating-point drift", () => {
    expect(majorToMinor(1250)).toBe(125_000);
    expect(majorToMinor(0.1 + 0.2)).toBe(30);
  });
});
