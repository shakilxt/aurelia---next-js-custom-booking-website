import type { ResortHighlight } from "@/types/highlight";
import type { AmenityId } from "./amenities";

export const resortHighlights = [
  {
    id: "water",
    title: "Water at every door",
    description:
      "Private pools, sun decks and steps straight into the lagoon. Every residence opens to water or a palm garden.",
    iconName: "waves",
  },
  {
    id: "reef",
    title: "A living reef",
    description:
      "Snorkel gear in each residence and guided swims along the reef wall, a short boat ride from the jetty.",
    iconName: "fish",
  },
  {
    id: "dining",
    title: "Island-grown dining",
    description:
      "Menus built around the morning catch and the resort garden, served on the sand, in your pool or on your deck.",
    iconName: "utensils",
  },
  {
    id: "hosts",
    title: "A host for every stay",
    description:
      "One dedicated host arranges transfers, dinners and excursions, so plans take a message rather than a queue.",
    iconName: "concierge-bell",
  },
] as const satisfies readonly ResortHighlight[];

/** Amenities singled out on the homepage. Availability varies by residence. */
export const homepageAmenities = [
  "outdoor-shower",
  "snorkel-gear",
  "in-villa-dining",
  "espresso",
  "air-conditioning",
  "wifi",
] as const satisfies readonly AmenityId[];
