"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { DayPicker, type ClassNames, type DateRange } from "react-day-picker";
import type { IsoDate } from "@/types/common";
import { stayRules } from "@/data/pricing";
import { latestCheckIn } from "@/lib/booking";
import { addDays, compareIsoDates, isoToLocalDate, localDateToIso } from "@/lib/dates";
import type { DateSelection } from "./DateRangeSelector";

interface RangeCalendarProps extends DateSelection {
  today: IsoDate;
  onChange: (selection: DateSelection) => void;
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
  caption_label: "font-serif font-semibold text-xl text-forest-900",
  nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between",
  button_previous:
    "pointer-events-auto inline-flex size-11 items-center justify-center rounded-sm hover:bg-mist-light aria-disabled:opacity-30 aria-disabled:hover:bg-transparent",
  button_next:
    "pointer-events-auto inline-flex size-11 items-center justify-center rounded-sm hover:bg-mist-light aria-disabled:opacity-30 aria-disabled:hover:bg-transparent",
  chevron: "size-4 fill-forest-900",
  month_grid: "mt-3 w-full border-collapse",
  weekday: "pb-2 text-xs font-medium text-muted",
  day: "p-0 text-center",
  day_button:
    "mx-auto flex size-10 items-center justify-center rounded-sm text-sm transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:text-charcoal/30 disabled:hover:bg-transparent sm:size-11",
  today: "font-semibold text-forest-900",
  range_start:
    "bg-mist [&>button]:bg-forest-800 [&>button]:text-shell [&>button]:hover:bg-forest-900",
  range_end:
    "bg-mist [&>button]:bg-forest-800 [&>button]:text-shell [&>button]:hover:bg-forest-900",
  range_middle: "bg-mist [&>button]:rounded-none",
  hidden: "invisible",
};

/*
 * react-day-picker marks a lone check-in only as `selected` (range_start needs both
 * ends), so this modifier gives it the same filled style while check-out is pending.
 */
const modifiersClassNames = {
  checkInOnly: "[&>button]:bg-forest-800 [&>button]:text-shell [&>button]:hover:bg-forest-900",
};

/**
 * The range calendar itself, split from `DateRangeSelector` so react-day-picker loads
 * only when a visitor opens the dates dialog. Because it can arrive after the dialog
 * has opened, it moves focus to the active day itself when it mounts.
 */
export default function RangeCalendar({ checkIn, checkOut, today, onChange }: RangeCalendarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
  const lastBookableDay = isoToLocalDate(addDays(latestCheckIn(today), stayRules.maxNights));
  const selected: DateRange | undefined = checkIn
    ? { from: isoToLocalDate(checkIn), to: checkOut ? isoToLocalDate(checkOut) : undefined }
    : undefined;
  // While check-out is being chosen, days past the longest stay are disabled. Otherwise a
  // click there silently starts a new range, which reads as the calendar ignoring it.
  const choosingCheckOut = checkIn !== null && checkOut === null;
  const lastCheckOut = choosingCheckOut
    ? isoToLocalDate(addDays(checkIn, stayRules.maxNights))
    : null;

  useEffect(() => {
    rootRef.current?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]')?.focus();
  }, []);

  return (
    <div ref={rootRef}>
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
          { after: lastBookableDay },
          ...(lastCheckOut ? [{ after: lastCheckOut }] : []),
        ]}
        modifiers={{ checkInOnly: choosingCheckOut ? isoToLocalDate(checkIn) : undefined }}
        modifiersClassNames={modifiersClassNames}
        numberOfMonths={wide ? 2 : 1}
        startMonth={isoToLocalDate(today)}
        endMonth={lastBookableDay}
        defaultMonth={isoToLocalDate(
          checkIn && compareIsoDates(checkIn, today) >= 0 ? checkIn : today,
        )}
        classNames={calendarClassNames}
      />
    </div>
  );
}
