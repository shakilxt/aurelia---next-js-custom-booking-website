"use client";

import { useOptimistic, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { AccommodationCategory } from "@/types/accommodation";
import { cx } from "@/lib/cx";
import { formatMoney, majorToMinor } from "@/lib/money";
import { categoryLabels } from "@/lib/stays";
import {
  defaultStayQuery,
  isFiltered,
  maxRateOptions,
  serializeStayQuery,
  staySortOptions,
  type StayQuery,
} from "@/lib/stay-query";

interface StayExplorerProps {
  /** The query the server rendered `children` for. */
  query: StayQuery;
  resultCount: number;
  totalCount: number;
  /** Largest capacity in the collection, used for the guest options. */
  maxCapacity: number;
  /** Server-rendered results. */
  children: ReactNode;
}

const typeOptions: { value: AccommodationCategory | null; label: string }[] = [
  { value: null, label: "All" },
  ...(["villa", "suite", "bungalow"] as const).map((value) => ({
    value,
    label: categoryLabels[value].plural,
  })),
];

/**
 * Filter controls for /stays. The URL is the single source of truth: each change
 * replaces the URL inside a transition, the server re-renders the results, and
 * `useOptimistic` keeps the controls responsive while that happens.
 */
export function StayExplorer({
  query,
  resultCount,
  totalCount,
  maxCapacity,
  children,
}: StayExplorerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setOptimistic] = useOptimistic(query);

  const navigate = (next: StayQuery) => {
    const search = serializeStayQuery(next);
    startTransition(() => {
      setOptimistic(next);
      router.replace((search ? `/stays?${search}` : "/stays") as Route, { scroll: false });
    });
  };
  const update = (patch: Partial<StayQuery>) => navigate({ ...current, ...patch });

  const guestValues = Array.from(
    { length: Math.max(maxCapacity, current.guests ?? 0) },
    (_, i) => i + 1,
  );
  const rateValues = [
    ...new Set<number>([...maxRateOptions, ...(current.maxRate ? [current.maxRate] : [])]),
  ].sort((a, b) => a - b);

  return (
    <>
      <form
        role="search"
        aria-label="Filter residences"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-6 border-y border-line py-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-10"
      >
        <fieldset>
          <legend className="mb-2.5 text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Residence type
          </legend>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => (
              <label
                key={option.label}
                className="inline-flex h-11 cursor-pointer items-center rounded-sm border border-line-strong px-4 text-sm transition-colors select-none hover:border-forest-800 has-checked:border-forest-800 has-checked:bg-forest-800 has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus-ring)"
              >
                <input
                  type="radio"
                  name="type"
                  className="sr-only"
                  checked={current.category === option.value}
                  onChange={() => update({ category: option.value })}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Guests"
            value={current.guests ?? ""}
            onChange={(value) => update({ guests: value ? Number(value) : null })}
          >
            <option value="">Any number</option>
            {guestValues.map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Nightly rate"
            value={current.maxRate ?? ""}
            onChange={(value) => update({ maxRate: value ? Number(value) : null })}
          >
            <option value="">Any rate</option>
            {rateValues.map((rate) => (
              <option key={rate} value={rate}>
                Up to {formatMoney(majorToMinor(rate))}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Sort by"
            value={current.sort}
            onChange={(value) => update({ sort: value as StayQuery["sort"] })}
          >
            {staySortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>
      </form>

      <div className="mt-8 flex min-h-11 flex-wrap items-center justify-between gap-4">
        <p role="status" className="text-sm text-muted">
          {pending ? "Updating results…" : `Showing ${resultCount} of ${totalCount} residences`}
        </p>
        {isFiltered(current) ? (
          <button
            type="button"
            onClick={() =>
              navigate({
                ...defaultStayQuery,
                sort: current.sort,
                checkIn: current.checkIn,
                checkOut: current.checkOut,
              })
            }
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-forest-900 underline-offset-4 hover:underline"
          >
            <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} />
            Reset filters
          </button>
        ) : null}
      </div>

      <div
        aria-busy={pending}
        className={cx("mt-8 transition-opacity duration-300", pending && "opacity-50")}
      >
        {children}
      </div>
    </>
  );
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}

function SelectField({ label, value, onChange, children }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-medium tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-sm border border-line-strong bg-white pr-10 pl-3.5 text-sm text-charcoal transition-colors hover:border-forest-800"
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
          strokeWidth={1.75}
        />
      </span>
    </label>
  );
}
