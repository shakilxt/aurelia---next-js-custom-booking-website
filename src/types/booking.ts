import type { IsoDate, MinorUnits } from "./common";

export interface GuestCount {
  adults: number;
  children: number;
}

/** The stay a visitor is pricing. Never persisted; the total is always recomputed. */
export interface BookingDraft extends GuestCount {
  accommodationSlug: string;
  checkIn: IsoDate;
  checkOut: IsoDate;
  estimatedTotalMinor: MinorUnits;
}

/** Transient form data for the simulated booking; never stored or transmitted. */
export interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

/** Transient contact-form data; never stored or transmitted. */
export interface GuestInquiry {
  fullName: string;
  email: string;
  message: string;
}
