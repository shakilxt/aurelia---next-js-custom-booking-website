"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ChevronDown, Search } from "lucide-react";
import type { AccommodationCategory } from "@/types/accommodation";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { defaultStayQuery, serializeStayQuery } from "@/lib/stay-query";
import { categoryLabels } from "@/lib/stays";
import { DateRangeSelector, type DateSelection } from "./DateRangeSelector";

interface BookingSearchProps {
  /** Largest residence capacity, which bounds the guest options. */
  maxGuests: number;
}

const categories = ["villa", "suite", "bungalow"] as const;

/**
 * Homepage search. Guests and residence type filter /stays; dates are optional and
 * travel on to each residence. The selects carry `name` attributes, so the form
 * still submits a usable GET request to /stays before JavaScript loads.
 */
export function BookingSearch({ maxGuests }: BookingSearchProps) {
  const router = useRouter();
  const id = useId();
  const [dates, setDates] = useState<DateSelection>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState("2");
  const [type, setType] = useState<AccommodationCategory | "">("");
  const [attempted, setAttempted] = useState(false);

  const incomplete = Boolean(dates.checkIn && !dates.checkOut);
  const checkOutError =
    attempted && incomplete ? "Choose a check-out date, or clear the dates." : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (incomplete) {
      setAttempted(true);
      document.getElementById(`${id}-checkOut`)?.focus();
      return;
    }
    const search = serializeStayQuery({
      ...defaultStayQuery,
      category: type || null,
      guests: guests ? Number(guests) : null,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
    });
    router.push((search ? `/stays?${search}` : "/stays") as Route);
  };

  return (
    <form
      role="search"
      aria-label="Find a residence"
      action="/stays"
      method="get"
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-0"
    >
      <DateRangeSelector
        id={id}
        {...dates}
        onChange={(next) => {
          setDates(next);
          if (!next.checkIn || next.checkOut) setAttempted(false);
        }}
        errors={{ checkOut: checkOutError }}
      />
      <div className="grid grid-cols-2 gap-3 lg:contents">
        <SelectCell label="Guests" className="lg:-ml-px">
          <select name="guests" value={guests} onChange={(event) => setGuests(event.target.value)}>
            <option value="">Any number</option>
            {Array.from({ length: maxGuests }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </SelectCell>
        <SelectCell label="Residence" className="lg:-ml-px">
          <select
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as AccommodationCategory | "")}
          >
            <option value="">All types</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category].plural}
              </option>
            ))}
          </select>
        </SelectCell>
      </div>
      <Button type="submit" size="lg" className="w-full lg:ml-3 lg:h-auto lg:w-auto">
        <Search aria-hidden="true" className="size-4" strokeWidth={1.75} />
        Search stays
      </Button>
    </form>
  );
}

function SelectCell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cx(
        "relative flex min-h-16 flex-col justify-center border border-line-strong bg-white px-4 py-3 transition-colors hover:bg-sand-light has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-(--focus-ring)",
        // The select fills the cell so the whole field is one large click target.
        "[&_select]:absolute [&_select]:inset-0 [&_select]:cursor-pointer [&_select]:appearance-none [&_select]:bg-transparent [&_select]:px-4 [&_select]:pt-7 [&_select]:pr-10 [&_select]:pb-3 [&_select]:text-charcoal [&_select]:focus-visible:outline-none",
        className,
      )}
    >
      <span className="text-xs font-medium tracking-[0.14em] text-muted uppercase">{label}</span>
      {/* Reserves the height of the select's value, which is drawn by the select itself. */}
      <span aria-hidden="true" className="mt-1 block h-6" />
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 bottom-4 size-4 text-muted"
        strokeWidth={1.75}
      />
    </label>
  );
}
