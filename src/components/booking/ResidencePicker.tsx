import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, Users } from "lucide-react";
import type { Accommodation } from "@/types/accommodation";
import { ResortImage } from "@/components/ui/ResortImage";
import { serializeBookingParams, type BookingParams } from "@/lib/booking-params";
import { formatMoney } from "@/lib/money";
import { categoryLabels } from "@/lib/stays";

interface ResidencePickerProps {
  stays: readonly Accommodation[];
  /** Dates and guests already chosen; they carry over to the selected residence. */
  selection: BookingParams;
}

/** First booking step: every residence as a link that keeps the current selection. */
export function ResidencePicker({ stays, selection }: ResidencePickerProps) {
  const party =
    selection.adults !== undefined ? selection.adults + (selection.children ?? 0) : undefined;

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {stays.map((stay) => {
        const tooSmall = party !== undefined && party > stay.capacity;
        const href = `/book?${serializeBookingParams({ ...selection, stay: stay.slug })}` as Route;
        return (
          <li key={stay.slug} className="flex">
            <article className="group relative flex w-full gap-4 border border-line bg-white p-3 transition-colors hover:border-forest-800 sm:gap-5 sm:p-4">
              <div className="relative aspect-4/3 w-28 shrink-0 self-start overflow-hidden bg-mist sm:w-40">
                <ResortImage asset={stay.images[0]} fill sizes="(min-width: 40rem) 10rem, 7rem" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-eyebrow font-medium text-gold-ink uppercase">
                  {categoryLabels[stay.category].singular}
                </p>
                <h3 className="mt-1 text-[1.375rem] leading-tight text-forest-900 sm:text-2xl">
                  <Link
                    href={href}
                    className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-(--focus-ring)"
                  >
                    {stay.name}
                  </Link>
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <Users aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  Up to {stay.capacity} guests
                </p>
                {tooSmall ? (
                  <p className="mt-1 text-sm text-danger">Smaller than your party of {party}</p>
                ) : null}
                <p className="mt-auto pt-3">
                  <span className="font-serif text-xl font-semibold text-forest-900">
                    {formatMoney(stay.nightlyRateMinor, stay.currency)}
                  </span>{" "}
                  <span className="text-xs text-muted">per night · demo rate</span>
                </p>
              </div>
              <ChevronRight
                aria-hidden="true"
                className="size-5 shrink-0 self-center text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-forest-800"
                strokeWidth={1.5}
              />
            </article>
          </li>
        );
      })}
    </ul>
  );
}
