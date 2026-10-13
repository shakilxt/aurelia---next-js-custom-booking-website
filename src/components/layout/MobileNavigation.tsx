"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { NavLink } from "./NavLink";

interface MobileNavigationProps {
  items: readonly NavItem[];
  cta: NavItem;
  note: string;
}

/** Matches the `lg` breakpoint, where the inline navigation takes over. */
const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Off-canvas menu built on the native modal <dialog>: the browser provides focus
 * containment, Escape handling and an inert background.
 */
export function MobileNavigation({ items, cta, note }: MobileNavigationProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogId = useId();

  const close = () => dialogRef.current?.close();

  // Close after client-side navigation (covers links outside the menu too).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // A hidden-but-open modal would leave the page inert, so close when crossing into desktop.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => {
          dialogRef.current?.showModal();
          closeRef.current?.focus();
          setOpen(true);
        }}
      >
        <Menu aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Site menu"
        className="sheet fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto bg-ivory p-0 text-charcoal sm:border-l sm:border-line lg:hidden"
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          // Clicks on the backdrop target the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="flex min-h-full flex-col px-6 pb-8">
          <div className="flex h-(--header-h) items-center justify-between">
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.32em] text-forest-900"
              onClick={close}
            >
              AURELIA
            </Link>
            <button
              ref={closeRef}
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm"
              aria-label="Close menu"
              onClick={close}
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-8">
            <ul className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onNavigate={close}
                    className="flex items-center justify-between py-4 font-serif text-[2rem] leading-tight text-forest-900 aria-[current=page]:text-gold-ink"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={cta.href}
            onClick={close}
            className={cx(buttonClasses({ size: "lg" }), "mt-10 w-full")}
          >
            {cta.label}
          </Link>

          <p className="mt-auto pt-10 text-sm leading-relaxed text-muted">{note}</p>
        </div>
      </dialog>
    </>
  );
}
