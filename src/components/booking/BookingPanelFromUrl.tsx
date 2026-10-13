"use client";

import { useSearchParams } from "next/navigation";
import { parseBookingParams } from "@/lib/booking-params";
import { BookingPanel, type BookableStay } from "./BookingPanel";

/**
 * Reads dates and guests shared in the URL (e.g. from the homepage search). Render it
 * inside <Suspense> with a plain <BookingPanel> fallback so the page stays static.
 */
export function BookingPanelFromUrl({ stay }: { stay: BookableStay }) {
  const params = parseBookingParams(useSearchParams());
  return <BookingPanel stay={stay} initial={params} />;
}
