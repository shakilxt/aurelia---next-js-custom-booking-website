"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const SCROLL_THRESHOLD = 8;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getServerScrolled = () => false;

/**
 * Sticky header shell. Exposes `data-scrolled` so CSS can switch the header from
 * its transparent hero overlay to a solid surface; the markup inside stays server-rendered.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, getScrolled, getServerScrolled);

  return (
    <header
      data-site-header=""
      data-scrolled={scrolled ? "" : undefined}
      className="sticky top-0 z-40"
    >
      {children}
    </header>
  );
}
