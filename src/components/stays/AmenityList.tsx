import {
  Anchor,
  Bath,
  BedDouble,
  Coffee,
  ConciergeBell,
  Fish,
  ShowerHead,
  Snowflake,
  Sofa,
  Sun,
  Sunset,
  Trees,
  Utensils,
  Waves,
  Wifi,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { getAmenity, type AmenityId } from "@/data/amenities";
import type { AmenityCategory, AmenityIconName } from "@/types/amenity";

/** Exhaustive: adding an icon name to the type without mapping it is a type error. */
const icons: Record<AmenityIconName, LucideIcon> = {
  anchor: Anchor,
  bath: Bath,
  "bed-double": BedDouble,
  coffee: Coffee,
  "concierge-bell": ConciergeBell,
  fish: Fish,
  "shower-head": ShowerHead,
  snowflake: Snowflake,
  sofa: Sofa,
  sun: Sun,
  sunset: Sunset,
  trees: Trees,
  utensils: Utensils,
  waves: Waves,
  wifi: Wifi,
  wine: Wine,
};

const groups: { category: AmenityCategory; title: string }[] = [
  { category: "outdoors", title: "Outdoors" },
  { category: "residence", title: "In the residence" },
  { category: "wellness", title: "Wellness" },
  { category: "service", title: "Service" },
];

export function AmenityList({ ids }: { ids: readonly AmenityId[] }) {
  const amenities = ids.map(getAmenity);

  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {groups.map(({ category, title }) => {
        const items = amenities.filter((amenity) => amenity.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <h3 className="font-sans text-xs font-medium tracking-[0.14em] text-muted uppercase">
              {title}
            </h3>
            <ul className="mt-4 space-y-3">
              {items.map((amenity) => {
                const Icon = amenity.iconName ? icons[amenity.iconName] : null;
                return (
                  <li key={amenity.id} className="flex items-center gap-3">
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-gold-ink"
                        strokeWidth={1.5}
                      />
                    ) : null}
                    {amenity.name}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
