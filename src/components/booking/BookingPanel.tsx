"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { Accommodation } from "@/types/accommodation";
import type { GuestCount } from "@/types/booking";
import { stayRules } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { validateStaySelection } from "@/lib/booking";
import { serializeBookingParams, type BookingParams } from "@/lib/booking-params";
import { nightsBetween } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { estimateStay } from "@/lib/pricing";
import { DateRangeSelector, type DateSelection } from "./DateRangeSelector";
import { GuestSelector } from "./GuestSelector";
import { PriceSummary } from "./PriceSummary";
import { useToday } from "./useToday";

/** Only the serialisable fields the panel needs cross the server/client boundary. */
export type BookableStay = Pick<
  Accommodation,
  "slug" | "name" | "capacity" | "nightlyRateMinor" | "currency"
>;

interface BookingPanelProps {
  stay: BookableStay;
  /** Prefill from the URL; values are re-validated before use. */
  initial?: BookingParams;
}

function initialGuests(capacity: number, initial: BookingParams): GuestCount {
  const adults = Math.min(Math.max(initial.adults ?? Math.min(2, capacity), 1), capacity);
  const children = Math.min(initial.children ?? 0, capacity - adults);
  return { adults, children };
}

export function BookingPanel({ stay, initial = {} }: BookingPanelProps) {
  const router = useRouter();
  const today = useToday();
  const headingId = useId();
  const guestsErrorId = useId();
  const panelRef = useRef<HTMLElement>(null);

  const [dates, setDates] = useState<DateSelection>({
    checkIn: initial.checkIn ?? null,
    checkOut: initial.checkOut ?? null,
  });
  const [guests, setGuests] = useState<GuestCount>(() => initialGuests(stay.capacity, initial));
  const [attempted, setAttempted] = useState(false);

  const validation = today
    ? validateStaySelection({ ...dates, ...guests }, { capacity: stay.capacity, today })
    : null;
  // Errors appear after a submit attempt, or as soon as a complete range is invalid
  // (for example, past dates arriving from a shared link).
  const showErrors = attempted || Boolean(dates.checkIn && dates.checkOut);
  const errors = validation && !validation.ok && showErrors ? validation.errors : {};

  const nights = dates.checkIn && dates.checkOut ? nightsBetween(dates.checkIn, dates.checkOut) : 0;
  const estimate =
    nights >= stayRules.minNights && nights <= stayRules.maxNights
      ? estimateStay({
          nightlyRateMinor: stay.nightlyRateMinor,
          nights,
          guests: guests.adults + guests.children,
        })
      : null;

  const handleContinue = () => {
    if (!validation?.ok) {
      setAttempted(true);
      const field = !dates.checkIn || validation?.errors.checkIn ? "checkIn" : "checkOut";
      panelRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus();
      return;
    }
    const { checkIn, checkOut, adults, children } = validation.value;
    const search = serializeBookingParams({ stay: stay.slug, checkIn, checkOut, adults, children });
    router.push(`/book?${search}` as Route);
  };

  return (
    <section
      ref={panelRef}
      aria-labelledby={headingId}
      className="border border-line bg-white p-6 sm:p-8"
    >
      <h2 id={headingId} className="sr-only">
        Plan your stay at {stay.name}
      </h2>
      <p className="flex items-baseline gap-2">
        <span className="font-serif text-[2.5rem] leading-none text-forest-900">
          {formatMoney(stay.nightlyRateMinor, stay.currency)}
        </span>
        <span className="text-sm text-muted">per night</span>
      </p>
      <p className="mt-1 text-xs text-muted">Demonstration rate in USD</p>

      <div className="mt-7 space-y-7">
        <DateRangeSelector
          {...dates}
          onChange={setDates}
          errors={{ checkIn: errors.checkIn, checkOut: errors.checkOut }}
        />
        <GuestSelector
          {...guests}
          capacity={stay.capacity}
          onChange={setGuests}
          error={errors.guests}
          errorId={guestsErrorId}
        />
        <div aria-live="polite">
          {estimate ? (
            <PriceSummary estimate={estimate} />
          ) : (
            <p className="border-t border-line pt-5 text-sm text-muted">
              Select dates to see an estimated total.
            </p>
          )}
        </div>
      </div>

      <Button size="lg" className="mt-7 w-full" onClick={handleContinue}>
        Continue to booking
      </Button>
      <DemoNotice className="mt-5">
        Availability is illustrative. Continuing opens a booking simulation: no reservation is made
        and no payment is taken.
      </DemoNotice>
    </section>
  );
}
