import type { NavItem } from "@/types/navigation";

/**
 * Brand and contact details. AURELIA is a fictional concept: the email uses the
 * reserved `.example` domain and the phone number sits in the 555-01xx range
 * reserved for fictional use.
 */
export const site = {
  name: "AURELIA",
  tagline: "Resort & Retreats",
  title: "AURELIA — Luxury Tropical Resort & Retreats",
  description:
    "A concept island resort of pool villas, ocean suites and garden bungalows in the South Pacific. A frontend portfolio demonstration with simulated booking.",
  location: "A fictional island in the South Pacific",
  contact: {
    email: "reservations@aurelia.example",
    phone: "+1 (555) 010-0142",
    hours: "Daily, 8:00–20:00 island time",
  },
  disclaimer:
    "AURELIA is a fictional resort created as a frontend portfolio demonstration. Prices, availability and guest notes are illustrative, and no reservations or enquiries are transmitted.",
} as const;

export const primaryNav: readonly NavItem[] = [
  { label: "Stays", href: "/stays" },
  { label: "Experiences", href: "/experiences" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const bookingCta = {
  label: "Plan your stay",
  href: "/book",
} as const satisfies NavItem;

export const footerNav: readonly {
  title: string;
  items: readonly NavItem[];
}[] = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "Stays", href: "/stays" },
      { label: "Experiences", href: "/experiences" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Resort",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Booking demo", href: "/book" },
    ],
  },
];
