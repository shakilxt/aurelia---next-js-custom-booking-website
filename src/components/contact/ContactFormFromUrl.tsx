"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";

interface ContactFormFromUrlProps {
  /** Prefill messages by experience slug, computed on the server. */
  enquiries: Readonly<Record<string, string>>;
}

/**
 * Prefills the message from `?experience=<slug>`. Reading search params on the client
 * keeps /contact static (the page renders a plain `ContactForm` as the Suspense
 * fallback), and passing the messages in keeps experience data out of the bundle.
 */
export function ContactFormFromUrl({ enquiries }: ContactFormFromUrlProps) {
  const slug = useSearchParams().get("experience");
  const message = slug && Object.hasOwn(enquiries, slug) ? enquiries[slug] : undefined;
  return <ContactForm initialMessage={message} />;
}
