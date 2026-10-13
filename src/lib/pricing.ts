import { pricingConfig, type FeeRule } from "@/data/pricing";
import type { CurrencyCode, MinorUnits } from "@/types/common";

export interface PriceLine {
  id: string;
  label: string;
  amountMinor: MinorUnits;
  /** Present when the line is a unit price multiplied by a quantity. */
  basis?: { quantity: number; unit: "night" | "guest"; unitAmountMinor: MinorUnits };
}

export interface StayEstimate {
  currency: CurrencyCode;
  nights: number;
  guests: number;
  roomSubtotalMinor: MinorUnits;
  /** Room line first, followed by each configured fee. */
  lines: PriceLine[];
  totalMinor: MinorUnits;
}

interface EstimateInput {
  nightlyRateMinor: MinorUnits;
  nights: number;
  guests: number;
}

function assertCount(name: string, value: number, min: number) {
  if (!Number.isInteger(value) || value < min) {
    throw new RangeError(`${name} must be an integer of at least ${min}; received ${value}`);
  }
}

function feeLine(rule: FeeRule, roomSubtotalMinor: MinorUnits, guests: number): PriceLine {
  switch (rule.kind) {
    case "percentage-of-room":
      // Rounded once per line to the nearest minor unit (half away from zero).
      return {
        id: rule.id,
        label: rule.label,
        amountMinor: Math.round((roomSubtotalMinor * rule.basisPoints) / 10_000),
      };
    case "per-guest-per-stay":
      return {
        id: rule.id,
        label: rule.label,
        amountMinor: rule.amountMinor * guests,
        basis: { quantity: guests, unit: "guest", unitAmountMinor: rule.amountMinor },
      };
  }
}

/**
 * The single source of truth for estimated stay prices. All arithmetic is on integer
 * minor units; totals are never read back from URLs or form state.
 */
export function estimateStay(
  { nightlyRateMinor, nights, guests }: EstimateInput,
  fees: readonly FeeRule[] = pricingConfig.fees,
): StayEstimate {
  assertCount("nightlyRateMinor", nightlyRateMinor, 0);
  assertCount("nights", nights, 1);
  assertCount("guests", guests, 1);

  const roomSubtotalMinor = nightlyRateMinor * nights;
  const lines: PriceLine[] = [
    {
      id: "room",
      label: "Accommodation",
      amountMinor: roomSubtotalMinor,
      basis: { quantity: nights, unit: "night", unitAmountMinor: nightlyRateMinor },
    },
    ...fees.map((rule) => feeLine(rule, roomSubtotalMinor, guests)),
  ];

  return {
    currency: pricingConfig.currency,
    nights,
    guests,
    roomSubtotalMinor,
    lines,
    totalMinor: lines.reduce((sum, line) => sum + line.amountMinor, 0),
  };
}
