import type { Accommodation } from "@/types/accommodation";
import { AccommodationGrid } from "@/components/stays/AccommodationGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLink } from "./SectionLink";

export function FeaturedStays({ stays }: { stays: readonly Accommodation[] }) {
  return (
    <section aria-labelledby="featured-stays" className="border-t border-line bg-white section-y">
      <Container>
        <div className="flex reveal flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <SectionHeading
            id="featured-stays"
            eyebrow="Stays"
            title="Residences for every kind of stillness"
            description="Overwater suites above the lagoon, pool villas in the palms and bungalows a few steps from the sand."
          />
          <SectionLink href="/stays">View all residences</SectionLink>
        </div>
        <div className="mt-14 reveal">
          <AccommodationGrid stays={stays} headingLevel={3} columns={4} />
        </div>
      </Container>
    </section>
  );
}
