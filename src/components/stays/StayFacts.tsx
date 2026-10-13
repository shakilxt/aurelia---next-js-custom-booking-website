import { Bath, BedDouble, DoorOpen, Maximize, Users } from "lucide-react";
import type { Accommodation } from "@/types/accommodation";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function StayFacts({ stay }: { stay: Accommodation }) {
  const facts = [
    { icon: Users, label: "Guests", value: `Up to ${stay.capacity}` },
    { icon: DoorOpen, label: "Bedrooms", value: plural(stay.bedrooms, "bedroom") },
    { icon: Bath, label: "Bathrooms", value: plural(stay.bathrooms, "bathroom") },
    { icon: BedDouble, label: "Beds", value: stay.bedConfiguration },
    { icon: Maximize, label: "Area", value: `About ${stay.areaSquareMeters} m²` },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-8 sm:grid-cols-3 lg:grid-cols-5">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label}>
          <dt className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-muted uppercase">
            <Icon aria-hidden="true" className="size-4 text-gold-ink" strokeWidth={1.5} />
            {label}
          </dt>
          <dd className="mt-2 text-charcoal">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
