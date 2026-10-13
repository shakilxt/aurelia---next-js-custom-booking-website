import type { NextConfig } from "next";

/**
 * Baseline security headers. A full script CSP is omitted on purpose: Next.js inlines
 * bootstrap scripts, so a meaningful policy needs per-request nonces, which would make
 * every page dynamic. These directives restrict what doesn't depend on that.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  // Internal links are checked against the real route tree at type-check time.
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    // All photography is bundled locally (src/assets/images); no remote hosts are allowed.
    formats: ["image/avif", "image/webp"],
    // 60 is used only for the hero, where scrims hide compression; 75 is the default.
    qualities: [60, 75],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
