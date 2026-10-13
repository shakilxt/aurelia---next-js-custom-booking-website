import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { FieldError } from "./FieldError";

export interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Marks the label "(optional)"; fields are required by default. */
  optional?: boolean;
  className?: string;
}

/** Accessibility attributes every control inside a `FieldFrame` receives. */
export function fieldControlProps({ id, hint, error, optional }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    required: !optional,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}

const controlClasses =
  "block w-full rounded-xs border border-line-strong bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-muted hover:border-charcoal/70 aria-invalid:border-danger aria-invalid:shadow-[inset_0_0_0_1px_var(--color-danger)]";

interface FieldFrameProps extends FieldProps {
  children: ReactNode;
  /** Rendered beside the error, e.g. a character count. */
  aside?: ReactNode;
}

/** Label, hint and error layout shared by every text control. */
export function FieldFrame({
  id,
  label,
  hint,
  error,
  optional,
  className,
  aside,
  children,
}: FieldFrameProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-medium text-charcoal">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2.5">{children}</div>
      {error || aside ? (
        <div className="flex items-start justify-between gap-4">
          {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : <span />}
          {aside}
        </div>
      ) : null}
    </div>
  );
}

export const cxControl = (className?: string) => cx(controlClasses, className);
