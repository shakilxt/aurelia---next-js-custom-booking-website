import type { Metadata, Route } from "next";
import { site } from "@/data/site";

/** The default social card, served by src/app/opengraph-image.tsx. */
export const defaultSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "AURELIA, a concept resort: an infinity pool above the ocean, with the line “Where the world grows quiet”.",
} as const;

/**
 * Open Graph fields every page shares. Next.js replaces a parent's `openGraph` object,
 * including the file-based image, rather than merging it, so pages spread these in
 * alongside their own values. Residence pages override `images` with their photo.
 */
export const baseOpenGraph = {
  type: "website" as const,
  locale: "en_US",
  siteName: site.name,
  images: [defaultSocialImage],
};

interface PageMetadataInput {
  title: string;
  description: string;
  path: Route;
}

/** Per-page metadata with a canonical URL; brand defaults come from the root layout. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title, description, url: path },
  };
}
