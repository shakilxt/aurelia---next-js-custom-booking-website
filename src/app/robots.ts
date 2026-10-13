import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** Indexable in production; Vercel preview deployments ask crawlers to stay away. */
export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production";
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
