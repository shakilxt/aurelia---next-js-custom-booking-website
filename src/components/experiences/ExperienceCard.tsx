import { Clock } from "lucide-react";
import type { Experience } from "@/types/experience";
import { ResortImage } from "@/components/ui/ResortImage";
import { experienceCategoryLabels } from "@/lib/experiences";

interface ExperienceCardProps {
  experience: Experience;
  headingLevel?: 2 | 3;
  sizes?: string;
}

export function ExperienceCard({
  experience,
  headingLevel = 3,
  sizes = "(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw",
}: ExperienceCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-4/3 overflow-hidden bg-sand sm:aspect-4/5">
        <ResortImage asset={experience.image} fill sizes={sizes} />
      </div>
      <p className="mt-5 text-eyebrow font-medium text-gold-ink uppercase">
        {experienceCategoryLabels[experience.category]}
      </p>
      <Heading className="mt-2 text-[1.75rem] leading-tight text-forest-900">
        {experience.name}
      </Heading>
      <p className="mt-3 text-muted">{experience.description}</p>
      {experience.durationLabel ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-charcoal">
          <Clock aria-hidden="true" className="size-4 text-gold-ink" strokeWidth={1.5} />
          {experience.durationLabel}
        </p>
      ) : null}
    </article>
  );
}
