import { useId } from "react";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const stepButton =
  "inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-forest-900 transition-colors hover:border-forest-800 aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:text-charcoal/30 aria-disabled:hover:border-line";

/**
 * Stepper for small whole numbers. Limits use aria-disabled rather than `disabled`
 * so keyboard focus is not lost when a button reaches its bound.
 */
export function Counter({ label, description, value, min, max, onChange }: CounterProps) {
  const id = useId();
  const atMin = value <= min;
  const atMax = value >= max;
  const noun = label.toLowerCase();

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="flex items-center justify-between gap-4"
    >
      <div>
        <p id={`${id}-label`} className="text-charcoal">
          {label}
        </p>
        {description ? <p className="text-xs text-muted">{description}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Fewer ${noun}`}
          aria-disabled={atMin}
          onClick={() => !atMin && onChange(value - 1)}
          className={stepButton}
        >
          <Minus aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </button>
        <output
          aria-live="polite"
          aria-label={`${value} ${noun}`}
          className="w-6 text-center tabular-nums"
        >
          {value}
        </output>
        <button
          type="button"
          aria-label={`More ${noun}`}
          aria-disabled={atMax}
          onClick={() => !atMax && onChange(value + 1)}
          className={stepButton}
        >
          <Plus aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
