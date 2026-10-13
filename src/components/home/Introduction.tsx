import type { MediaAsset } from "@/types/media";
import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface IntroductionProps {
  images: readonly [MediaAsset, MediaAsset];
  facts: readonly { value: string; label: string }[];
}

export function Introduction({ images: [primary, secondary], facts }: IntroductionProps) {
  return (
    <Container as="section" className="grid gap-14 section-y lg:grid-cols-12 lg:items-center">
      <div className="reveal lg:col-span-5">
        <SectionHeading
          eyebrow="Welcome to AURELIA"
          title="A private island, kept deliberately quiet"
          description={
            <>
              <p>
                Eight residences sit between a palm garden and a sheltered lagoon on a fictional
                island in the South Pacific. Days are unscheduled unless you would like them
                otherwise.
              </p>
              <p className="mt-4">
                Mornings start with the reef, afternoons with shade and a book, and evenings with
                dinner wherever the light is best.
              </p>
            </>
          }
        />
        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-1 text-sm text-muted">{fact.label}</dt>
              <dd className="font-serif text-[2.5rem] leading-none font-semibold text-forest-900 lining-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative lg:col-span-6 lg:col-start-7">
        <div className="relative aspect-4/5 reveal overflow-hidden bg-mist sm:w-4/5">
          <ResortImage
            asset={primary}
            fill
            sizes="(min-width: 64rem) 36vw, (min-width: 40rem) 80vw, 100vw"
          />
        </div>
        <div className="relative -mt-24 ml-auto aspect-square w-1/2 reveal overflow-hidden border-8 border-shell bg-mist sm:-mt-40 sm:w-[45%]">
          <ResortImage asset={secondary} fill sizes="(min-width: 64rem) 22vw, 45vw" />
        </div>
      </div>
    </Container>
  );
}
