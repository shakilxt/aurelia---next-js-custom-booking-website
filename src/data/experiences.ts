import type { Experience } from "@/types/experience";
import { media } from "./media";

/** Curated experiences. Enquiries are demonstration-only and not connected to any service. */
export const experiences = [
  {
    id: "exp-shore-dining",
    slug: "private-shore-dining",
    name: "Private dining by the shore",
    description:
      "A table set on the sand at dusk, lit by lanterns, with a menu built around the day's catch and the island garden.",
    image: media.privateDining,
    category: "dining",
    durationLabel: "Evening · about 3 hours",
    displayOrder: 1,
  },
  {
    id: "exp-spa",
    slug: "spa-rituals",
    name: "Spa and wellness rituals",
    description:
      "Warm basalt stones, coconut oils and slow, unhurried treatments in open-air pavilions above the lagoon.",
    image: media.spaHotStone,
    category: "wellness",
    durationLabel: "60 to 120 minutes",
    displayOrder: 2,
  },
  {
    id: "exp-reef",
    slug: "reef-snorkelling",
    name: "Reef snorkelling",
    description:
      "Guided swims along the reef wall to meet turtles, parrotfish and coral gardens a short boat ride from the jetty.",
    image: media.snorkelTurtle,
    category: "ocean",
    durationLabel: "Half day",
    displayOrder: 3,
  },
  {
    id: "exp-sunset-sail",
    slug: "sunset-sail",
    name: "Sunset sailing",
    description:
      "Set out under sail in the late afternoon, anchor off a sandbank for a swim, and return as the sky turns gold.",
    image: media.sailing,
    category: "ocean",
    durationLabel: "Late afternoon · about 2.5 hours",
    displayOrder: 4,
  },
  {
    id: "exp-island-excursion",
    slug: "island-excursion",
    name: "Guided island excursion",
    description:
      "Paddle a palm-lined river by outrigger canoe, walk through village gardens and finish with a picnic on a hidden beach.",
    image: media.islandCanoe,
    category: "island",
    durationLabel: "Full day",
    displayOrder: 5,
  },
  {
    id: "exp-floating-breakfast",
    slug: "floating-breakfast",
    name: "Floating breakfast",
    description:
      "Tropical fruit, pastries and fresh juice served on a woven tray in your own pool as the morning warms up.",
    image: media.floatingBreakfast,
    category: "dining",
    durationLabel: "Morning",
    displayOrder: 6,
  },
] as const satisfies readonly Experience[];
