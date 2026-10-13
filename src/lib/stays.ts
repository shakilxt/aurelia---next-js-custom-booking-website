import { accommodations } from "@/data/accommodations";
import type { Accommodation, AccommodationCategory } from "@/types/accommodation";

export const categoryLabels: Record<AccommodationCategory, { singular: string; plural: string }> = {
  villa: { singular: "Villa", plural: "Villas" },
  suite: { singular: "Suite", plural: "Suites" },
  bungalow: { singular: "Bungalow", plural: "Bungalows" },
};

const byDisplayOrder = (a: Accommodation, b: Accommodation) => a.displayOrder - b.displayOrder;

export function getAllStays(): Accommodation[] {
  return [...accommodations].sort(byDisplayOrder);
}

export function getStayBySlug(slug: string): Accommodation | undefined {
  return accommodations.find((stay) => stay.slug === slug);
}

export function getFeaturedStays(): Accommodation[] {
  return getAllStays().filter((stay) => stay.featured);
}

/** Same-category stays first, then the closest in nightly rate. */
export function getRelatedStays(stay: Accommodation, limit = 3): Accommodation[] {
  const rateDistance = (other: Accommodation) =>
    Math.abs(other.nightlyRateMinor - stay.nightlyRateMinor);
  return getAllStays()
    .filter((other) => other.slug !== stay.slug)
    .sort((a, b) => {
      const categoryRank =
        Number(b.category === stay.category) - Number(a.category === stay.category);
      return categoryRank || rateDistance(a) - rateDistance(b) || byDisplayOrder(a, b);
    })
    .slice(0, limit);
}
