import type { Amenity } from "@/types/amenity";
import type { ResortHighlight } from "@/types/highlight";
import type { MediaAsset } from "@/types/media";
import type { AmenityId } from "@/data/amenities";
import { amenityIcons } from "@/components/stays/amenityIcons";
import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ResortHighlightsProps {
  image: MediaAsset;
  highlights: readonly ResortHighlight[];
  amenities: readonly Amenity<AmenityId>[];
}

export function ResortHighlights({ image, highlights, amenities }: ResortHighlightsProps) {
  return (
    <section
      aria-labelledby="resort-highlights"
      data-surface="dark"
      className="bg-forest-900 section-y text-ivory"
    >
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="relative aspect-4/3 reveal overflow-hidden bg-forest-800 lg:col-span-5 lg:aspect-auto lg:min-h-full">
          <ResortImage asset={image} fill sizes="(min-width: 64rem) 36vw, 100vw" />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading
            id="resort-highlights"
            tone="inverse"
            eyebrow="The resort"
            title="Everything close, nothing crowded"
            className="reveal"
          />
          <ul className="mt-12 grid reveal gap-x-10 gap-y-10 sm:grid-cols-2">
            {highlights.map((highlight) => {
              const Icon = amenityIcons[highlight.iconName];
              return (
                <li key={highlight.id}>
                  <Icon aria-hidden="true" className="size-6 text-gold" strokeWidth={1.25} />
                  <h3 className="mt-4 text-2xl text-ivory">{highlight.title}</h3>
                  <p className="mt-2 leading-relaxed text-ivory/75">{highlight.description}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 reveal border-t border-ivory/15 pt-8">
            <h3 className="font-sans text-eyebrow font-medium text-gold uppercase">
              Thoughtful details
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {amenities.map((amenity) => {
                const Icon = amenity.iconName ? amenityIcons[amenity.iconName] : null;
                return (
                  <li key={amenity.id} className="flex items-center gap-3 text-sm text-ivory/85">
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-gold"
                        strokeWidth={1.5}
                      />
                    ) : null}
                    {amenity.name}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-ivory/65">Amenities vary by residence.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
