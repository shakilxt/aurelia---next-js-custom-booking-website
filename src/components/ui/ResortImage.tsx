import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { cx } from "@/lib/cx";

interface ResortImageProps {
  asset: MediaAsset;
  /** Required so the browser requests an appropriately sized file. */
  sizes: string;
  /** Fills a positioned parent; otherwise the intrinsic aspect ratio is used. */
  fill?: boolean;
  /** Only for the largest above-the-fold image on a page. */
  priority?: boolean;
  className?: string;
}

/**
 * Photography wrapper. A sand-coloured surface and blur placeholder sit behind every
 * image, so slow or failed loads degrade to a calm block rather than a broken icon.
 */
export function ResortImage({
  asset,
  sizes,
  fill = false,
  priority = false,
  className,
}: ResortImageProps) {
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      sizes={sizes}
      fill={fill}
      priority={priority}
      placeholder="blur"
      className={cx("bg-sand object-cover", className)}
    />
  );
}
