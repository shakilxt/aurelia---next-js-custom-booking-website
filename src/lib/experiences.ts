import { experiences } from "@/data/experiences";
import type { Experience, ExperienceCategory } from "@/types/experience";

export const experienceCategoryLabels: Record<ExperienceCategory, string> = {
  dining: "Dining",
  wellness: "Wellness",
  ocean: "Ocean",
  island: "Island",
};

export function getAllExperiences(): Experience[] {
  return [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);
}
