import { describe, expect, it } from "vitest";
import type { IsoDate } from "@/types/common";
import {
  addDays,
  addMonths,
  compareIsoDates,
  formatDate,
  formatDateRange,
  nightsBetween,
  parseIsoDate,
  todayIso,
} from "./dates";

const d = (value: string) => {
  const parsed = parseIsoDate(value);
  if (!parsed) throw new Error(`invalid test date ${value}`);
  return parsed;
};

describe("parseIsoDate", () => {
  it.each(["2026-11-02", "2028-02-29", "2026-12-31"])("accepts %s", (value) => {
    expect(parseIsoDate(value)).toBe(value);
  });

  it.each([
    "2026-02-29", // not a leap year
    "2026-02-30",
    "2026-13-01",
    "2026-00-10",
    "2026-1-2",
    "2026-11-02T00:00:00Z",
    " 2026-11-02",
    "1969-12-31",
    "",
    "tomorrow",
  ])("rejects %j", (value) => {
    expect(parseIsoDate(value)).toBeNull();
  });

  it("rejects non-strings", () => {
    expect(parseIsoDate(20261102)).toBeNull();
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate(["2026-11-02"])).toBeNull();
  });
});

describe("nightsBetween", () => {
  it("counts nights within a month", () => {
    expect(nightsBetween(d("2026-11-02"), d("2026-11-06"))).toBe(4);
  });

  it("crosses month and year boundaries", () => {
    expect(nightsBetween(d("2026-10-30"), d("2026-11-02"))).toBe(3);
    expect(nightsBetween(d("2026-12-30"), d("2027-01-02"))).toBe(3);
  });

  it("includes leap days", () => {
    expect(nightsBetween(d("2028-02-27"), d("2028-03-01"))).toBe(3);
    expect(nightsBetween(d("2027-02-27"), d("2027-03-01"))).toBe(2);
  });

  it("is unaffected by daylight-saving transitions", () => {
    // US and EU clocks change within these ranges; calendar nights must not.
    expect(nightsBetween(d("2026-03-07"), d("2026-03-09"))).toBe(2);
    expect(nightsBetween(d("2026-10-24"), d("2026-10-26"))).toBe(2);
    expect(nightsBetween(d("2026-10-31"), d("2026-11-02"))).toBe(2);
  });

  it("returns zero or negative for invalid ranges", () => {
    expect(nightsBetween(d("2026-11-02"), d("2026-11-02"))).toBe(0);
    expect(nightsBetween(d("2026-11-06"), d("2026-11-02"))).toBe(-4);
  });
});

describe("addDays / addMonths", () => {
  it("adds days across boundaries", () => {
    expect(addDays(d("2026-12-31"), 1)).toBe("2027-01-01");
    expect(addDays(d("2028-02-28"), 1)).toBe("2028-02-29");
    expect(addDays(d("2026-03-01"), -1)).toBe("2026-02-28");
  });

  it("clamps month-end dates", () => {
    expect(addMonths(d("2026-01-31"), 1)).toBe("2026-02-28");
    expect(addMonths(d("2027-08-31"), 6)).toBe("2028-02-29");
    expect(addMonths(d("2026-10-13"), 18)).toBe("2028-04-13");
  });
});

describe("compareIsoDates", () => {
  it("orders calendar dates", () => {
    expect(compareIsoDates(d("2026-11-02"), d("2026-11-10"))).toBe(-1);
    expect(compareIsoDates(d("2027-01-01"), d("2026-12-31"))).toBe(1);
    expect(compareIsoDates(d("2026-11-02"), d("2026-11-02"))).toBe(0);
  });
});

describe("todayIso", () => {
  it("uses the local calendar date of the given instant", () => {
    expect(todayIso(new Date(2026, 9, 13, 23, 59))).toBe("2026-10-13");
    expect(todayIso(new Date(2027, 0, 1, 0, 0))).toBe("2027-01-01");
  });
});

describe("formatting", () => {
  it("formats without shifting the calendar date", () => {
    expect(formatDate(d("2026-11-02"))).toBe("Mon, Nov 2, 2026");
    expect(formatDate(d("2026-11-02"), "short")).toBe("Nov 2");
    expect(formatDate(d("2026-11-02"), "long")).toBe("Monday, November 2, 2026");
  });

  it("formats a range", () => {
    expect(formatDateRange(d("2026-12-30"), d("2027-01-02"))).toBe(
      "Wed, Dec 30, 2026 – Sat, Jan 2, 2027",
    );
  });

  it("brands only validated values", () => {
    const value: IsoDate | null = parseIsoDate("2026-11-02");
    expect(value).not.toBeNull();
  });
});
