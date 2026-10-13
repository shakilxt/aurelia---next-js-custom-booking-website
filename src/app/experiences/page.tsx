import type { Route } from "next";
import { Clock } from "lucide-react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { ResortImage } from "@/components/ui/ResortImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { experienceCategoryLabels, getAllExperiences } from "@/lib/experiences";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experiences",
  description:
    "Private beach dining, spa rituals, reef snorkelling, sunset cruises and guided island excursions at AURELIA.",
  path: "/experiences",
});

const howItWorks = [
  {
    title: "Ask your host",
    detail: "Mention an experience when you plan your stay, or send a note once you arrive.",
  },
  {
    title: "Shaped around you",
    detail: "Timings follow the tide, the weather and your own pace, never a fixed schedule.",
  },
  {
    title: "Private by default",
    detail: "Most experiences are arranged for your party alone, from a single table to a boat.",
  },
] as const;

export default function ExperiencesPage() {
  const experiences = getAllExperiences();

  return (
    <>
      <PageIntro
        eyebrow="Experiences"
        title="Days shaped by the island"
        description="From reef mornings to candlelit dinners on the sand, a curated set of experiences arranged at your own pace."
      >
        <DemoNotice className="mt-6">
          Concept experiences for a fictional resort. Enquiries aren’t connected to any booking
          service.
        </DemoNotice>
      </PageIntro>

      <Container className="pb-8">
        <ol className="space-y-20 lg:space-y-28">
          {experiences.map((experience, index) => (
            <li
              key={experience.id}
              id={experience.slug}
              className="grid scroll-mt-8 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              <div
                className={cx(
                  "relative aspect-4/3 reveal overflow-hidden bg-mist lg:col-span-7",
                  index % 2 === 1 && "lg:order-last lg:col-start-6",
                )}
              >
                <ResortImage
                  asset={experience.image}
                  fill
                  aboveTheFold={index === 0}
                  sizes="(min-width: 64rem) 55vw, 100vw"
                />
              </div>
              <div
                className={cx(
                  "reveal lg:col-span-4",
                  index % 2 === 0 ? "lg:col-start-9" : "lg:col-start-1 lg:row-start-1",
                )}
              >
                <p className="text-eyebrow font-medium text-gold-ink uppercase">
                  {experienceCategoryLabels[experience.category]}
                </p>
                <h2 className="mt-3 text-h2 text-forest-900">{experience.name}</h2>
                <p className="mt-5 text-lead text-muted">{experience.description}</p>
                {experience.durationLabel ? (
                  <p className="mt-5 flex items-center gap-2 text-sm text-charcoal">
                    <Clock aria-hidden="true" className="size-4 text-gold-ink" strokeWidth={1.5} />
                    {experience.durationLabel}
                  </p>
                ) : null}
                <div className="mt-8">
                  <ButtonLink
                    href={`/contact?experience=${experience.slug}` as Route}
                    variant="secondary"
                  >
                    Ask about this experience
                    <span className="sr-only"> – {experience.name}</span>
                  </ButtonLink>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <section aria-labelledby="how-it-works" className="section-y">
        <Container>
          <div className="border-t border-line pt-16">
            <SectionHeading
              id="how-it-works"
              eyebrow="Arranging experiences"
              title="How it would work"
              description="In this concept, a dedicated host takes care of the details."
            />
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <li key={step.title}>
                  <span
                    aria-hidden="true"
                    className="font-serif text-[2.5rem] leading-none font-semibold text-gold-ink lining-nums"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-2xl text-forest-900">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.detail}</p>
                </li>
              ))}
            </ol>
            <div className="mt-14 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book">Plan your stay</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact the concierge
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
