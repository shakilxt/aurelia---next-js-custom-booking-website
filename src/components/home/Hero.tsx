import Link from "next/link";
import type { Route } from "next";
import type { MediaAsset } from "@/types/media";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";

interface HeroProps {
  image: MediaAsset;
}

/** Shortcuts into the stays listing, filtered by residence type. */
const stayTypes: readonly { label: string; href: Route }[] = [
  { label: "Pool villas", href: "/stays?type=villa" },
  { label: "Ocean suites", href: "/stays?type=suite" },
  { label: "Garden bungalows", href: "/stays?type=bungalow" },
];

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
      className="relative isolate -mt-(--header-h) flex min-h-[max(40rem,100svh)] items-end overflow-hidden bg-forest-900 text-shell"
    >
      {/* The 3:2 photo covers the hero, so narrow/tall viewports render it wider than 100vw. */}
      <ResortImage
        asset={image}
        fill
        aboveTheFold
        // Under dark scrims, a lower quality is visually lossless and saves ~25% on phones.
        quality={60}
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
        <div className="@container lg:col-span-9">
          <p className="flex items-center gap-4 text-eyebrow font-medium text-shell/90 uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Concept resort · South Pacific
          </p>
          {/* Capped by the column width (cqi) so "Where the world" always fits on one line. */}
          <h1
            id="hero-title"
            className="mt-6 max-w-4xl text-display text-[length:min(var(--text-display),12.5cqi)]"
          >
            Where the world grows quiet
          </h1>
          <p className="mt-7 max-w-xl text-lead text-shell/85">
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

        <nav
          aria-label="Stays by type"
          className="hidden border-t border-gold/60 pt-6 lg:col-span-3 lg:col-start-10 lg:block"
        >
          <ul className="space-y-1 text-sm tracking-[0.12em] uppercase">
            {stayTypes.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-7 items-center text-shell/80 underline-offset-6 transition-colors hover:text-shell hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
