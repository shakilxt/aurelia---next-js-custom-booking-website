import type { Accommodation } from "@/types/accommodation";
import { ResortImage } from "@/components/ui/ResortImage";
import { cx } from "@/lib/cx";

/** Editorial gallery: a lead image with supporting images beside it on wide screens. */
export function AccommodationGallery({ images }: { images: Accommodation["images"] }) {
  const [lead, ...rest] = images;

  return (
    <div className="grid gap-2 sm:gap-3 lg:h-[clamp(28rem,62vh,40rem)] lg:grid-cols-3 lg:grid-rows-2">
      <div
        className={cx(
          "relative aspect-4/3 overflow-hidden bg-sand lg:aspect-auto",
          rest.length > 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-3 lg:row-span-2",
        )}
      >
        <ResortImage asset={lead} fill aboveTheFold sizes="(min-width: 64rem) 66vw, 100vw" />
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:col-span-1 lg:row-span-2 lg:grid-cols-1 lg:grid-rows-2">
          {rest.slice(0, 2).map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden bg-sand lg:aspect-auto"
            >
              <ResortImage asset={image} fill sizes="(min-width: 64rem) 33vw, 50vw" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
