import { describe, expect, it } from "vitest";
import type { FeeRule } from "@/data/pricing";
import { estimateStay } from "./pricing";

const noFees: FeeRule[] = [];

describe("estimateStay", () => {
  it("multiplies the nightly rate by nights", () => {
    const estimate = estimateStay({ nightlyRateMinor: 125_000, nights: 4, guests: 2 }, noFees);
    expect(estimate.roomSubtotalMinor).toBe(500_000);
    expect(estimate.totalMinor).toBe(500_000);
    expect(estimate.lines).toEqual([
      {
        id: "room",
        label: "Accommodation",
        amountMinor: 500_000,
        basis: { quantity: 4, unit: "night", unitAmountMinor: 125_000 },
      },
    ]);
  });

  it("applies the configured service charge and per-guest transfer", () => {
    // Default config: 10% service charge, $180 return transfer per guest.
    const estimate = estimateStay({ nightlyRateMinor: 98_000, nights: 3, guests: 2 });
    expect(estimate.roomSubtotalMinor).toBe(294_000);
    expect(estimate.lines.map((line) => [line.id, line.amountMinor])).toEqual([
      ["room", 294_000],
      ["service-charge", 29_400],
      ["island-transfer", 36_000],
    ]);
    expect(estimate.totalMinor).toBe(359_400);
    expect(estimate.currency).toBe("USD");
  });

  it("rounds percentage fees once, to the nearest minor unit", () => {
    const fees: FeeRule[] = [
      { id: "svc", label: "Service", kind: "percentage-of-room", basisPoints: 1_250 },
    ];
    // 12.5% of 333 = 41.625 → 42; 12.5% of 331 = 41.375 → 41
    expect(estimateStay({ nightlyRateMinor: 333, nights: 1, guests: 1 }, fees).totalMinor).toBe(
      375,
    );
    expect(estimateStay({ nightlyRateMinor: 331, nights: 1, guests: 1 }, fees).totalMinor).toBe(
      372,
    );
  });

  it("keeps every amount an integer", () => {
    const estimate = estimateStay({ nightlyRateMinor: 76_001, nights: 7, guests: 3 });
    for (const line of estimate.lines) expect(Number.isInteger(line.amountMinor)).toBe(true);
    expect(estimate.totalMinor).toBe(
      estimate.lines.reduce((sum, line) => sum + line.amountMinor, 0),
    );
  });

  it.each([
    [{ nightlyRateMinor: 100.5, nights: 1, guests: 1 }],
    [{ nightlyRateMinor: -1, nights: 1, guests: 1 }],
    [{ nightlyRateMinor: 100, nights: 0, guests: 1 }],
    [{ nightlyRateMinor: 100, nights: 1.5, guests: 1 }],
    [{ nightlyRateMinor: 100, nights: 1, guests: 0 }],
  ])("rejects invalid input %j", (input) => {
    expect(() => estimateStay(input)).toThrow(RangeError);
  });
});
