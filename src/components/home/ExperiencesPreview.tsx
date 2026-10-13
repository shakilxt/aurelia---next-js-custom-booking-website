import type { Experience } from "@/types/experience";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLink } from "./SectionLink";

export function ExperiencesPreview({ experiences }: { experiences: readonly Experience[] }) {
  return (
    <Container as="section" className="section-y">
      <div className="flex reveal flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <SectionHeading
          id="experiences-preview"
          eyebrow="Experiences"
          title="Days shaped by the water"
          description="A handful of unhurried rituals, arranged by your host whenever you would like them."
        />
        <SectionLink href="/experiences">All experiences</SectionLink>
      </div>
      <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience, index) => (
          <li key={experience.id} className={index === 2 ? "reveal sm:max-lg:hidden" : "reveal"}>
            <ExperienceCard experience={experience} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
