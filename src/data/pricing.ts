import type { CurrencyCode, MinorUnits } from "@/types/common";

export type FeeRule =
  | {
      id: string;
      label: string;
      kind: "percentage-of-room";
      /** 1 basis point = 0.01%; 1000 = 10%. */
      basisPoints: number;
    }
  | {
      id: string;
      label: string;
      kind: "per-guest-per-stay";
      amountMinor: MinorUnits;
    };

/**
 * Demonstration pricing rules. Every fee shown in a price breakdown is defined here;
 * no tax is modelled. Totals are estimates and are always labelled as such.
 */
export const pricingConfig = {
  currency: "USD" satisfies CurrencyCode,
  locale: "en-US",
  fees: [
    {
      id: "service-charge",
      label: "Service charge (10%)",
      kind: "percentage-of-room",
      basisPoints: 1_000,
    },
    {
      id: "island-transfer",
      label: "Return island transfer",
      kind: "per-guest-per-stay",
      amountMinor: 18_000,
    },
  ] satisfies readonly FeeRule[],
} as const;

/** Booking-window rules applied to every date selection. */
export const stayRules = {
  minNights: 1,
  maxNights: 30,
  /** How far ahead check-in may be, in months from today. */
  bookingHorizonMonths: 18,
} as const;
