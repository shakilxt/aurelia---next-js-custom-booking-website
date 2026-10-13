"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays } from "lucide-react";
import type { IsoDate } from "@/types/common";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { FieldError } from "@/components/ui/form/FieldError";
import { cx } from "@/lib/cx";
import { formatDate, nightsBetween } from "@/lib/dates";
import { useToday } from "./useToday";

export interface DateSelection {
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
}

interface DateRangeSelectorProps extends DateSelection {
  /** Base id; the triggers become `${id}-checkIn` and `${id}-checkOut`. */
  id?: string;
  onChange: (selection: DateSelection) => void;
  errors?: { checkIn?: string; checkOut?: string };
}

const loadCalendar = () => import("./RangeCalendar");
const RangeCalendar = dynamic(loadCalendar, {
  ssr: false,
  loading: () => (
    <p role="status" className="flex min-h-80 items-center justify-center text-sm text-muted">
      Loading calendar…
    </p>
  ),
});

function rangeSummary({ checkIn, checkOut }: DateSelection) {
  if (!checkIn) return "Select a check-in date.";
  if (!checkOut) return `Check-in ${formatDate(checkIn)}. Now select a check-out date.`;
  const nights = nightsBetween(checkIn, checkOut);
  return `${nights} ${nights === 1 ? "night" : "nights"} · ${formatDate(checkIn, "short")} – ${formatDate(checkOut, "short")}`;
}

/**
 * Check-in and check-out fields that open an accessible range calendar. The calendar
 * renders only on the client after opening, so "today" never comes from the server,
 * and its code is fetched on demand (see `RangeCalendar`).
 */
export function DateRangeSelector({
  id: idProp,
  checkIn,
  checkOut,
  onChange,
  errors = {},
}: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const today = useToday();
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const fields = [
    { key: "checkIn", label: "Check-in", value: checkIn, error: errors.checkIn },
    { key: "checkOut", label: "Check-out", value: checkOut, error: errors.checkOut },
  ] as const;

  return (
    <div>
      <div className="grid grid-cols-2 divide-x divide-line-strong border border-line-strong bg-white">
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            id={`${id}-${field.key}`}
            aria-haspopup="dialog"
            aria-describedby={field.error ? `${id}-${field.key}-error` : undefined}
            data-field={field.key}
            onClick={() => setOpen(true)}
            // Start fetching the calendar as soon as intent is likely.
            onPointerEnter={loadCalendar}
            onFocus={loadCalendar}
            className={cx(
              "flex min-h-16 flex-col items-start justify-center px-4 py-3 text-left transition-colors hover:bg-sand-light",
              field.error && "outline-2 -outline-offset-2 outline-danger",
            )}
          >
            <span className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
              {field.label}
            </span>
            <span
              className={cx(
                "mt-1 flex items-center gap-2",
                field.value ? "text-charcoal" : "text-muted",
              )}
            >
              {field.value ? formatDate(field.value) : "Add date"}
              {!field.value ? (
                <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.5} />
              ) : null}
            </span>
          </button>
        ))}
      </div>
      {fields.map((field) =>
        field.error ? (
          <FieldError key={field.key} id={`${id}-${field.key}-error`}>
            {field.error}
          </FieldError>
        ) : null,
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Select your dates"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-muted">
              {rangeSummary({ checkIn, checkOut })}
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => onChange({ checkIn: null, checkOut: null })}
                disabled={!checkIn}
              >
                Clear
              </Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        }
      >
        {today ? (
          <RangeCalendar checkIn={checkIn} checkOut={checkOut} today={today} onChange={onChange} />
        ) : null}
      </Dialog>
    </div>
  );
}
