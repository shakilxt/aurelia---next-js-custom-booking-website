"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { GuestCount, GuestDetails } from "@/types/booking";
import { Button } from "@/components/ui/Button";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { ErrorSummary, type SummaryError } from "@/components/ui/form/ErrorSummary";
import { TextArea } from "@/components/ui/form/TextArea";
import { TextField } from "@/components/ui/form/TextField";
import type { StayField, ValidStaySelection } from "@/lib/booking";
import { formatMoney } from "@/lib/money";
import type { StayEstimate } from "@/lib/pricing";
import { limits, validateGuestDetails, type ValidationResult } from "@/lib/validation";
import { DateRangeSelector, type DateSelection } from "./DateRangeSelector";
import { GuestSelector } from "./GuestSelector";

const emptyDetails: GuestDetails = { fullName: "", email: "", phone: "", specialRequests: "" };

type Field = StayField | keyof GuestDetails;
// Matches the visual order of the form, so the summary reads top to bottom.
const fieldOrder: readonly Field[] = [
  "checkIn",
  "checkOut",
  "guests",
  "fullName",
  "email",
  "phone",
  "specialRequests",
];

interface BookingFormProps extends DateSelection {
  guests: GuestCount;
  capacity: number;
  /** Null until the visitor's local date is known after hydration. */
  stayValidation: ValidationResult<ValidStaySelection, StayField> | null;
  estimate: StayEstimate | null;
  onDatesChange: (dates: DateSelection) => void;
  onGuestsChange: (guests: GuestCount) => void;
  onConfirm: (selection: ValidStaySelection, details: GuestDetails) => void;
}

const sectionHeading = "text-h3 text-forest-900";

/**
 * Dates, guests and contact details for the simulated booking. Personal details live
 * only in this component's state: they are never written to the URL or to storage.
 */
export function BookingForm({
  checkIn,
  checkOut,
  guests,
  capacity,
  stayValidation,
  estimate,
  onDatesChange,
  onGuestsChange,
  onConfirm,
}: BookingFormProps) {
  const id = useId();
  const summaryRef = useRef<HTMLElement>(null);
  const [details, setDetails] = useState<GuestDetails>(emptyDetails);
  const [attempts, setAttempts] = useState(0);

  const fieldId = (field: Field) => `${id}-${field}`;
  const update = (field: keyof GuestDetails) => (value: string) =>
    setDetails((current) => ({ ...current, [field]: value }));

  const detailsValidation = validateGuestDetails(details);
  const submitted = attempts > 0;
  const stayErrors = stayValidation && !stayValidation.ok ? stayValidation.errors : {};
  // Before the first submit, only show problems the visitor didn't create by typing:
  // an impossible range or an oversized party carried in from a link.
  const errors: Partial<Record<Field, string>> = submitted
    ? { ...stayErrors, ...(detailsValidation.ok ? {} : detailsValidation.errors) }
    : {
        ...(checkIn && checkOut
          ? { checkIn: stayErrors.checkIn, checkOut: stayErrors.checkOut }
          : {}),
        guests: stayErrors.guests,
      };

  const summaryErrors: SummaryError[] = submitted
    ? fieldOrder.flatMap((field) => {
        const message = errors[field];
        return message ? [{ id: fieldId(field), message }] : [];
      })
    : [];

  // Move focus to the summary after every failed submit, not only the first.
  useEffect(() => {
    if (attempts > 0) summaryRef.current?.focus();
  }, [attempts]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stayValidation?.ok && detailsValidation.ok) {
      onConfirm(stayValidation.value, detailsValidation.value);
      return;
    }
    setAttempts((count) => count + 1);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <ErrorSummary ref={summaryRef} errors={summaryErrors} />

      <section
        aria-labelledby={`${id}-stay`}
        className={summaryErrors.length ? "mt-10" : undefined}
      >
        <h2 id={`${id}-stay`} className={sectionHeading}>
          Dates and guests
        </h2>
        <div className="mt-6 space-y-7">
          <DateRangeSelector
            id={id}
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={onDatesChange}
            errors={{ checkIn: errors.checkIn, checkOut: errors.checkOut }}
          />
          <GuestSelector
            id={fieldId("guests")}
            {...guests}
            capacity={capacity}
            onChange={onGuestsChange}
            error={errors.guests}
          />
        </div>
      </section>

      <section aria-labelledby={`${id}-guest`} className="mt-12 border-t border-line pt-10">
        <h2 id={`${id}-guest`} className={sectionHeading}>
          Guest details
        </h2>
        <DemoNotice className="mt-3">
          Made-up details are welcome. Nothing you type is sent or saved: it stays in this tab and
          is cleared when you leave or refresh.
        </DemoNotice>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <TextField
            id={fieldId("fullName")}
            name="fullName"
            label="Full name"
            autoComplete="name"
            value={details.fullName}
            onChange={(event) => update("fullName")(event.target.value)}
            error={errors.fullName}
            className="sm:col-span-2"
          />
          <TextField
            id={fieldId("email")}
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            spellCheck={false}
            value={details.email}
            onChange={(event) => update("email")(event.target.value)}
            error={errors.email}
          />
          <TextField
            id={fieldId("phone")}
            name="phone"
            type="tel"
            label="Phone"
            optional
            autoComplete="tel"
            value={details.phone}
            onChange={(event) => update("phone")(event.target.value)}
            error={errors.phone}
          />
          <TextArea
            id={fieldId("specialRequests")}
            name="specialRequests"
            label="Special requests"
            optional
            hint={`Dietary needs, celebrations or arrival plans. Up to ${limits.requestsMax} characters.`}
            countLimit={limits.requestsMax}
            value={details.specialRequests}
            onChange={(event) => update("specialRequests")(event.target.value)}
            error={errors.specialRequests}
            className="sm:col-span-2"
          />
        </div>
      </section>

      <div className="mt-12 border-t border-line pt-8">
        <p aria-live="polite" className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">
            {estimate
              ? `Estimated total for ${estimate.nights} ${estimate.nights === 1 ? "night" : "nights"}`
              : "Estimated total"}
          </span>
          <span className="font-serif text-[1.75rem] leading-none font-semibold text-forest-900 tabular-nums">
            {estimate ? formatMoney(estimate.totalMinor, estimate.currency) : "–"}
          </span>
        </p>
        {/*
          Disabled until hydration: without JavaScript the form would submit natively
          and could place personal details in the URL.
        */}
        <Button type="submit" size="lg" disabled={stayValidation === null} className="mt-6 w-full">
          Submit demo booking
        </Button>
        <DemoNotice className="mt-5">
          This is a simulation. Submitting doesn’t reserve a residence or take a payment, and there
          are deliberately no payment fields.
        </DemoNotice>
      </div>
    </form>
  );
}
