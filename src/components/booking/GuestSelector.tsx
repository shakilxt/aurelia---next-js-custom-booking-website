import { useId } from "react";
import type { GuestCount } from "@/types/booking";
import { Counter } from "@/components/ui/Counter";
import { FieldError } from "@/components/ui/form/FieldError";
import { guestLimits } from "@/lib/booking";

interface GuestSelectorProps extends GuestCount {
  id?: string;
  capacity: number;
  onChange: (guests: GuestCount) => void;
  error?: string;
}

export function GuestSelector({
  id,
  adults,
  children,
  capacity,
  onChange,
  error,
}: GuestSelectorProps) {
  const errorId = useId();
  const { maxAdults, maxChildren } = guestLimits(capacity, { adults, children });

  return (
    <fieldset id={id} aria-describedby={error ? errorId : undefined}>
      <legend className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Guests</legend>
      <div className="mt-4 space-y-4">
        <Counter
          label="Adults"
          description="Ages 13 and over"
          value={adults}
          min={1}
          max={maxAdults}
          onChange={(value) => onChange({ adults: value, children })}
        />
        <Counter
          label="Children"
          description="Ages 2 to 12"
          value={children}
          min={0}
          max={maxChildren}
          onChange={(value) => onChange({ adults, children: value })}
        />
      </div>
      <p className="mt-3 text-xs text-muted">
        Sleeps up to {capacity} {capacity === 1 ? "guest" : "guests"}, including children.
      </p>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  );
}
