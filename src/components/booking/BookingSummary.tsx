import type { ReactNode } from "react";
import type { GuestCount } from "@/types/booking";
import type { IsoDate } from "@/types/common";
import { formatGuestCount } from "@/lib/booking";
import { formatDate, nightsBetween } from "@/lib/dates";
import type { StayEstimate } from "@/lib/pricing";
import { PriceSummary } from "./PriceSummary";

interface BookingSummaryProps {
  /** Server-rendered residence header (see `BookingResidence`). */
  residence: ReactNode;
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
  guests: GuestCount;
  estimate: StayEstimate | null;
  /** Links shown under the residence, e.g. "Change residence". */
  actions?: ReactNode;
}

const termClasses = "text-xs font-medium tracking-[0.14em] text-muted uppercase";

/** The stay being priced: residence, dates, guests and the itemised estimate. */
export function BookingSummary({
  residence,
  checkIn,
  checkOut,
  guests,
  estimate,
  actions,
}: BookingSummaryProps) {
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : null;
  const rows = [
    { term: "Check-in", value: checkIn ? formatDate(checkIn) : "Not selected" },
    { term: "Check-out", value: checkOut ? formatDate(checkOut) : "Not selected" },
    {
      term: "Nights",
      value: nights !== null && nights > 0 ? String(nights) : "–",
    },
    { term: "Guests", value: formatGuestCount(guests) },
  ];

  return (
    <aside aria-label="Booking summary" className="border border-line bg-white p-5 sm:p-6 lg:p-8">
      {residence}
      {actions ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">{actions}</div>
      ) : null}

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5 text-sm">
        {rows.map((row) => (
          <div key={row.term}>
            <dt className={termClasses}>{row.term}</dt>
            <dd className="mt-1 text-charcoal">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-line pt-5">
        {estimate ? (
          <PriceSummary estimate={estimate} />
        ) : (
          <p className="text-sm text-muted">
            Choose valid dates and guests to see an estimated total.
          </p>
        )}
      </div>
    </aside>
  );
}
