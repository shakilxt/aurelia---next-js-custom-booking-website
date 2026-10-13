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

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((experience) => experience.slug === slug);
}

/** Message used to prefill the contact form from an experience's call to action. */
export function experienceEnquiry(experience: Pick<Experience, "name">): string {
  return `I’d like to arrange ${experience.name.toLowerCase()} during my stay.`;
}
