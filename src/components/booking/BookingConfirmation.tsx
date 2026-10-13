"use client";

import { useEffect, useRef } from "react";
import type { GuestDetails } from "@/types/booking";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatGuestCount, type ValidStaySelection } from "@/lib/booking";
import { formatDate } from "@/lib/dates";
import { BookingSteps } from "./BookingSteps";

export interface DemoConfirmation {
  reference: string;
  stayName: string;
  selection: ValidStaySelection;
  details: GuestDetails;
}

const termClasses = "text-xs font-medium tracking-[0.14em] text-muted uppercase";

/**
 * The end of the simulation. It restates what was entered and says plainly that no
 * reservation exists. Focus moves to the heading so the change of view is announced.
 */
export function BookingConfirmationIntro({ confirmation }: { confirmation: DemoConfirmation }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstName = confirmation.details.fullName.split(/\s+/)[0];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Container as="header" className="pt-14 pb-10 sm:pt-20 sm:pb-12">
      <div className="max-w-2xl">
        <p className="mb-4 text-eyebrow font-medium text-gold-ink uppercase">Simulation complete</p>
        <h1 ref={headingRef} tabIndex={-1} className="text-h1 text-forest-900">
          Thank you, {firstName}
        </h1>
        <div className="mt-5 text-lead text-muted">
          This is where a resort would confirm your stay. AURELIA is a design concept, so no
          reservation has been made, no payment was taken and your details were not sent anywhere.
        </div>
      </div>
      <BookingSteps current="confirmation" />
    </Container>
  );
}

export function BookingConfirmationDetails({ confirmation }: { confirmation: DemoConfirmation }) {
  const { reference, stayName, selection, details } = confirmation;
  const rows = [
    { term: "Residence", value: stayName },
    { term: "Check-in", value: formatDate(selection.checkIn, "long") },
    { term: "Check-out", value: formatDate(selection.checkOut, "long") },
    {
      term: "Length of stay",
      value: `${selection.nights} ${selection.nights === 1 ? "night" : "nights"}`,
    },
    { term: "Guests", value: formatGuestCount(selection) },
    { term: "Name", value: details.fullName },
    { term: "Email", value: details.email },
    ...(details.phone ? [{ term: "Phone", value: details.phone }] : []),
    ...(details.specialRequests
      ? [{ term: "Special requests", value: details.specialRequests }]
      : []),
  ];

  return (
    <div>
      <section
        aria-labelledby="demo-reference-label"
        className="border border-gold/60 bg-mist-light p-6 sm:p-8"
      >
        <h2
          id="demo-reference-label"
          className="font-sans text-xs font-medium tracking-[0.14em] text-gold-ink uppercase"
        >
          Demo reference
        </h2>
        <p className="mt-2 font-serif text-[1.625rem] leading-tight font-semibold tracking-[0.06em] [overflow-wrap:anywhere] text-forest-900 sm:text-[2rem]">
          {reference}
        </p>
        <p className="mt-2 text-sm text-muted">
          A demonstration identifier only. It is not a booking number and can’t be used to reserve,
          change or cancel a stay.
        </p>
      </section>

      <section aria-labelledby="entered-details" className="mt-12">
        <h2 id="entered-details" className="text-h3 text-forest-900">
          What you entered
        </h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className={termClasses}>{row.term}</dt>
              <dd className="[overflow-wrap:anywhere] whitespace-pre-line text-charcoal sm:col-span-2">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-muted">
          These details exist only on this page. Refreshing or leaving clears them.
        </p>
      </section>
    </div>
  );
}

export function BookingConfirmationActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ButtonLink href="/book">Plan another stay</ButtonLink>
      <ButtonLink href="/experiences" variant="secondary">
        Explore experiences
      </ButtonLink>
    </div>
  );
}
