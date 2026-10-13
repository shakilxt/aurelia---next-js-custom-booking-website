import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { MediaAsset } from "@/types/media";
import { SectionLink } from "./SectionLink";

interface IslandSectionProps {
  images: readonly [MediaAsset, MediaAsset, MediaAsset, MediaAsset];
}

const notes = [
  { term: "Arrival", detail: "A short boat transfer from the main island, met at the jetty." },
  { term: "Climate", detail: "Warm all year, with trade winds through the dry season." },
  { term: "Setting", detail: "Rainforest ridges, a palm garden and a reef-sheltered lagoon." },
] as const;

/** Destination and gallery teaser. */
export function IslandSection({ images: [wide, tall, left, right] }: IslandSectionProps) {
  return (
    <section aria-labelledby="the-island" className="bg-mist-light section-y">
      <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="reveal lg:col-span-4">
          <SectionHeading
            id="the-island"
            eyebrow="The island"
            title="Lagoon, reef and rainforest"
            description="AURELIA is imagined on a quiet island far from the nearest city, where the reef keeps the lagoon calm and the hills stay green."
          />
          <dl className="mt-10 space-y-5 border-t border-line pt-8">
            {notes.map((note) => (
              <div key={note.term}>
                <dt className="text-xs font-medium tracking-[0.14em] text-gold-ink uppercase">
                  {note.term}
                </dt>
                <dd className="mt-1 text-charcoal">{note.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <SectionLink href="/gallery">View the gallery</SectionLink>
          </div>
        </div>

        <div className="grid reveal grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 lg:col-start-6">
          <div className="relative col-span-2 aspect-video overflow-hidden bg-mist">
            <ResortImage asset={wide} fill sizes="(min-width: 64rem) 55vw, 100vw" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-mist sm:row-span-2 sm:aspect-auto">
            <ResortImage asset={tall} fill sizes="(min-width: 64rem) 27vw, 50vw" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-mist sm:aspect-4/3">
            <ResortImage asset={left} fill sizes="(min-width: 64rem) 27vw, 50vw" />
          </div>
          <div className="relative aspect-4/3 overflow-hidden bg-mist max-sm:hidden">
            <ResortImage asset={right} fill sizes="(min-width: 64rem) 27vw, 50vw" />
          </div>
        </div>
      </Container>
    </section>
  );
}
