import { describe, expect, it } from "vitest";
import { accommodations } from "./accommodations";
import { amenities } from "./amenities";
import { experiences } from "./experiences";
import { galleryItems } from "./gallery";
import { media } from "./media";
import { testimonials } from "./testimonials";

const unique = (values: readonly (string | number)[]) => new Set(values).size === values.length;

describe("mock data integrity", () => {
  it("uses unique ids, slugs and display orders", () => {
    expect(unique(accommodations.map((a) => a.id))).toBe(true);
    expect(unique(accommodations.map((a) => a.slug))).toBe(true);
    expect(unique(accommodations.map((a) => a.displayOrder))).toBe(true);
    expect(unique(experiences.map((e) => e.slug))).toBe(true);
    expect(unique(amenities.map((a) => a.id))).toBe(true);
    expect(unique(Object.values(media).map((m) => m.id))).toBe(true);
  });

  it("uses URL-safe slugs", () => {
    for (const { slug } of [...accommodations, ...experiences]) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("stores prices as positive integer minor units in USD", () => {
    for (const stay of accommodations) {
      expect(Number.isInteger(stay.nightlyRateMinor), stay.slug).toBe(true);
      expect(stay.nightlyRateMinor).toBeGreaterThan(0);
      expect(stay.currency).toBe("USD");
    }
  });

  it("has sensible residence facts", () => {
    for (const stay of accommodations) {
      expect(stay.capacity, stay.slug).toBeGreaterThanOrEqual(1);
      expect(stay.bedrooms).toBeGreaterThanOrEqual(1);
      expect(stay.bathrooms).toBeGreaterThanOrEqual(1);
      expect(stay.areaSquareMeters).toBeGreaterThan(0);
      expect(stay.images.length).toBeGreaterThanOrEqual(1);
      expect(unique(stay.amenities)).toBe(true);
    }
  });

  it("covers every accommodation category", () => {
    expect(new Set(accommodations.map((a) => a.category))).toEqual(
      new Set(["villa", "suite", "bungalow"]),
    );
  });

  it("describes every image", () => {
    for (const asset of Object.values(media)) {
      expect(asset.alt.length, asset.id).toBeGreaterThan(20);
    }
    for (const item of galleryItems) expect(item.asset.alt).not.toBe("");
  });

  it("marks every testimonial as demo content", () => {
    expect(testimonials.every((t) => t.isDemoContent === true)).toBe(true);
  });
});
