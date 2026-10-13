import { describe, expect, it } from "vitest";
import { getAllStays, getFeaturedStays, getRelatedStays, getStayBySlug } from "./stays";

describe("stay selectors", () => {
  it("finds stays by slug", () => {
    expect(getStayBySlug("reef-edge-suite")?.name).toBe("Reef Edge Suite");
    expect(getStayBySlug("not-a-stay")).toBeUndefined();
  });

  it("returns featured stays in display order", () => {
    const featured = getFeaturedStays();
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.every((stay) => stay.featured)).toBe(true);
    expect(featured.map((s) => s.displayOrder)).toEqual(
      [...featured.map((s) => s.displayOrder)].sort((a, b) => a - b),
    );
  });

  it("relates same-category stays first and never includes the stay itself", () => {
    const stay = getStayBySlug("overwater-lagoon-suite");
    if (!stay) throw new Error("fixture missing");
    const related = getRelatedStays(stay);
    expect(related).toHaveLength(3);
    expect(related.map((s) => s.slug)).not.toContain(stay.slug);
    expect(related.slice(0, 2).every((s) => s.category === "suite")).toBe(true);
  });

  it("returns every stay from getAllStays", () => {
    expect(getAllStays()).toHaveLength(8);
  });
});
