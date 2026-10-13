import { describe, expect, it } from "vitest";
import { parseBookingParams, serializeBookingParams } from "./booking-params";

describe("parseBookingParams", () => {
  it("parses a complete selection from Next.js searchParams", () => {
    expect(
      parseBookingParams({
        stay: "lagoon-pool-villa",
        checkIn: "2026-11-02",
        checkOut: "2026-11-06",
        adults: "2",
        children: "1",
      }),
    ).toEqual({
      stay: "lagoon-pool-villa",
      checkIn: "2026-11-02",
      checkOut: "2026-11-06",
      adults: 2,
      children: 1,
    });
  });

  it("parses URLSearchParams and uses the first repeated value", () => {
    expect(parseBookingParams(new URLSearchParams("stay=beach-bungalow&adults=1"))).toEqual({
      stay: "beach-bungalow",
      adults: 1,
    });
    expect(parseBookingParams({ adults: ["3", "9"] })).toEqual({ adults: 3 });
  });

  it("drops malformed or hostile values", () => {
    expect(
      parseBookingParams({
        stay: "<script>alert(1)</script>",
        checkIn: "2026-02-30",
        checkOut: "next week",
        adults: "0",
        children: "-1",
      }),
    ).toEqual({});
    expect(parseBookingParams({ adults: "2.5", children: "1e3", stay: "a".repeat(65) })).toEqual(
      {},
    );
    expect(parseBookingParams({ adults: "21", children: "99" })).toEqual({});
  });
});

describe("serializeBookingParams", () => {
  it("round-trips in a stable order", () => {
    const params = parseBookingParams({
      children: "0",
      adults: "2",
      stay: "reef-edge-suite",
      checkIn: "2026-11-02",
    });
    const query = serializeBookingParams(params);
    expect(query).toBe("stay=reef-edge-suite&checkIn=2026-11-02&adults=2&children=0");
    expect(parseBookingParams(new URLSearchParams(query))).toEqual(params);
  });

  it("omits missing values", () => {
    expect(serializeBookingParams({})).toBe("");
  });
});
