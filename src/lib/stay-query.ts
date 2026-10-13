import type { Accommodation, AccommodationCategory } from "@/types/accommodation";
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
}

export const defaultStayQuery: StayQuery = {
  category: null,
  guests: null,
  maxRate: null,
  sort: "recommended",
};

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
  };
}

/** Serialises non-default values only, in a stable order. */
export function serializeStayQuery(query: StayQuery): string {
  const search = new URLSearchParams();
  if (query.category) search.set("type", query.category);
  if (query.guests) search.set("guests", String(query.guests));
  if (query.maxRate) search.set("maxRate", String(query.maxRate));
  if (query.sort !== "recommended") search.set("sort", query.sort);
  return search.toString();
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
