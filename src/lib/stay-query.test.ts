import { describe, expect, it } from "vitest";
import { getAllStays } from "./stays";
import {
  applyStayQuery,
  defaultStayQuery,
  isFiltered,
  parseStayQuery,
  serializeStayQuery,
  stayLinkSearch,
  type StayQuery,
} from "./stay-query";

const stays = getAllStays();
const slugs = (query: Partial<StayQuery>) =>
  applyStayQuery(stays, { ...defaultStayQuery, ...query }).map((stay) => stay.slug);

describe("parseStayQuery", () => {
  it("falls back to defaults for missing or invalid values", () => {
    expect(parseStayQuery({})).toEqual(defaultStayQuery);
    expect(parseStayQuery({ type: "castle", guests: "0", maxRate: "-5", sort: "random" })).toEqual(
      defaultStayQuery,
    );
    expect(parseStayQuery({ guests: "13", maxRate: "12.5" })).toEqual(defaultStayQuery);
  });

  it("parses valid values", () => {
    expect(
      parseStayQuery(new URLSearchParams("type=suite&guests=3&maxRate=1250&sort=price-desc")),
    ).toEqual({
      ...defaultStayQuery,
      category: "suite",
      guests: 3,
      maxRate: 1250,
      sort: "price-desc",
    });
  });

  it("round-trips through serialisation and omits defaults", () => {
    const query: StayQuery = {
      category: "villa",
      guests: 4,
      maxRate: 2000,
      sort: "size-desc",
      checkIn: "2026-11-02" as StayQuery["checkIn"],
      checkOut: "2026-11-06" as StayQuery["checkOut"],
    };
    expect(parseStayQuery(new URLSearchParams(serializeStayQuery(query)))).toEqual(query);
    expect(serializeStayQuery(defaultStayQuery)).toBe("");
  });
});

describe("stay dates", () => {
  it("keeps a valid pair without treating it as a filter", () => {
    const query = parseStayQuery({ checkIn: "2026-11-02", checkOut: "2026-11-06" });
    expect(query).toMatchObject({ checkIn: "2026-11-02", checkOut: "2026-11-06" });
    expect(isFiltered(query)).toBe(false);
    expect(serializeStayQuery(query)).toBe("checkIn=2026-11-02&checkOut=2026-11-06");
  });

  it("drops incomplete, reversed or overlong ranges", () => {
    const dropped = { checkIn: null, checkOut: null };
    expect(parseStayQuery({ checkIn: "2026-11-02" })).toMatchObject(dropped);
    expect(parseStayQuery({ checkIn: "2026-11-06", checkOut: "2026-11-02" })).toMatchObject(
      dropped,
    );
    expect(parseStayQuery({ checkIn: "2026-11-02", checkOut: "2026-11-02" })).toMatchObject(
      dropped,
    );
    expect(parseStayQuery({ checkIn: "2026-11-01", checkOut: "2026-12-02" })).toMatchObject(
      dropped,
    );
  });

  it("builds residence links with dates and the party as adults", () => {
    const query = parseStayQuery({ guests: "3", checkIn: "2026-11-02", checkOut: "2026-11-06" });
    expect(stayLinkSearch(query)).toBe("checkIn=2026-11-02&checkOut=2026-11-06&adults=3");
    expect(stayLinkSearch(defaultStayQuery)).toBe("");
  });
});

describe("applyStayQuery", () => {
  it("returns every stay in display order by default", () => {
    expect(slugs({})).toEqual(stays.map((stay) => stay.slug));
    expect(isFiltered(defaultStayQuery)).toBe(false);
  });

  it("filters by category", () => {
    expect(slugs({ category: "bungalow" })).toEqual(["garden-bungalow", "beach-bungalow"]);
  });

  it("filters by guest capacity", () => {
    expect(slugs({ guests: 4 })).toEqual(["palm-grove-villa", "aurelia-residence"]);
    expect(slugs({ guests: 7 })).toEqual([]);
  });

  it("filters by maximum nightly rate, inclusive", () => {
    expect(slugs({ maxRate: 760 })).toEqual([
      "horizon-ocean-suite",
      "garden-bungalow",
      "beach-bungalow",
    ]);
  });

  it("combines filters", () => {
    expect(slugs({ category: "suite", guests: 3, maxRate: 1250 })).toEqual(["reef-edge-suite"]);
  });

  it("sorts by price and size", () => {
    const ascending = applyStayQuery(stays, { ...defaultStayQuery, sort: "price-asc" }).map(
      (s) => s.nightlyRateMinor,
    );
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
    expect(slugs({ sort: "price-desc" })[0]).toBe("aurelia-residence");
    expect(slugs({ sort: "size-desc" })[0]).toBe("aurelia-residence");
  });

  it("does not mutate its input", () => {
    const before = stays.map((stay) => stay.slug);
    applyStayQuery(stays, { ...defaultStayQuery, sort: "price-desc" });
    expect(stays.map((stay) => stay.slug)).toEqual(before);
  });
});
