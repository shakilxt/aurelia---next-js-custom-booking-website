import type { Testimonial } from "@/types/testimonial";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Fictional guest notes. The section and every note carry a visible demo label so
 * they can't be mistaken for verified reviews.
 */
export function Testimonials({ testimonials }: { testimonials: readonly Testimonial[] }) {
  return (
    <Container as="section" className="section-y">
      <div className="reveal">
        <SectionHeading
          id="guest-notes"
          eyebrow="Guest notes"
          title="Remembered slowly"
          align="center"
        />
        <DemoNotice className="mx-auto mt-5 w-fit">
          Fictional notes written for this demonstration, not reviews from real guests.
        </DemoNotice>
      </div>
      <ul className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="flex reveal">
            <figure className="flex w-full flex-col border border-line bg-white p-7 sm:p-9">
              <span aria-hidden="true" className="-mb-3 font-serif text-6xl leading-none text-gold">
                “
              </span>
              <blockquote className="mt-2 font-serif text-[1.375rem] leading-snug text-forest-900">
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-8 text-sm">
                <span>
                  <span className="block font-medium text-charcoal">
                    {testimonial.guestDisplayName}
                  </span>
                  {testimonial.stayLabel ? (
                    <span className="text-muted">{testimonial.stayLabel}</span>
                  ) : null}
                </span>
                <span className="border border-line-strong px-2 py-0.5 text-xs tracking-[0.12em] text-muted uppercase">
                  Demo content
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Container>
  );
}
