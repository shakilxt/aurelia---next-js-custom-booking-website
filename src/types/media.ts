import type { StaticImageData } from "next/image";

/** A locally bundled photograph. Static imports provide intrinsic size and a blur placeholder. */
export interface MediaAsset {
  id: string;
  src: StaticImageData;
  /** Describes the image for screen readers; empty only for purely decorative use. */
  alt: string;
  credit?: {
    photographer: string;
    sourceUrl: string;
  };
}
