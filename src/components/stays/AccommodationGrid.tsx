import type { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "./AccommodationCard";

interface AccommodationGridProps {
  stays: readonly Accommodation[];
  headingLevel?: 2 | 3;
  /** Whether the grid starts above the fold, so the first image loads eagerly. */
  prioritizeFirst?: boolean;
}

export function AccommodationGrid({
  stays,
  headingLevel = 2,
  prioritizeFirst = false,
}: AccommodationGridProps) {
  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {stays.map((stay, index) => (
        <li key={stay.slug} className="flex">
          <AccommodationCard
            stay={stay}
            headingLevel={headingLevel}
            aboveTheFold={prioritizeFirst && index === 0}
          />
        </li>
      ))}
    </ul>
  );
}
