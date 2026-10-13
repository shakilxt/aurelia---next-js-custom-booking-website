import type { StaticImageData } from "next/image";

/**
 * A locally bundled photograph. Static imports provide intrinsic size and a blur
 * placeholder; sources are recorded in scripts/images.manifest.json.
 */
export interface MediaAsset {
  id: string;
  src: StaticImageData;
  /** Describes the image for screen readers; empty only for purely decorative use. */
  alt: string;
}
