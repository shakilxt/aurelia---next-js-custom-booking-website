import { cx } from "@/lib/cx";

interface LoadingStateProps {
  /** Announced to assistive technology while content loads. */
  label: string;
  /** Number of placeholder cards. */
  count?: number;
  className?: string;
}

/** Skeleton for card grids; shapes mirror AccommodationCard to avoid layout shift. */
export function LoadingState({ label, count = 6, className }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className={cx("animate-pulse", index > 2 && "max-lg:hidden")}>
            <div className="aspect-4/3 bg-sand" />
            <div className="mt-5 h-3 w-20 bg-sand" />
            <div className="mt-3 h-7 w-3/4 bg-sand" />
            <div className="mt-3 h-4 w-full bg-sand-light" />
            <div className="mt-2 h-4 w-2/3 bg-sand-light" />
          </div>
        ))}
      </div>
    </div>
  );
}
