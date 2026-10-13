import type { Amenity } from "@/types/amenity";

export const amenities = [
  { id: "private-pool", name: "Private pool", iconName: "waves", category: "outdoors" },
  { id: "lagoon-access", name: "Direct lagoon access", iconName: "anchor", category: "outdoors" },
  { id: "ocean-view", name: "Ocean view", iconName: "sunset", category: "outdoors" },
  { id: "garden-view", name: "Garden outlook", iconName: "trees", category: "outdoors" },
  { id: "sun-deck", name: "Sun deck with daybeds", iconName: "sun", category: "outdoors" },
  {
    id: "outdoor-shower",
    name: "Outdoor rain shower",
    iconName: "shower-head",
    category: "wellness",
  },
  { id: "soaking-tub", name: "Freestanding soaking tub", iconName: "bath", category: "wellness" },
  { id: "snorkel-gear", name: "Snorkel equipment", iconName: "fish", category: "wellness" },
  { id: "king-bed", name: "King-size bed", iconName: "bed-double", category: "residence" },
  { id: "lounge", name: "Separate living area", iconName: "sofa", category: "residence" },
  {
    id: "air-conditioning",
    name: "Air conditioning",
    iconName: "snowflake",
    category: "residence",
  },
  { id: "wifi", name: "Wi-Fi", iconName: "wifi", category: "residence" },
  { id: "espresso", name: "Espresso machine", iconName: "coffee", category: "residence" },
  { id: "minibar", name: "Curated minibar", iconName: "wine", category: "residence" },
  { id: "in-villa-dining", name: "In-residence dining", iconName: "utensils", category: "service" },
  { id: "dedicated-host", name: "Dedicated host", iconName: "concierge-bell", category: "service" },
] as const satisfies readonly Amenity[];

export type AmenityId = (typeof amenities)[number]["id"];

const amenityById = new Map<string, Amenity<AmenityId>>(amenities.map((a) => [a.id, a]));

export function getAmenity(id: AmenityId): Amenity<AmenityId> {
  const amenity = amenityById.get(id);
  // AmenityId is derived from the list above, so a miss is a programming error.
  if (!amenity) throw new Error(`Unknown amenity: ${id}`);
  return amenity;
}
