import type { GalleryItem } from "@/types/gallery";
import { media } from "./media";

export const galleryCategoryLabels = {
  residences: "Residences",
  ocean: "Lagoon & ocean",
  "dining-wellness": "Dining & wellness",
  island: "Island life",
} as const;

export const galleryItems = [
  { asset: media.heroInfinityPool, category: "residences" },
  { asset: media.overwaterAerial, category: "ocean" },
  { asset: media.groveVillaBedroom, category: "residences" },
  { asset: media.beachSunrise, category: "ocean" },
  { asset: media.waterGarden, category: "island" },
  { asset: media.privateDining, category: "dining-wellness" },
  { asset: media.lagoonVillaDeck, category: "residences" },
  { asset: media.reefGarden, category: "ocean" },
  { asset: media.spaMassage, category: "dining-wellness" },
  { asset: media.palmShore, category: "island" },
  { asset: media.cabanasDusk, category: "residences" },
  { asset: media.lagoonAerial, category: "ocean" },
  { asset: media.lagoonVillaBath, category: "residences" },
  { asset: media.chefPlate, category: "dining-wellness" },
  { asset: media.jungleAerial, category: "island" },
  { asset: media.quietCove, category: "ocean" },
  { asset: media.groveVillaVeranda, category: "residences" },
  { asset: media.palmPoolReflection, category: "island" },
  { asset: media.reefCoastAerial, category: "ocean" },
  { asset: media.floatingBreakfast, category: "dining-wellness" },
] as const satisfies readonly GalleryItem[];
