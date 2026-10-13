import { describe, expect, it } from "vitest";
import { galleryItems } from "@/data/gallery";
import { galleryCategories, getGalleryItems } from "./gallery";

describe("gallery", () => {
  it("filters by category while keeping curated order", () => {
    const ocean = getGalleryItems("ocean");
    expect(ocean.length).toBeGreaterThan(0);
    expect(ocean.every((item) => item.category === "ocean")).toBe(true);
    expect(ocean).toEqual(galleryItems.filter((item) => item.category === "ocean"));
    expect(getGalleryItems()).toHaveLength(galleryItems.length);
  });

  it("covers every item with a known category", () => {
    const total = galleryCategories.reduce((sum, c) => sum + getGalleryItems(c).length, 0);
    expect(total).toBe(galleryItems.length);
  });
});
