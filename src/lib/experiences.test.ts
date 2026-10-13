import { describe, expect, it } from "vitest";
import { experienceEnquiry, getAllExperiences, getExperienceBySlug } from "./experiences";

describe("experience selectors", () => {
  it("lists experiences in display order", () => {
    const orders = getAllExperiences().map((experience) => experience.displayOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("finds experiences by slug", () => {
    expect(getExperienceBySlug("sunset-sail")?.name).toBe("Sunset sailing");
    expect(getExperienceBySlug("skydiving")).toBeUndefined();
  });

  it("writes a prefilled enquiry", () => {
    expect(experienceEnquiry({ name: "Sunset sailing" })).toBe(
      "I’d like to arrange sunset sailing during my stay.",
    );
  });
});
