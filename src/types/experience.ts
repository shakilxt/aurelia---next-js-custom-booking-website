import type { MediaAsset } from "./media";

export type ExperienceCategory = "dining" | "wellness" | "ocean" | "island";

export interface Experience {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: MediaAsset;
  category: ExperienceCategory;
  durationLabel?: string;
  displayOrder: number;
}
