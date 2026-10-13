import type { MediaAsset } from "@/types/media";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ResortImage } from "@/components/ui/ResortImage";

export function ClosingCta({ image }: { image: MediaAsset }) {
  return (
    <section
      aria-labelledby="closing-cta"
      data-surface="dark"
      className="relative isolate overflow-hidden bg-forest-900 text-ivory"
    >
      <ResortImage asset={image} fill sizes="100vw" className="-z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-forest-900/65" />
      <Container className="flex min-h-[32rem] reveal flex-col items-center justify-center py-24 text-center lg:min-h-[38rem]">
        <p className="text-eyebrow font-medium text-ivory/90 uppercase">Plan your stay</p>
        <h2 id="closing-cta" className="mt-5 max-w-3xl text-h1">
          Slow down, by the lagoon
        </h2>
        <p className="mt-6 max-w-xl text-lead text-ivory/85">
          Choose a residence, your dates and your party to see an estimated total in moments. It’s a
          demonstration, so nothing is reserved.
        </p>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/book" variant="light" size="lg">
            Plan your stay
          </ButtonLink>
          <ButtonLink href="/stays" variant="outline-light" size="lg">
            Explore stays
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
