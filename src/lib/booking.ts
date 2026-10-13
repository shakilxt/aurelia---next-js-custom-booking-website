import { stayRules } from "@/data/pricing";
import type { GuestCount } from "@/types/booking";
import type { IsoDate } from "@/types/common";
import { addMonths, compareIsoDates, formatDate, nightsBetween } from "./dates";
import { result, type FieldErrors, type ValidationResult } from "./validation";

export type StayField = "checkIn" | "checkOut" | "guests";

export interface StaySelectionInput extends GuestCount {
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
}

export interface ValidStaySelection extends GuestCount {
  checkIn: IsoDate;
  checkOut: IsoDate;
  nights: number;
}

interface StayContext {
  /** Maximum total guests for the selected residence. */
  capacity: number;
  /** The visitor's local date; see `todayIso`. */
  today: IsoDate;
}

/** The latest permitted check-in date. */
export function latestCheckIn(today: IsoDate): IsoDate {
  return addMonths(today, stayRules.bookingHorizonMonths);
}

/** Per-field maximums for guest steppers, given the other field's current value. */
export function guestLimits(capacity: number, guests: GuestCount) {
  return {
    maxAdults: Math.max(1, capacity - guests.children),
    maxChildren: Math.max(0, capacity - guests.adults),
  };
}

function guestsError({ adults, children }: GuestCount, capacity: number) {
  if (!Number.isInteger(adults) || adults < 1) return "At least one adult is required.";
  if (!Number.isInteger(children) || children < 0) return "Enter a valid number of children.";
  if (adults + children > capacity) {
    return `This residence sleeps up to ${capacity} ${capacity === 1 ? "guest" : "guests"}.`;
  }
  return undefined;
}

export function validateStaySelection(
  input: StaySelectionInput,
  { capacity, today }: StayContext,
): ValidationResult<ValidStaySelection, StayField> {
  const errors: FieldErrors<StayField> = {};
  const { checkIn, checkOut } = input;
  const latest = latestCheckIn(today);

  if (!checkIn) errors.checkIn = "Choose a check-in date.";
  else if (compareIsoDates(checkIn, today) < 0) errors.checkIn = "Check-in can’t be in the past.";
  else if (compareIsoDates(checkIn, latest) > 0) {
    errors.checkIn = `Choose a check-in date on or before ${formatDate(latest)}.`;
  }

  if (!checkOut) errors.checkOut = "Choose a check-out date.";
  else if (checkIn && compareIsoDates(checkOut, checkIn) <= 0) {
    errors.checkOut = "Check-out must be after check-in.";
  } else if (checkIn && nightsBetween(checkIn, checkOut) > stayRules.maxNights) {
    errors.checkOut = `Stays can be up to ${stayRules.maxNights} nights.`;
  }

  const guests = guestsError(input, capacity);
  if (guests) errors.guests = guests;

  if (!checkIn || !checkOut) return { ok: false, errors };
  return result(
    {
      checkIn,
      checkOut,
      adults: input.adults,
      children: input.children,
      nights: nightsBetween(checkIn, checkOut),
    },
    errors,
  );
}
