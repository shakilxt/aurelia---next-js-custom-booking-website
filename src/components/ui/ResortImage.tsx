import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { cx } from "@/lib/cx";

interface ResortImageProps {
  asset: MediaAsset;
  /** Required so the browser requests an appropriately sized file. */
  sizes: string;
  /** Fills a positioned parent; otherwise the intrinsic aspect ratio is used. */
  fill?: boolean;
  /**
   * For the largest above-the-fold image on a page: loads eagerly with high fetch
   * priority (Next.js 16 deprecates the `priority` prop in favour of these).
   */
  aboveTheFold?: boolean;
  /** Encoder quality; must be listed in `images.qualities` in next.config.ts. */
  quality?: 60 | 75;
  className?: string;
}

/**
 * Photography wrapper. A mist-coloured surface sits behind every image, so slow or
 * failed loads degrade to a calm block rather than a broken icon. Lazy images also get
 * a blur placeholder; above-the-fold images skip it, because next/image paints it as an
 * SVG Gaussian blur that is expensive at full-viewport size (measured: ~700 ms of
 * main-thread time on the hero without GPU raster), and they arrive quickly anyway.
 */
export function ResortImage({
  asset,
  sizes,
  fill = false,
  aboveTheFold = false,
  quality = 75,
  className,
}: ResortImageProps) {
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      sizes={sizes}
      fill={fill}
      loading={aboveTheFold ? "eager" : "lazy"}
      fetchPriority={aboveTheFold ? "high" : "auto"}
      quality={quality}
      placeholder={aboveTheFold ? "empty" : "blur"}
      className={cx("bg-mist object-cover", className)}
    />
  );
}
