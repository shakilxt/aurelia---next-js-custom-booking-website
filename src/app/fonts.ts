import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// Self-hosted by next/font at build time; no runtime request to Google Fonts.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
