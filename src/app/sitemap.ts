import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getAllStays } from "@/lib/stays";

const staticRoutes = ["/", "/stays", "/experiences", "/gallery", "/about", "/contact", "/book"];

/** Every public page. No `lastModified`: there is no content history to report honestly. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();
  return [
    ...staticRoutes.map((path) => ({ url: url(path) })),
    ...getAllStays().map((stay) => ({ url: url(`/stays/${stay.slug}`) })),
  ];
}
