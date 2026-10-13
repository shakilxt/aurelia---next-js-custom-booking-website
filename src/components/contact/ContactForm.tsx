"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import type { GuestInquiry } from "@/types/booking";
import { Button } from "@/components/ui/Button";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { ErrorSummary } from "@/components/ui/form/ErrorSummary";
import { TextArea } from "@/components/ui/form/TextArea";
import { TextField } from "@/components/ui/form/TextField";
import { useHydrated } from "@/components/ui/form/useHydrated";
import { limits, validateInquiry } from "@/lib/validation";

type Field = keyof GuestInquiry;
const fieldOrder: readonly Field[] = ["fullName", "email", "message"];

interface ContactFormProps {
  /** Prefilled message, e.g. from an experience's call to action. Never personal data. */
  initialMessage?: string;
}

/**
 * Demonstration enquiry form. Values live only in component state; a valid submit
 * shows an in-page acknowledgement and nothing is transmitted or stored.
 */
export function ContactForm({ initialMessage = "" }: ContactFormProps) {
  const id = useId();
  const hydrated = useHydrated();
  const summaryRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // Set when the visitor starts again, so focus can move to the fresh form.
  const restarted = useRef(false);
  const [values, setValues] = useState<GuestInquiry>({
    fullName: "",
    email: "",
    message: initialMessage,
  });
  const [attempts, setAttempts] = useState(0);
  const [sent, setSent] = useState<GuestInquiry | null>(null);

  const validation = validateInquiry(values);
  const errors = attempts > 0 && !validation.ok ? validation.errors : {};
  const fieldId = (field: Field) => `${id}-${field}`;
  const summaryErrors = fieldOrder.flatMap((field) => {
    const message = errors[field];
    return message ? [{ id: fieldId(field), message }] : [];
  });

  // Focus the summary after every failed submit, and the acknowledgement after success.
  useEffect(() => {
    if (attempts > 0) summaryRef.current?.focus();
  }, [attempts]);
  useEffect(() => {
    if (sent) successRef.current?.focus();
    else if (restarted.current) document.getElementById(`${id}-fullName`)?.focus();
    restarted.current = false;
  }, [sent, id]);

  const update = (field: Field) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validation.ok) setSent(validation.value);
    else setAttempts((count) => count + 1);
  };

  const startAgain = () => {
    restarted.current = true;
    setValues({ fullName: "", email: "", message: "" });
    setAttempts(0);
    setSent(null);
  };

  if (sent) {
    const firstName = sent.fullName.split(/\s+/)[0];
    return (
      <div className="border border-line bg-white p-6 sm:p-10">
        <CircleCheck aria-hidden="true" className="size-8 text-forest-800" strokeWidth={1.25} />
        <h2 ref={successRef} tabIndex={-1} className="mt-5 text-h3 text-forest-900">
          Thank you, {firstName}
        </h2>
        <p className="mt-4 text-muted">
          Your enquiry passed validation, but this is a demonstration: it was not sent, and nothing
          was stored. On a live site the concierge would reply to{" "}
          <span className="[overflow-wrap:anywhere] text-charcoal">{sent.email}</span>.
        </p>
        <figure className="mt-8 border-l-2 border-gold pl-5">
          <figcaption className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Your message (not sent)
          </figcaption>
          <blockquote className="mt-2 [overflow-wrap:anywhere] whitespace-pre-line text-charcoal">
            {sent.message}
          </blockquote>
        </figure>
        <Button variant="secondary" onClick={startAgain} className="mt-10">
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="border border-line bg-white p-6 sm:p-10">
      <h2 className="text-h3 text-forest-900">Send an enquiry</h2>
      <DemoNotice className="mt-3">
        Demonstration form: your enquiry is not sent anywhere, and nothing you type is stored.
      </DemoNotice>

      {summaryErrors.length > 0 ? (
        <div className="mt-8">
          <ErrorSummary ref={summaryRef} errors={summaryErrors} />
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        <TextField
          id={fieldId("fullName")}
          name="fullName"
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          onChange={(event) => update("fullName")(event.target.value)}
          error={errors.fullName}
        />
        <TextField
          id={fieldId("email")}
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          spellCheck={false}
          value={values.email}
          onChange={(event) => update("email")(event.target.value)}
          error={errors.email}
        />
        <TextArea
          id={fieldId("message")}
          name="message"
          label="Message"
          hint={`Between ${limits.messageMin} and ${limits.messageMax} characters.`}
          rows={6}
          countLimit={limits.messageMax}
          value={values.message}
          onChange={(event) => update("message")(event.target.value)}
          error={errors.message}
        />
      </div>

      {/* Disabled until hydration so a native submit can't put details in the URL. */}
      <Button type="submit" size="lg" disabled={!hydrated} className="mt-8 w-full sm:w-auto">
        Send demo enquiry
      </Button>
    </form>
  );
}
