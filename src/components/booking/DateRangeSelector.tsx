"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { DayPicker, type ClassNames, type DateRange } from "react-day-picker";
import { CalendarDays } from "lucide-react";
import type { IsoDate } from "@/types/common";
import { stayRules } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { latestCheckIn } from "@/lib/booking";
import { cx } from "@/lib/cx";
import {
  addDays,
  compareIsoDates,
  formatDate,
  isoToLocalDate,
  localDateToIso,
  nightsBetween,
} from "@/lib/dates";
import { useToday } from "./useToday";

export interface DateSelection {
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
}

interface DateRangeSelectorProps extends DateSelection {
  onChange: (selection: DateSelection) => void;
  errors?: { checkIn?: string; checkOut?: string };
}

const WIDE_QUERY = "(min-width: 48rem)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const calendarClassNames: Partial<ClassNames> = {
  root: "relative",
  months: "flex flex-col gap-8 md:flex-row md:gap-10",
  month: "w-full",
  month_caption: "flex h-11 items-center justify-center",
  caption_label: "font-serif text-xl text-forest-900",
  nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between",
  button_previous:
    "pointer-events-auto inline-flex size-11 items-center justify-center rounded-sm hover:bg-sand-light aria-disabled:opacity-30 aria-disabled:hover:bg-transparent",
  button_next:
    "pointer-events-auto inline-flex size-11 items-center justify-center rounded-sm hover:bg-sand-light aria-disabled:opacity-30 aria-disabled:hover:bg-transparent",
  chevron: "size-4 fill-forest-900",
  month_grid: "mt-3 w-full border-collapse",
  weekday: "pb-2 text-xs font-medium text-muted",
  day: "p-0 text-center",
  day_button:
    "mx-auto flex size-10 items-center justify-center rounded-sm text-sm transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-charcoal/30 disabled:hover:bg-transparent sm:size-11",
  today: "font-semibold text-forest-900",
  range_start:
    "bg-sand [&>button]:bg-forest-800 [&>button]:text-ivory [&>button]:hover:bg-forest-900",
  range_end:
    "bg-sand [&>button]:bg-forest-800 [&>button]:text-ivory [&>button]:hover:bg-forest-900",
  range_middle: "bg-sand [&>button]:rounded-none",
  hidden: "invisible",
};

function rangeSummary({ checkIn, checkOut }: DateSelection) {
  if (!checkIn) return "Select a check-in date.";
  if (!checkOut) return `Check-in ${formatDate(checkIn)}. Now select a check-out date.`;
  const nights = nightsBetween(checkIn, checkOut);
  return `${nights} ${nights === 1 ? "night" : "nights"} · ${formatDate(checkIn, "short")} – ${formatDate(checkOut, "short")}`;
}

/**
 * Check-in and check-out fields that open an accessible range calendar. The calendar
 * renders only on the client after opening, so "today" never comes from the server.
 */
export function DateRangeSelector({
  checkIn,
  checkOut,
  onChange,
  errors = {},
}: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const today = useToday();
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
  const id = useId();

  const selected: DateRange | undefined = checkIn
    ? { from: isoToLocalDate(checkIn), to: checkOut ? isoToLocalDate(checkOut) : undefined }
    : undefined;

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
            aria-haspopup="dialog"
            aria-describedby={field.error ? `${id}-${field.key}-error` : undefined}
            data-field={field.key}
            onClick={() => setOpen(true)}
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
          <p key={field.key} id={`${id}-${field.key}-error`} className="mt-2 text-sm text-danger">
            {field.error}
          </p>
        ) : null,
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Select your dates"
        initialFocus='[role="grid"] button[tabindex="0"]'
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
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={(range) =>
              onChange({
                checkIn: range?.from ? localDateToIso(range.from) : null,
                checkOut: range?.to ? localDateToIso(range.to) : null,
              })
            }
            min={stayRules.minNights}
            max={stayRules.maxNights}
            resetOnSelect
            excludeDisabled
            disabled={[
              { before: isoToLocalDate(today) },
              { after: isoToLocalDate(addDays(latestCheckIn(today), stayRules.maxNights)) },
            ]}
            numberOfMonths={wide ? 2 : 1}
            startMonth={isoToLocalDate(today)}
            endMonth={isoToLocalDate(addDays(latestCheckIn(today), stayRules.maxNights))}
            defaultMonth={isoToLocalDate(
              checkIn && compareIsoDates(checkIn, today) >= 0 ? checkIn : today,
            )}
            classNames={calendarClassNames}
          />
        ) : null}
      </Dialog>
    </div>
  );
}
