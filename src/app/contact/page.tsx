import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormFromUrl } from "@/components/contact/ContactFormFromUrl";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { experienceEnquiry, getAllExperiences } from "@/lib/experiences";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact the AURELIA concept resort. A demonstration enquiry form — no message is transmitted.",
  path: "/contact",
});

const details: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Mail, label: "Email", value: site.contact.email },
  { icon: Phone, label: "Phone", value: site.contact.phone },
  { icon: Clock, label: "Hours", value: site.contact.hours },
  { icon: MapPin, label: "Location", value: site.location },
];

export default function ContactPage() {
  const enquiries = Object.fromEntries(
    getAllExperiences().map((experience) => [experience.slug, experienceEnquiry(experience)]),
  );

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Begin a conversation"
        description="Questions about a stay, an experience or a celebration on the island. This is a demonstration: enquiries are not sent anywhere."
      />
      <Container className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <section aria-labelledby="concierge" className="lg:col-span-4">
          <h2 id="concierge" className="text-h3 text-forest-900">
            The concierge
          </h2>
          <p className="mt-3 text-muted">
            A single team looks after reservations, experiences and arrivals.
          </p>
          <dl className="mt-8 space-y-6 border-t border-line pt-8">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-muted uppercase">
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-gold-ink"
                    strokeWidth={1.5}
                  />
                  {label}
                </dt>
                <dd className="mt-1 pl-7 [overflow-wrap:anywhere] text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 border-l-2 border-gold pl-4 text-sm text-muted">
            These are fictional demonstration details. The email uses a reserved example domain and
            the phone number is from a range set aside for fiction.
          </p>
        </section>

        <div className="lg:col-span-7 lg:col-start-6">
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromUrl enquiries={enquiries} />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
