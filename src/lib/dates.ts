import type { IsoDate } from "@/types/common";

/*
 * Calendar-date helpers. Dates are handled as `YYYY-MM-DD` strings and converted to
 * UTC midnight only for arithmetic, so results never shift with the visitor's time
 * zone or daylight-saving changes. `new Date("2026-11-02")` is deliberately avoided:
 * it parses as UTC and displays as the previous day west of Greenwich.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

function fromUtcDate(date: Date): IsoDate {
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` as IsoDate;
}

/** Returns the value as an IsoDate if it is a real calendar date (e.g. rejects 2026-02-30). */
export function parseIsoDate(value: unknown): IsoDate | null {
  if (typeof value !== "string") return null;
  const match = ISO_DATE.exec(value);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number) as [number, number, number];
  if (year < 1970) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return valid ? (value as IsoDate) : null;
}

export function isIsoDate(value: unknown): value is IsoDate {
  return parseIsoDate(value) !== null;
}

/** Milliseconds at UTC midnight of the given calendar date. */
export function toUtcMs(date: IsoDate): number {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  return Date.UTC(year, month - 1, day);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromUtcDate(new Date(toUtcMs(date) + days * MS_PER_DAY));
}

/** Adds calendar months, clamping to the last day of shorter months (Jan 31 + 1 → Feb 28/29). */
export function addMonths(date: IsoDate, months: number): IsoDate {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  const firstOfTarget = new Date(Date.UTC(year, month - 1 + months, 1));
  const daysInTarget = new Date(
    Date.UTC(firstOfTarget.getUTCFullYear(), firstOfTarget.getUTCMonth() + 1, 0),
  ).getUTCDate();
  firstOfTarget.setUTCDate(Math.min(day, daysInTarget));
  return fromUtcDate(firstOfTarget);
}

/** Whole nights from check-in to check-out; zero or negative when the range is invalid. */
export function nightsBetween(checkIn: IsoDate, checkOut: IsoDate): number {
  return Math.round((toUtcMs(checkOut) - toUtcMs(checkIn)) / MS_PER_DAY);
}

/** ISO dates sort lexicographically, so string comparison is exact. */
export function compareIsoDates(a: IsoDate, b: IsoDate): -1 | 0 | 1 {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The visitor's local calendar date. Call this on the client only: on the server it
 * would reflect the server's time zone rather than the visitor's.
 */
export function todayIso(now: Date = new Date()): IsoDate {
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` as IsoDate;
}

const dateFormats = {
  short: new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" }),
  medium: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  long: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
} as const;

/** Formats with a fixed locale and UTC, so server and client render identical text. */
export function formatDate(date: IsoDate, style: keyof typeof dateFormats = "medium"): string {
  return dateFormats[style].format(new Date(toUtcMs(date)));
}

export function formatDateRange(checkIn: IsoDate, checkOut: IsoDate): string {
  return `${formatDate(checkIn)} – ${formatDate(checkOut)}`;
}

/**
 * Converts to a local Date at noon for calendar widgets that work with Date objects.
 * Noon keeps the calendar day stable even across daylight-saving transitions.
 */
export function isoToLocalDate(date: IsoDate): Date {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  return new Date(year, month - 1, day, 12);
}

/** The local calendar day of a Date produced by a calendar widget. */
export function localDateToIso(date: Date): IsoDate {
  return todayIso(date);
}
