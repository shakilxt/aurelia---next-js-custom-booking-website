import Link from "next/link";
import type { Route } from "next";
import type { Accommodation } from "@/types/accommodation";
import { ResortImage } from "@/components/ui/ResortImage";
import { formatMoney } from "@/lib/money";
import { categoryLabels } from "@/lib/stays";

interface AccommodationCardProps {
  stay: Accommodation;
  /** Heading level for the residence name, to fit the surrounding outline. */
  headingLevel?: 2 | 3;
  /** Set on the first card in view so its image loads with high priority. */
  aboveTheFold?: boolean;
  /** Booking selection to carry to the residence page, e.g. dates from a search. */
  linkSearch?: string;
}

export function AccommodationCard({
  stay,
  headingLevel = 2,
  aboveTheFold = false,
  linkSearch,
}: AccommodationCardProps) {
  const Heading = `h${headingLevel}` as const;
  const [cover] = stay.images;

  return (
    <article className="group relative flex w-full flex-col">
      <div className="relative aspect-4/3 overflow-hidden bg-mist">
        <ResortImage
          asset={cover}
          fill
          aboveTheFold={aboveTheFold}
          sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw"
          className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-eyebrow font-medium text-gold-ink uppercase">
          {categoryLabels[stay.category].singular}
        </p>
        <Heading className="mt-2 text-[1.75rem] leading-tight text-forest-900">
          {/* Stretched link: the whole card is clickable, with one accessible name. */}
          <Link
            href={
              (linkSearch ? `/stays/${stay.slug}?${linkSearch}` : `/stays/${stay.slug}`) as Route
            }
            className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-4 after:focus-visible:outline-(--focus-ring)"
          >
            {stay.name}
          </Link>
        </Heading>
        <p className="mt-3 mb-6 text-muted">{stay.shortDescription}</p>

        <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <p className="text-sm text-muted">
            <span className="block">Up to {stay.capacity} guests</span>
            {stay.bedrooms} {stay.bedrooms === 1 ? "bedroom" : "bedrooms"} · {stay.areaSquareMeters}{" "}
            m²
          </p>
          <p className="shrink-0 text-right">
            <span className="block font-serif text-2xl leading-none font-semibold text-forest-900">
              {formatMoney(stay.nightlyRateMinor, stay.currency)}
            </span>
            <span className="block text-xs leading-5 text-muted">per night · demo rate</span>
          </p>
        </div>
      </div>
    </article>
  );
}
