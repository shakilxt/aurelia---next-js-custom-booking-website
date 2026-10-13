import type { Accommodation } from "@/types/accommodation";
import { ResortImage } from "@/components/ui/ResortImage";
import { categoryLabels } from "@/lib/stays";

/**
 * Server-rendered residence header for the booking summary. Passed into the client
 * flow as a slot, so the image and copy stay out of the client bundle.
 */
export function BookingResidence({ stay }: { stay: Accommodation }) {
  return (
    <div className="flex items-center gap-4 lg:block">
      <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-sand sm:w-32 lg:aspect-video lg:w-full">
        <ResortImage asset={stay.images[0]} fill sizes="(min-width: 64rem) 34vw, 8rem" />
      </div>
      <div className="min-w-0 lg:mt-5">
        <p className="text-eyebrow font-medium text-gold-ink uppercase">
          {categoryLabels[stay.category].singular}
        </p>
        <h2 className="mt-1 text-[1.5rem] leading-tight text-forest-900 sm:text-[1.75rem]">
          {stay.name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Up to {stay.capacity} guests · {stay.bedrooms}{" "}
          {stay.bedrooms === 1 ? "bedroom" : "bedrooms"} · {stay.areaSquareMeters} m²
        </p>
      </div>
    </div>
  );
}
