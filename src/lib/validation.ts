import type { GuestDetails, GuestInquiry } from "@/types/booking";

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export type ValidationResult<Value, Field extends string> =
  { ok: true; value: Value } | { ok: false; errors: FieldErrors<Field> };

export function result<Value, Field extends string>(
  value: Value,
  errors: FieldErrors<Field>,
): ValidationResult<Value, Field> {
  return Object.keys(errors).length === 0 ? { ok: true, value } : { ok: false, errors };
}

// Deliberately permissive: catches typos without rejecting valid but unusual addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARACTERS = /^[+\d\s().-]+$/;

export const limits = {
  nameMax: 80,
  emailMax: 254,
  requestsMax: 500,
  messageMin: 10,
  messageMax: 1000,
} as const;

function nameError(value: string) {
  if (value.length < 2) return "Enter your full name.";
  if (value.length > limits.nameMax) return `Keep your name under ${limits.nameMax} characters.`;
  return undefined;
}

function emailError(value: string) {
  if (!value) return "Enter your email address.";
  if (value.length > limits.emailMax || !EMAIL.test(value)) {
    return "Enter a valid email address, like name@example.com.";
  }
  return undefined;
}

function phoneError(value: string) {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "").length;
  if (!PHONE_CHARACTERS.test(value) || digits < 6 || digits > 15) {
    return "Enter a valid phone number, or leave this field blank.";
  }
  return undefined;
}

function compact<Field extends string>(
  errors: Record<Field, string | undefined>,
): FieldErrors<Field> {
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  ) as FieldErrors<Field>;
}

/** Validates the simulated booking's guest form. Values are trimmed before checking. */
export function validateGuestDetails(
  input: GuestDetails,
): ValidationResult<GuestDetails, keyof GuestDetails> {
  const value: GuestDetails = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    specialRequests: input.specialRequests.trim(),
  };

  return result(
    value,
    compact<keyof GuestDetails>({
      fullName: nameError(value.fullName),
      email: emailError(value.email),
      phone: phoneError(value.phone),
      specialRequests:
        value.specialRequests.length > limits.requestsMax
          ? `Keep requests under ${limits.requestsMax} characters.`
          : undefined,
    }),
  );
}

/** Validates the demo contact form. Values are trimmed before checking. */
export function validateInquiry(
  input: GuestInquiry,
): ValidationResult<GuestInquiry, keyof GuestInquiry> {
  const value: GuestInquiry = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  };

  let messageError: string | undefined;
  if (value.message.length < limits.messageMin) {
    messageError = `Write a message of at least ${limits.messageMin} characters.`;
  } else if (value.message.length > limits.messageMax) {
    messageError = `Keep your message under ${limits.messageMax} characters.`;
  }

  return result(
    value,
    compact<keyof GuestInquiry>({
      fullName: nameError(value.fullName),
      email: emailError(value.email),
      message: messageError,
    }),
  );
}
