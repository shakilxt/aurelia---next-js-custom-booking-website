"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * Element to focus after opening, as a selector within the dialog. Defaults to the
   * browser's behaviour (the first focusable element, i.e. the close button).
   */
  initialFocus?: string;
}

/**
 * Modal built on the native <dialog>: the browser provides focus containment, an
 * inert background, Escape to close and focus return to the opener. Renders as a
 * bottom sheet on small screens and a centred panel above that.
 */
export function Dialog({ open, onClose, title, children, footer, initialFocus }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      if (initialFocus) dialog.querySelector<HTMLElement>(initialFocus)?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocus]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="modal m-auto max-h-[min(92dvh,52rem)] w-full max-w-3xl overflow-hidden bg-ivory p-0 text-charcoal shadow-soft max-sm:mb-0 max-sm:max-w-none"
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-8">
          <h2 id={titleId} className="text-h3 text-forest-900">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => ref.current?.close()}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm hover:bg-sand-light"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-6 sm:px-8">{open ? children : null}</div>
        {footer ? <div className="border-t border-line px-5 py-4 sm:px-8">{footer}</div> : null}
      </div>
    </dialog>
  );
}
