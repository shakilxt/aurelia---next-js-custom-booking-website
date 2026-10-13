import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

// Self-hosted by next/font at build time; no runtime request to Google Fonts or Fontshare.
// Gambetta's files are fetched by scripts/fetch-fonts.mjs (see its note on the licence).
export const serif = localFont({
  src: [
    { path: "../assets/fonts/Gambetta-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Gambetta-Italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-gambetta",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
