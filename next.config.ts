import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal links are checked against the real route tree at type-check time.
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    // All photography is bundled locally (src/assets/images); no remote hosts are allowed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
