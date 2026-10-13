import Link from "next/link";
import type { Route } from "next";
import { CalendarDays } from "lucide-react";
import type { IsoDate } from "@/types/common";
import { formatDate, nightsBetween } from "@/lib/dates";

interface StayDatesNoticeProps {
  checkIn: IsoDate;
  checkOut: IsoDate;
  /** The same listing without dates. */
  clearHref: Route;
}

/** Explains that searched dates carry over to each residence rather than filtering. */
export function StayDatesNotice({ checkIn, checkOut, clearHref }: StayDatesNoticeProps) {
  const nights = nightsBetween(checkIn, checkOut);
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border border-line bg-white p-4 sm:p-5">
      <p className="flex gap-3 text-sm text-charcoal">
        <CalendarDays
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-gold-ink"
          strokeWidth={1.75}
        />
        <span>
          <span className="font-medium">
            {formatDate(checkIn)} – {formatDate(checkOut)} · {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </span>
          <span className="block text-muted">
            Availability isn’t checked in this demonstration. Your dates carry over when you open a
            residence.
          </span>
        </span>
      </p>
      <Link
        href={clearHref}
        className="text-sm font-medium text-forest-900 underline underline-offset-4 hover:no-underline"
      >
        Clear dates
      </Link>
    </div>
  );
}
