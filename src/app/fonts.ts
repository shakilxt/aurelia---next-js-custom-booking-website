import { DM_Sans, Lora } from "next/font/google";

// Self-hosted by next/font at build time; no runtime request to Google Fonts.
// Lora is a variable font, so one file covers every weight.
export const serif = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
