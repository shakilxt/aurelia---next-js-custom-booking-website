import { describe, expect, it } from "vitest";
import { validateGuestDetails, validateInquiry } from "./validation";

const guest = { fullName: "Ana Silva", email: "ana@example.com", phone: "", specialRequests: "" };

describe("validateGuestDetails", () => {
  it("accepts and trims valid input", () => {
    expect(
      validateGuestDetails({ ...guest, fullName: "  Ana Silva  ", email: " ana@example.com " }),
    ).toEqual({
      ok: true,
      value: guest,
    });
  });

  it("reports each invalid field", () => {
    const res = validateGuestDetails({
      fullName: " ",
      email: "ana@",
      phone: "call me",
      specialRequests: "x".repeat(501),
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(Object.keys(res.errors).sort()).toEqual([
      "email",
      "fullName",
      "phone",
      "specialRequests",
    ]);
  });

  it.each(["ana@example", "ana example@x.com", "@example.com", "ana@example.c"])(
    "rejects email %j",
    (email) => {
      expect(validateGuestDetails({ ...guest, email }).ok).toBe(false);
    },
  );

  it.each(["+1 (555) 010-0142", "555 0100", "+44 20 7946 0958"])("accepts phone %j", (phone) => {
    expect(validateGuestDetails({ ...guest, phone }).ok).toBe(true);
  });

  it.each(["12345", "abc-def-ghij", "+1 555 010 0142 999 999"])("rejects phone %j", (phone) => {
    expect(validateGuestDetails({ ...guest, phone }).ok).toBe(false);
  });
});

describe("validateInquiry", () => {
  const inquiry = {
    fullName: "Ana Silva",
    email: "ana@example.com",
    message: "Do you host small weddings?",
  };

  it("accepts a valid inquiry", () => {
    expect(validateInquiry(inquiry).ok).toBe(true);
  });

  it("requires a meaningful message", () => {
    const res = validateInquiry({ ...inquiry, message: "  hi  " });
    expect(res.ok === false && res.errors.message).toBe(
      "Write a message of at least 10 characters.",
    );
    expect(validateInquiry({ ...inquiry, message: "x".repeat(1001) }).ok).toBe(false);
  });
});
