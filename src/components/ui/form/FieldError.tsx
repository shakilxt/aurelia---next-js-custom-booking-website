import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cx } from "@/lib/cx";

interface FieldErrorProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/** Inline validation message, referenced from its control via `aria-describedby`. */
export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} className={cx("mt-2 flex gap-1.5 text-sm text-danger", className)}>
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  );
}
