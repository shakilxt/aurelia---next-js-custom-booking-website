import { useSyncExternalStore } from "react";
import type { IsoDate } from "@/types/common";
import { todayIso } from "@/lib/dates";

const subscribe = () => () => {};

/**
 * The visitor's local date, or null during server rendering and hydration. Keeps
 * "today" out of server output, which would otherwise use the server's time zone
 * and cause hydration mismatches.
 */
export function useToday(): IsoDate | null {
  return useSyncExternalStore(
    subscribe,
    () => todayIso(),
    () => null,
  );
}
