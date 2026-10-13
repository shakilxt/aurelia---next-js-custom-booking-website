import type { GuestCount } from "@/types/booking";
import { Counter } from "@/components/ui/Counter";
import { guestLimits } from "@/lib/booking";

interface GuestSelectorProps extends GuestCount {
  capacity: number;
  onChange: (guests: GuestCount) => void;
  error?: string;
  errorId?: string;
}

export function GuestSelector({
  adults,
  children,
  capacity,
  onChange,
  error,
  errorId,
}: GuestSelectorProps) {
  const { maxAdults, maxChildren } = guestLimits(capacity, { adults, children });

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
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
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
