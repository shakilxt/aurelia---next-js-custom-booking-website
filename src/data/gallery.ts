import type { GalleryItem } from "@/types/gallery";
import { media } from "./media";

export const galleryCategoryLabels = {
  residences: "Residences",
  ocean: "Lagoon & ocean",
  "dining-wellness": "Dining & wellness",
  island: "Island life",
} as const;

// Order matters: the gallery is a CSS multi-column layout, which fills each column
// top to bottom. This order, chosen with every photo's aspect ratio, ends the columns
// level at both three and two columns; re-check the balance when adding photos.
export const galleryItems = [
  { asset: media.heroInfinityPool, category: "residences" },
  { asset: media.privateDining, category: "dining-wellness" },
  { asset: media.overwaterAerial, category: "ocean" },
  { asset: media.chefPlate, category: "dining-wellness" },
  { asset: media.jungleAerial, category: "island" },
  { asset: media.floatingBreakfast, category: "dining-wellness" },
  { asset: media.groveVillaBedroom, category: "residences" },
  { asset: media.lagoonAerial, category: "ocean" },
  { asset: media.groveVillaVeranda, category: "residences" },
  { asset: media.spaFlowerBath, category: "dining-wellness" },
  { asset: media.reefCoastAerial, category: "ocean" },
  { asset: media.waterGarden, category: "island" },
  { asset: media.beachSunrise, category: "ocean" },
  { asset: media.palmPoolReflection, category: "island" },
  { asset: media.lagoonVillaPool, category: "residences" },
  { asset: media.reefGarden, category: "ocean" },
  { asset: media.cabanasDusk, category: "residences" },
  { asset: media.quietCove, category: "ocean" },
  { asset: media.lagoonVillaBath, category: "residences" },
  { asset: media.palmShore, category: "island" },
] as const satisfies readonly GalleryItem[];
