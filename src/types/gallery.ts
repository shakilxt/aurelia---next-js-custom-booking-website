import type { MediaAsset } from "./media";

export type GalleryCategory = "residences" | "ocean" | "dining-wellness" | "island";

export interface GalleryItem {
  asset: MediaAsset;
  category: GalleryCategory;
}
