import { cx } from "@/lib/cx";
import type { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "./AccommodationCard";

interface AccommodationGridProps {
  stays: readonly Accommodation[];
  headingLevel?: 2 | 3;
  /** Whether the grid starts above the fold, so the first image loads eagerly. */
  prioritizeFirst?: boolean;
  /** Passed to each card's link; see `AccommodationCard`. */
  linkSearch?: string;
  /** Four columns suit short, curated sets such as the homepage selection. */
  columns?: 3 | 4;
}

export function AccommodationGrid({
  stays,
  headingLevel = 2,
  prioritizeFirst = false,
  linkSearch,
  columns = 3,
}: AccommodationGridProps) {
  return (
    <ul
      className={cx(
        "grid gap-x-8 gap-y-14 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "xl:grid-cols-4",
      )}
    >
      {stays.map((stay, index) => (
        <li key={stay.slug} className="flex">
          <AccommodationCard
            stay={stay}
            headingLevel={headingLevel}
            aboveTheFold={prioritizeFirst && index === 0}
            linkSearch={linkSearch}
          />
        </li>
      ))}
    </ul>
  );
}
