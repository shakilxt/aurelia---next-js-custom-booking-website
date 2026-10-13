import type { AmenityId } from "@/data/amenities";
import type { CurrencyCode, MinorUnits } from "./common";
import type { MediaAsset } from "./media";

export type AccommodationCategory = "villa" | "suite" | "bungalow";

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  category: AccommodationCategory;
  shortDescription: string;
  description: string;
  /** First image is the cover used on cards. */
  images: readonly [MediaAsset, ...MediaAsset[]];
  /** Maximum total guests (adults and children). */
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  bedConfiguration: string;
  areaSquareMeters: number;
  nightlyRateMinor: MinorUnits;
  currency: CurrencyCode;
  amenities: readonly AmenityId[];
  featured: boolean;
  displayOrder: number;
}
