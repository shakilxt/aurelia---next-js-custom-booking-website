declare const isoDateBrand: unique symbol;

/**
 * A calendar date in `YYYY-MM-DD` form with no time or time zone. Branded so that
 * arbitrary strings must pass through `parseIsoDate` before use.
 */
export type IsoDate = string & { readonly [isoDateBrand]: true };

/** An integer amount in the currency's minor unit (cents for USD). */
export type MinorUnits = number;

/** The single display currency used across the demo. */
export type CurrencyCode = "USD";
