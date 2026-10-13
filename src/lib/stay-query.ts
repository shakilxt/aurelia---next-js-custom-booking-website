import { stayRules } from "@/data/pricing";
import type { Accommodation, AccommodationCategory } from "@/types/accommodation";
import type { IsoDate } from "@/types/common";
import { serializeBookingParams } from "./booking-params";
import { nightsBetween, parseIsoDate } from "./dates";
import { majorToMinor } from "./money";
import { parseCount, readParam, type SearchParamsInput } from "./search-params";

export const staySortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "size-desc", label: "Largest first" },
] as const;

export type StaySort = (typeof staySortOptions)[number]["value"];

/** Nightly-rate ceilings offered in the price filter, in whole dollars. */
export const maxRateOptions = [750, 1250, 2000] as const;

const categories: readonly AccommodationCategory[] = ["villa", "suite", "bungalow"];
const MAX_GUESTS_FILTER = 12;

/** Filter and sort state for /stays, mirrored in the URL. */
export interface StayQuery {
  category: AccommodationCategory | null;
  guests: number | null;
  /** Maximum nightly rate in whole dollars. */
  maxRate: number | null;
  sort: StaySort;
  /**
   * Dates from the homepage search. They don't filter (there is no inventory to check)
   * but travel with the visitor to each residence's booking panel.
   */
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
}

export const defaultStayQuery: StayQuery = {
  category: null,
  guests: null,
  maxRate: null,
  sort: "recommended",
  checkIn: null,
  checkOut: null,
};

/** Keeps a date pair only when it is structurally a valid stay; otherwise drops both. */
function parseDateRange(params: SearchParamsInput) {
  const checkIn = parseIsoDate(readParam(params, "checkIn"));
  const checkOut = parseIsoDate(readParam(params, "checkOut"));
  if (!checkIn || !checkOut) return { checkIn: null, checkOut: null };
  const nights = nightsBetween(checkIn, checkOut);
  return nights >= stayRules.minNights && nights <= stayRules.maxNights
    ? { checkIn, checkOut }
    : { checkIn: null, checkOut: null };
}

function isOneOf<T extends string>(options: readonly T[], value: string | undefined): value is T {
  return value !== undefined && (options as readonly string[]).includes(value);
}

/** Tolerant parsing: unknown or malformed values fall back to the defaults. */
export function parseStayQuery(params: SearchParamsInput): StayQuery {
  const type = readParam(params, "type");
  const sort = readParam(params, "sort");
  const guests = parseCount(readParam(params, "guests"), MAX_GUESTS_FILTER);
  const maxRate = readParam(params, "maxRate");

  return {
    category: isOneOf(categories, type) ? type : null,
    guests: guests && guests >= 1 ? guests : null,
    maxRate: maxRate && /^\d{1,6}$/.test(maxRate) && Number(maxRate) > 0 ? Number(maxRate) : null,
    sort: isOneOf(
      staySortOptions.map((option) => option.value),
      sort,
    )
      ? sort
      : "recommended",
    ...parseDateRange(params),
  };
}

/** Serialises non-default values only, in a stable order. */
export function serializeStayQuery(query: StayQuery): string {
  const search = new URLSearchParams();
  if (query.category) search.set("type", query.category);
  if (query.guests) search.set("guests", String(query.guests));
  if (query.maxRate) search.set("maxRate", String(query.maxRate));
  if (query.sort !== "recommended") search.set("sort", query.sort);
  if (query.checkIn && query.checkOut) {
    search.set("checkIn", query.checkIn);
    search.set("checkOut", query.checkOut);
  }
  return search.toString();
}

/**
 * Booking selection to carry from /stays to a residence page. The listing knows only a
 * total party size, so it arrives as adults; the booking panel lets visitors split it.
 */
export function stayLinkSearch(query: StayQuery): string {
  return serializeBookingParams({
    checkIn: query.checkIn ?? undefined,
    checkOut: query.checkOut ?? undefined,
    adults: query.guests ?? undefined,
  });
}

export function isFiltered(query: StayQuery): boolean {
  return query.category !== null || query.guests !== null || query.maxRate !== null;
}

const comparators: Record<StaySort, (a: Accommodation, b: Accommodation) => number> = {
  recommended: (a, b) => a.displayOrder - b.displayOrder,
  "price-asc": (a, b) => a.nightlyRateMinor - b.nightlyRateMinor || a.displayOrder - b.displayOrder,
  "price-desc": (a, b) =>
    b.nightlyRateMinor - a.nightlyRateMinor || a.displayOrder - b.displayOrder,
  "size-desc": (a, b) => b.areaSquareMeters - a.areaSquareMeters || a.displayOrder - b.displayOrder,
};

export function applyStayQuery(stays: readonly Accommodation[], query: StayQuery): Accommodation[] {
  const maxRateMinor = query.maxRate === null ? null : majorToMinor(query.maxRate);
  return stays
    .filter(
      (stay) =>
        (query.category === null || stay.category === query.category) &&
        (query.guests === null || stay.capacity >= query.guests) &&
        (maxRateMinor === null || stay.nightlyRateMinor <= maxRateMinor),
    )
    .sort(comparators[query.sort]);
}
