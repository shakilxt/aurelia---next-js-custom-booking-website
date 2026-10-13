import type { MediaAsset } from "@/types/media";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";

interface HeroProps {
  image: MediaAsset;
}

const stayTypes = ["Pool villas", "Ocean suites", "Garden bungalows"] as const;

/**
 * Full-bleed opening section. `data-header-overlay` lets the site header sit
 * transparently over the photograph until the visitor scrolls.
 */
export function Hero({ image }: HeroProps) {
  return (
    <section
      data-header-overlay=""
      data-surface="dark"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--header-h) flex min-h-[max(40rem,100svh)] items-end overflow-hidden bg-forest-900 text-ivory"
    >
      {/* The 3:2 photo covers the hero, so narrow/tall viewports render it wider than 100vw. */}
      <ResortImage
        asset={image}
        fill
        aboveTheFold
        sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
        className="-z-20"
      />
      {/* Functional scrims: keep the header and headline legible on any photograph. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-forest-900/55 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 hidden w-3/4 bg-linear-to-r from-forest-900/60 via-forest-900/25 to-transparent lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[80%] bg-linear-to-t from-forest-900/90 via-forest-900/55 to-transparent"
      />

      <Container className="grid gap-12 pt-40 pb-14 sm:pb-20 lg:grid-cols-12 lg:items-end lg:pb-44">
        <div className="lg:col-span-8">
          <p className="flex items-center gap-4 text-eyebrow font-medium text-ivory/90 uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Concept resort · South Pacific
          </p>
          <h1 id="hero-title" className="mt-6 max-w-4xl text-display">
            Stillness, shaped <em className="font-serif italic">by the sea</em>
          </h1>
          <p className="mt-7 max-w-xl text-lead text-ivory/85">
            Pool villas, ocean suites and garden bungalows set among palms, white sand and a quiet
            lagoon — a private island retreat for unhurried days.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/stays" variant="light" size="lg">
              Explore stays
            </ButtonLink>
            <ButtonLink href="/book" variant="outline-light" size="lg">
              Plan your stay
            </ButtonLink>
          </div>
        </div>

        <ul className="hidden border-t border-gold/60 pt-6 text-sm tracking-[0.12em] text-ivory/80 uppercase lg:col-span-3 lg:col-start-10 lg:block lg:space-y-2">
          {stayTypes.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
