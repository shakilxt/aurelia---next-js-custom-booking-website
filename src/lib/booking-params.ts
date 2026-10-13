import type { IsoDate } from "@/types/common";
import { parseIsoDate } from "./dates";
import { parseCount, readParam, type SearchParamsInput } from "./search-params";

/**
 * Booking selections carried in the URL between the detail page and /book. Only the
 * stay, dates and guest counts travel here; prices and personal details never do.
 */
export interface BookingParams {
  stay?: string;
  checkIn?: IsoDate;
  checkOut?: IsoDate;
  adults?: number;
  children?: number;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_GUESTS_PARAM = 20;

/**
 * Structural parsing only: malformed values are dropped. Rules that depend on the
 * residence or on today's date are applied later by `validateStaySelection`.
 */
export function parseBookingParams(params: SearchParamsInput): BookingParams {
  const stay = readParam(params, "stay");
  const adults = parseCount(readParam(params, "adults"), MAX_GUESTS_PARAM);
  const parsed: BookingParams = {
    stay: stay && stay.length <= 64 && SLUG.test(stay) ? stay : undefined,
    checkIn: parseIsoDate(readParam(params, "checkIn")) ?? undefined,
    checkOut: parseIsoDate(readParam(params, "checkOut")) ?? undefined,
    adults: adults && adults >= 1 ? adults : undefined,
    children: parseCount(readParam(params, "children"), MAX_GUESTS_PARAM),
  };
  return Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined),
  ) as BookingParams;
}

/** Serialises in a stable key order and omits empty values. */
export function serializeBookingParams(params: BookingParams): string {
  const search = new URLSearchParams();
  if (params.stay) search.set("stay", params.stay);
  if (params.checkIn) search.set("checkIn", params.checkIn);
  if (params.checkOut) search.set("checkOut", params.checkOut);
  if (params.adults !== undefined) search.set("adults", String(params.adults));
  if (params.children !== undefined) search.set("children", String(params.children));
  return search.toString();
}
