"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Thin bar across the top of the page while a link navigation is in flight.
 *
 * Pages have no loading.tsx, so a client navigation keeps showing the old page
 * until the new one commits; this bar is the feedback that the click registered.
 *
 * Start: a plain left-click on a same-origin <a> whose path or query differs from
 * the current one (next/link renders one). Hash-only links, new tabs, downloads and
 * modifier-clicks are left alone. Programmatic router.push() calls don't start it.
 *
 * Finish: Next writes the new URL with history.pushState/replaceState when the
 * navigation commits, so both are wrapped; that also covers query-only navigations,
 * which usePathname() would miss. The wrapper defers its state update because that
 * write happens inside a useInsertionEffect, where React forbids scheduling updates.
 * Back/forward (popstate) also finishes it. GIVE_UP_MS hides a bar whose navigation
 * never committed (a link whose own onClick cancelled it).
 *
 * z-50: above the sticky header (z-40). Modal dialogs sit in the top layer, above it.
 */
const SHOW_DELAY_MS = 150;
const TRICKLE_MS = 400;
const FINISH_MS = 300;
const GIVE_UP_MS = 60_000;

function isNavigationClick(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

export function NavigationProgress() {
  // null = hidden; otherwise the bar's scaleX, 0–1.
  const [progress, setProgress] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const timers = useRef<{
    show?: ReturnType<typeof setTimeout>;
    trickle?: ReturnType<typeof setTimeout>;
    hide?: ReturnType<typeof setTimeout>;
    giveUp?: ReturnType<typeof setTimeout>;
    shown?: boolean;
  }>({});

  useEffect(() => {
    const t = timers.current;
    let running = false;

    function clearTimers() {
      clearTimeout(t.show);
      clearTimeout(t.trickle);
      clearTimeout(t.hide);
      clearTimeout(t.giveUp);
    }

    function trickle() {
      // Eases toward 90% and never reaches it; only finish() completes the bar.
      setProgress((p) => (p === null ? p : p + (0.9 - p) * 0.1));
      t.trickle = setTimeout(trickle, TRICKLE_MS);
    }

    function start() {
      clearTimers();
      running = true;
      setFinishing(false);
      t.show = setTimeout(() => {
        t.shown = true;
        setProgress(0.1);
        t.trickle = setTimeout(trickle, TRICKLE_MS);
      }, SHOW_DELAY_MS);
      t.giveUp = setTimeout(finish, GIVE_UP_MS);
    }

    function finish() {
      if (!running) return;
      running = false;
      clearTimers();
      // Never shown (fast navigation): stay hidden instead of flashing a full bar.
      if (!t.shown) return;
      setProgress(1);
      setFinishing(true);
      t.hide = setTimeout(() => {
        t.shown = false;
        setProgress(null);
        setFinishing(false);
      }, FINISH_MS);
    }

    function handleClick(event: MouseEvent) {
      if (isNavigationClick(event)) start();
    }

    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    const finishSoon = () => setTimeout(finish, 0);
    window.history.pushState = function pushState(...args) {
      finishSoon();
      return originalPush.apply(this, args);
    };
    window.history.replaceState = function replaceState(...args) {
      finishSoon();
      return originalReplace.apply(this, args);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", finishSoon);
    return () => {
      clearTimers();
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", finishSoon);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  if (progress === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.75 print:hidden"
    >
      <div
        className={`h-full origin-left bg-gold transition-[transform,opacity] ease-out motion-reduce:transition-none ${finishing ? "opacity-0 duration-300" : "opacity-100 duration-500"}`}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
