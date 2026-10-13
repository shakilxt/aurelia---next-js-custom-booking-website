import { describe, expect, it } from "vitest";
import { parseIsoDate } from "./dates";
import {
  formatGuestCount,
  guestLimits,
  initialGuestCount,
  latestCheckIn,
  validateStaySelection,
} from "./booking";
import type { IsoDate } from "@/types/common";

const d = (value: string) => parseIsoDate(value) as IsoDate;
const today = d("2026-10-13");
const context = { capacity: 3, today };
const valid = { checkIn: d("2026-11-02"), checkOut: d("2026-11-06"), adults: 2, children: 1 };

describe("validateStaySelection", () => {
  it("accepts a valid selection and reports nights", () => {
    expect(validateStaySelection(valid, context)).toEqual({
      ok: true,
      value: { ...valid, nights: 4 },
    });
  });

  it("allows checking in today", () => {
    const res = validateStaySelection(
      { ...valid, checkIn: today, checkOut: d("2026-10-14") },
      context,
    );
    expect(res.ok).toBe(true);
  });

  it("requires both dates", () => {
    const res = validateStaySelection({ ...valid, checkIn: null, checkOut: null }, context);
    expect(res).toEqual({
      ok: false,
      errors: { checkIn: "Choose a check-in date.", checkOut: "Choose a check-out date." },
    });
  });

  it("rejects past check-in", () => {
    const res = validateStaySelection({ ...valid, checkIn: d("2026-10-12") }, context);
    expect(res.ok === false && res.errors.checkIn).toBe("Check-in can’t be in the past.");
  });

  it("rejects check-in beyond the booking horizon", () => {
    expect(latestCheckIn(today)).toBe("2028-04-13");
    const ok = validateStaySelection(
      { ...valid, checkIn: d("2028-04-13"), checkOut: d("2028-04-14") },
      context,
    );
    expect(ok.ok).toBe(true);
    const late = validateStaySelection(
      { ...valid, checkIn: d("2028-04-14"), checkOut: d("2028-04-15") },
      context,
    );
    expect(late.ok === false && late.errors.checkIn).toMatch(/on or before/);
  });

  it("requires check-out after check-in", () => {
    for (const checkOut of [d("2026-11-02"), d("2026-11-01")]) {
      const res = validateStaySelection({ ...valid, checkOut }, context);
      expect(res.ok === false && res.errors.checkOut).toBe("Check-out must be after check-in.");
    }
  });

  it("limits stay length to 30 nights", () => {
    expect(validateStaySelection({ ...valid, checkOut: d("2026-12-02") }, context).ok).toBe(true);
    const res = validateStaySelection({ ...valid, checkOut: d("2026-12-03") }, context);
    expect(res.ok === false && res.errors.checkOut).toBe("Stays can be up to 30 nights.");
  });

  it("enforces guest rules against capacity", () => {
    const cases: [number, number, string | undefined][] = [
      [0, 2, "At least one adult is required."],
      [-1, 0, "At least one adult is required."],
      [1.5, 0, "At least one adult is required."],
      [2, -1, "Enter a valid number of children."],
      [3, 1, "This residence sleeps up to 3 guests."],
      [3, 0, undefined],
      [1, 2, undefined],
    ];
    for (const [adults, children, message] of cases) {
      const res = validateStaySelection({ ...valid, adults, children }, context);
      expect(res.ok ? undefined : res.errors.guests, `${adults}+${children}`).toBe(message);
    }
  });
});

describe("guestLimits", () => {
  it("shares capacity between adults and children", () => {
    expect(guestLimits(4, { adults: 2, children: 1 })).toEqual({ maxAdults: 3, maxChildren: 2 });
    expect(guestLimits(2, { adults: 2, children: 0 })).toEqual({ maxAdults: 2, maxChildren: 0 });
  });

  it("always allows at least one adult", () => {
    expect(guestLimits(2, { adults: 1, children: 2 }).maxAdults).toBe(1);
  });
});

describe("initialGuestCount", () => {
  it("defaults to two adults, or fewer for a smaller residence", () => {
    expect(initialGuestCount(4)).toEqual({ adults: 2, children: 0 });
    expect(initialGuestCount(1)).toEqual({ adults: 1, children: 0 });
  });

  it("keeps requested counts, even above capacity, so validation can report them", () => {
    expect(initialGuestCount(2, { adults: 3, children: 1 })).toEqual({ adults: 3, children: 1 });
  });

  it("never starts below one adult or zero children", () => {
    expect(initialGuestCount(4, { adults: 0, children: -2 })).toEqual({ adults: 1, children: 0 });
  });
});

describe("formatGuestCount", () => {
  it("pluralises and omits zero children", () => {
    expect(formatGuestCount({ adults: 1, children: 0 })).toBe("1 adult");
    expect(formatGuestCount({ adults: 2, children: 1 })).toBe("2 adults, 1 child");
    expect(formatGuestCount({ adults: 2, children: 3 })).toBe("2 adults, 3 children");
  });
});
