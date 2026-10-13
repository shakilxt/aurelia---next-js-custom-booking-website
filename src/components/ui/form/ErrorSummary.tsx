"use client";

import { useId, type Ref } from "react";

export interface SummaryError {
  /** Id of the control (or group) the message belongs to. */
  id: string;
  message: string;
}

interface ErrorSummaryProps {
  errors: readonly SummaryError[];
  title?: string;
  ref?: Ref<HTMLElement>;
}

const FOCUSABLE = "input, select, textarea, button, [href], [tabindex]:not([tabindex='-1'])";

function focusField(id: string) {
  const target = document.getElementById(id);
  const control = target?.matches(FOCUSABLE)
    ? target
    : target?.querySelector<HTMLElement>(FOCUSABLE);
  control?.focus();
}

/**
 * Lists every problem after a failed submit, with links that move focus to each
 * field. The parent focuses the summary itself, so screen readers hear it first.
 */
export function ErrorSummary({
  errors,
  title = "Some details need attention",
  ref,
}: ErrorSummaryProps) {
  const headingId = useId();
  if (errors.length === 0) return null;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="border-l-4 border-danger bg-white p-5 sm:p-6"
    >
      <h2 id={headingId} className="font-sans text-base font-medium text-danger">
        {title}
      </h2>
      <ul className="mt-3 space-y-1.5">
        {errors.map((error) => (
          <li key={error.id}>
            <a
              href={`#${error.id}`}
              onClick={(event) => {
                event.preventDefault();
                focusField(error.id);
              }}
              className="text-sm text-danger underline underline-offset-4 hover:no-underline"
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
