/**
 * Absolute base URL used for canonical links and Open Graph metadata.
 * Prefers an explicit setting, then Vercel's production domain, then localhost.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return new URL(`https://${vercelHost}`);

  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
