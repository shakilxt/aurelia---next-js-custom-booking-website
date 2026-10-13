import { galleryCategoryLabels, galleryItems } from "@/data/gallery";
import type { GalleryCategory, GalleryItem } from "@/types/gallery";

export const galleryCategories = Object.keys(galleryCategoryLabels) as GalleryCategory[];

/** All items, or one category's items, in curated order. */
export function getGalleryItems(category: GalleryCategory | null = null): GalleryItem[] {
  return galleryItems.filter((item) => category === null || item.category === category);
}
