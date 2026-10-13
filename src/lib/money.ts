import type { CurrencyCode, MinorUnits } from "@/types/common";

const MINOR_PER_MAJOR = 100;
const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: CurrencyCode, fractionDigits: 0 | 2) {
  const key = `${currency}:${fractionDigits}`;
  let instance = formatters.get(key);
  if (!instance) {
    instance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    formatters.set(key, instance);
  }
  return instance;
}

/** Formats integer minor units; whole amounts omit cents ($1,250 rather than $1,250.00). */
export function formatMoney(amountMinor: MinorUnits, currency: CurrencyCode = "USD"): string {
  if (!Number.isInteger(amountMinor))
    throw new RangeError(`Expected integer minor units, got ${amountMinor}`);
  const digits = amountMinor % MINOR_PER_MAJOR === 0 ? 0 : 2;
  return formatter(currency, digits).format(amountMinor / MINOR_PER_MAJOR);
}

/** Converts whole major units (e.g. dollars from a URL filter) to minor units. */
export function majorToMinor(amountMajor: number): MinorUnits {
  return Math.round(amountMajor * MINOR_PER_MAJOR);
}
