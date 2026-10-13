import { Check } from "lucide-react";
import { cx } from "@/lib/cx";

const steps = [
  { id: "residence", label: "Residence" },
  { id: "details", label: "Your details" },
  { id: "confirmation", label: "Confirmation" },
] as const;

export type BookingStep = (typeof steps)[number]["id"];

/** Progress through the simulated booking. Presentational; works on either side. */
export function BookingSteps({ current }: { current: BookingStep }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol
      aria-label="Booking progress"
      className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-3"
    >
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li
            key={step.id}
            aria-current={active ? "step" : undefined}
            className="flex items-center gap-3 text-sm"
          >
            {index > 0 ? (
              <span aria-hidden="true" className="h-px w-10 bg-line-strong max-sm:hidden" />
            ) : null}
            <span
              aria-hidden="true"
              className={cx(
                "flex size-7 items-center justify-center rounded-full border text-xs tabular-nums",
                active && "border-forest-800 bg-forest-800 text-shell",
                done && "border-forest-800 text-forest-800",
                !active && !done && "border-line-strong text-muted",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={2} /> : index + 1}
            </span>
            <span className={active ? "font-medium text-charcoal" : "text-muted"}>
              {step.label}
              {done ? <span className="sr-only"> (completed)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
