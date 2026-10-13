import type { Testimonial } from "@/types/testimonial";

/**
 * Fictional guest notes written for this demonstration. They are not reviews from
 * real guests and must always be displayed with a demo label.
 */
export const testimonials = [
  {
    id: "t-1",
    guestDisplayName: "Elena M.",
    quote:
      "We stopped checking the time on the second day. The villa felt like it belonged to the lagoon rather than the other way round.",
    stayLabel: "Lagoon Pool Villa",
    isDemoContent: true,
  },
  {
    id: "t-2",
    guestDisplayName: "Rafael & Inês",
    quote:
      "Dinner on the sand was the most unhurried evening we have had in years — simple, beautiful and entirely ours.",
    stayLabel: "Overwater Lagoon Suite",
    isDemoContent: true,
  },
  {
    id: "t-3",
    guestDisplayName: "The Okafor family",
    quote:
      "The children snorkelled with turtles every morning and still talk about the floating breakfast.",
    stayLabel: "Palm Grove Pool Villa",
    isDemoContent: true,
  },
] as const satisfies readonly Testimonial[];
