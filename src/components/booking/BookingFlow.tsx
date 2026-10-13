"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { GuestCount, GuestDetails } from "@/types/booking";
import { stayRules } from "@/data/pricing";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { initialGuestCount, validateStaySelection, type ValidStaySelection } from "@/lib/booking";
import { serializeBookingParams, type BookingParams } from "@/lib/booking-params";
import { nightsBetween } from "@/lib/dates";
import { createDemoReference } from "@/lib/demo-reference";
import { estimateStay } from "@/lib/pricing";
import type { BookableStay } from "./BookingPanel";
import {
  BookingConfirmationActions,
  BookingConfirmationDetails,
  BookingConfirmationIntro,
  type DemoConfirmation,
} from "./BookingConfirmation";
import { BookingForm } from "./BookingForm";
import { BookingSteps } from "./BookingSteps";
import { BookingSummary } from "./BookingSummary";
import type { DateSelection } from "./DateRangeSelector";
import { useToday } from "./useToday";

interface BookingFlowProps {
  stay: BookableStay;
  /** Selection parsed from the URL; re-validated against today and capacity. */
  initial: BookingParams;
  /** Server-rendered residence header for the summary. */
  residence: ReactNode;
}

const linkClasses = "text-forest-800 underline underline-offset-4 hover:no-underline";

/**
 * Client state for /book: the editable selection, its live estimate and the in-memory
 * confirmation. Only the stay, dates and guest counts are mirrored to the URL.
 */
export function BookingFlow({ stay, initial, residence }: BookingFlowProps) {
  const today = useToday();
  const [dates, setDates] = useState<DateSelection>({
    checkIn: initial.checkIn ?? null,
    checkOut: initial.checkOut ?? null,
  });
  const [guests, setGuests] = useState<GuestCount>(() => initialGuestCount(stay.capacity, initial));
  const [confirmation, setConfirmation] = useState<DemoConfirmation | null>(null);

  const selectionParams: BookingParams = {
    checkIn: dates.checkIn ?? undefined,
    checkOut: dates.checkOut ?? undefined,
    ...guests,
  };
  const search = serializeBookingParams({ stay: stay.slug, ...selectionParams });

  // Keep the shareable selection in the address bar without a server round trip.
  // Next.js syncs `history.replaceState` with its router.
  useEffect(() => {
    if (window.location.search !== `?${search}`) {
      window.history.replaceState(null, "", `?${search}`);
    }
  }, [search]);

  const stayValidation = today
    ? validateStaySelection({ ...dates, ...guests }, { capacity: stay.capacity, today })
    : null;
  const nights = dates.checkIn && dates.checkOut ? nightsBetween(dates.checkIn, dates.checkOut) : 0;
  const partySize = guests.adults + guests.children;
  const estimate =
    nights >= stayRules.minNights && nights <= stayRules.maxNights && partySize <= stay.capacity
      ? estimateStay({ nightlyRateMinor: stay.nightlyRateMinor, nights, guests: partySize })
      : null;

  const handleConfirm = (selection: ValidStaySelection, details: GuestDetails) => {
    // Generated on submit, never during render, so server and client markup match.
    setConfirmation({ reference: createDemoReference(), stayName: stay.name, selection, details });
  };

  const otherParams = serializeBookingParams(selectionParams);
  const changeHref = (otherParams ? `/book?${otherParams}` : "/book") as Route;
  const detailHref = (
    otherParams ? `/stays/${stay.slug}?${otherParams}` : `/stays/${stay.slug}`
  ) as Route;

  if (confirmation) {
    const { selection } = confirmation;
    return (
      <>
        <BookingConfirmationIntro confirmation={confirmation} />
        {/* Unlike the form, the confirmation leads with the reference on small screens. */}
        <Container className="grid gap-10 pb-24 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <div className="lg:col-span-7 lg:row-start-1">
            <BookingConfirmationDetails confirmation={confirmation} />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <BookingSummary
              residence={residence}
              checkIn={selection.checkIn}
              checkOut={selection.checkOut}
              guests={selection}
              estimate={estimateStay({
                nightlyRateMinor: stay.nightlyRateMinor,
                nights: selection.nights,
                guests: selection.adults + selection.children,
              })}
            />
          </div>
          <div className="lg:col-span-7 lg:row-start-2">
            <BookingConfirmationActions />
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Booking demonstration"
        title="Plan your stay"
        description="Review your dates and guests, add your details and see an estimated total. Nothing is reserved and no payment is taken."
      >
        <BookingSteps current="details" />
      </PageIntro>
      <Container className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <BookingSummary
              residence={residence}
              {...dates}
              guests={guests}
              estimate={estimate}
              actions={
                <>
                  <Link href={changeHref} className={linkClasses}>
                    Change residence
                  </Link>
                  <Link href={detailHref} className={linkClasses}>
                    View residence details
                  </Link>
                </>
              }
            />
          </div>
        </div>
        <div className="lg:col-span-7 lg:row-start-1">
          <BookingForm
            {...dates}
            guests={guests}
            capacity={stay.capacity}
            stayValidation={stayValidation}
            estimate={estimate}
            onDatesChange={setDates}
            onGuestsChange={setGuests}
            onConfirm={handleConfirm}
          />
        </div>
      </Container>
    </>
  );
}
