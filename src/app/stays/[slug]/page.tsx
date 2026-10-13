import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { accommodations } from "@/data/accommodations";
import { BookingPanel, type BookableStay } from "@/components/booking/BookingPanel";
import { BookingPanelFromUrl } from "@/components/booking/BookingPanelFromUrl";
import { AccommodationGallery } from "@/components/stays/AccommodationGallery";
import { AccommodationGrid } from "@/components/stays/AccommodationGrid";
import { AmenityList } from "@/components/stays/AmenityList";
import { StayFacts } from "@/components/stays/StayFacts";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryLabels, getRelatedStays, getStayBySlug } from "@/lib/stays";

// Only slugs from the dataset exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return accommodations.map((stay) => ({ slug: stay.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stays/[slug]">): Promise<Metadata> {
  const stay = getStayBySlug((await params).slug);
  if (!stay) return {};
  const path = `/stays/${stay.slug}`;
  return {
    title: stay.name,
    description: stay.shortDescription,
    alternates: { canonical: path },
    openGraph: {
      title: stay.name,
      description: stay.shortDescription,
      url: path,
      images: [{ url: stay.images[0].src.src, alt: stay.images[0].alt }],
    },
  };
}

export default async function StayPage({ params }: PageProps<"/stays/[slug]">) {
  const stay = getStayBySlug((await params).slug);
  if (!stay) notFound();

  const bookable: BookableStay = {
    slug: stay.slug,
    name: stay.name,
    capacity: stay.capacity,
    nightlyRateMinor: stay.nightlyRateMinor,
    currency: stay.currency,
  };
  const category = categoryLabels[stay.category];

  return (
    <>
      <Container className="pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/stays" className="hover:text-forest-900 hover:underline">
                Stays
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" strokeWidth={1.75} />
            </li>
            <li aria-current="page" className="text-charcoal">
              {stay.name}
            </li>
          </ol>
        </nav>

        <header className="mt-8 mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-eyebrow font-medium text-gold-ink uppercase">{category.singular}</p>
            <h1 className="mt-4 text-h1 text-forest-900">{stay.name}</h1>
          </div>
          <p className="text-lead text-muted lg:col-span-4">{stay.shortDescription}</p>
        </header>

        <AccommodationGallery images={stay.images} />
      </Container>

      <Container className="pt-14 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-16">
          <section aria-labelledby="about-stay" className="lg:col-span-7">
            <h2 id="about-stay" className="text-h2 text-forest-900">
              About the residence
            </h2>
            <p className="mt-6 text-lead text-charcoal/90">{stay.description}</p>
            <div className="mt-10">
              <StayFacts stay={stay} />
            </div>
          </section>

          <aside
            aria-label="Booking"
            id="booking"
            className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
          >
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <Suspense fallback={<BookingPanel stay={bookable} />}>
                <BookingPanelFromUrl stay={bookable} />
              </Suspense>
            </div>
          </aside>

          <section aria-labelledby="amenities" className="lg:col-span-7">
            <h2 id="amenities" className="text-h3 text-forest-900">
              Amenities
            </h2>
            <div className="mt-8">
              <AmenityList ids={stay.amenities} />
            </div>
          </section>
        </div>
      </Container>

      <section aria-labelledby="related-stays" className="border-t border-line bg-sand-light">
        <Container className="section-y">
          <SectionHeading
            id="related-stays"
            eyebrow="Continue exploring"
            title="You may also like"
          />
          <div className="mt-12">
            <AccommodationGrid stays={getRelatedStays(stay)} headingLevel={3} />
          </div>
        </Container>
      </section>
    </>
  );
}
