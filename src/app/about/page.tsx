import { ClosingCta } from "@/components/home/ClosingCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { ResortImage } from "@/components/ui/ResortImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { media } from "@/data/media";
import { getAllExperiences } from "@/lib/experiences";
import { pageMetadata } from "@/lib/metadata";
import { categoryLabels, getAllStays } from "@/lib/stays";

export const metadata = pageMetadata({
  title: "About",
  description:
    "The story, hospitality philosophy and sustainable design approach behind AURELIA, a fictional island resort concept.",
  path: "/about",
});

const principles = [
  {
    title: "Space before spectacle",
    detail:
      "Few residences, far apart. Privacy comes from distance and planting, not walls, and every room looks out rather than in.",
  },
  {
    title: "Craft you can touch",
    detail:
      "Timber, stone, linen and woven palm, shaped by island makers. Materials are left honest, so they weather rather than wear.",
  },
  {
    title: "Service that listens",
    detail:
      "One host per stay, no scripts. Plans follow the guest, the tide and the weather, and quiet is treated as a request.",
  },
] as const;

const designIntentions = [
  {
    title: "Built lightly",
    detail: "Raised timber footings and boardwalks leave roots, sand and drainage undisturbed.",
  },
  {
    title: "Shade before cooling",
    detail:
      "Deep eaves, cross-breezes and planted screens do most of the work of air conditioning.",
  },
  {
    title: "Water kept local",
    detail: "Rain is gathered from roofs and garden water is filtered through planted wetlands.",
  },
  {
    title: "The reef comes first",
    detail: "Fixed moorings instead of anchors, reef-safe amenities and a limit on boats at sea.",
  },
] as const;

export default function AboutPage() {
  const stays = getAllStays();
  const count = (category: keyof typeof categoryLabels) =>
    stays.filter((stay) => stay.category === category).length;
  const largest = Math.max(...stays.map((stay) => stay.areaSquareMeters));
  const facts = [
    { value: String(stays.length), label: "Private residences" },
    {
      value: `${count("villa")} · ${count("suite")} · ${count("bungalow")}`,
      label: "Villas, suites and bungalows",
    },
    { value: `${largest} m²`, label: "Largest residence" },
    { value: String(getAllExperiences().length), label: "Curated experiences" },
  ];

  return (
    <>
      <PageIntro
        eyebrow="About"
        title="A quieter kind of luxury"
        description="AURELIA is a design concept for an island retreat built around nature, craft and generous space."
      >
        <DemoNotice className="mt-6">
          Concept copy. AURELIA is fictional: its story, practices and figures describe a design
          idea, not a real business.
        </DemoNotice>
      </PageIntro>

      <Container
        as="section"
        className="grid gap-12 pb-20 lg:grid-cols-12 lg:items-center lg:pb-28"
      >
        <div className="relative aspect-4/3 reveal overflow-hidden bg-mist lg:col-span-7">
          <ResortImage
            asset={media.residencePavilion}
            fill
            aboveTheFold
            sizes="(min-width: 64rem) 55vw, 100vw"
          />
        </div>
        <div className="reveal lg:col-span-4 lg:col-start-9">
          <SectionHeading
            eyebrow="The story"
            title="Designed around the quiet"
            description={
              <>
                <p>
                  AURELIA began with a single question: what would an island resort feel like if it
                  were planned around stillness rather than an itinerary?
                </p>
                <p className="mt-4">
                  The answer is a handful of residences set among palms and lagoon, with the time
                  and room to do very little, very well.
                </p>
              </>
            }
          />
        </div>
      </Container>

      <section aria-labelledby="philosophy" className="bg-mist-light section-y">
        <Container>
          <SectionHeading
            id="philosophy"
            eyebrow="Hospitality"
            title="Our philosophy"
            className="reveal"
          />
          <ol className="mt-12 grid gap-10 md:grid-cols-3 lg:gap-12">
            {principles.map((principle, index) => (
              <li key={principle.title} className="reveal border-t border-gold/60 pt-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-[2.5rem] leading-none font-semibold text-gold-ink lining-nums"
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-2xl text-forest-900">{principle.title}</h3>
                <p className="mt-2 text-muted">{principle.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container as="section" className="grid gap-12 section-y lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            id="sustainable-design"
            eyebrow="Sustainable design"
            title="Made to belong to the island"
            description="The architecture follows the climate instead of fighting it."
            className="reveal"
          />
          <ul className="mt-10 reveal space-y-6 border-t border-line pt-8">
            {designIntentions.map((intention) => (
              <li key={intention.title}>
                <h3 className="font-sans text-base font-medium text-charcoal">{intention.title}</h3>
                <p className="mt-1 text-muted">{intention.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Design intentions for a fictional resort. No environmental certification or performance
            figures are claimed.
          </p>
        </div>
        <div className="grid reveal grid-cols-2 gap-4 lg:col-span-6 lg:col-start-7">
          <div className="relative col-span-2 aspect-video overflow-hidden bg-mist">
            <ResortImage
              asset={media.groveVillaVeranda}
              fill
              sizes="(min-width: 64rem) 45vw, 100vw"
            />
          </div>
          <div className="relative aspect-square overflow-hidden bg-mist">
            <ResortImage
              asset={media.gardenBungalowThatch}
              fill
              sizes="(min-width: 64rem) 22vw, 50vw"
            />
          </div>
          <div className="relative aspect-square overflow-hidden bg-mist">
            <ResortImage asset={media.reefGarden} fill sizes="(min-width: 64rem) 22vw, 50vw" />
          </div>
        </div>
      </Container>

      <section aria-labelledby="property" className="border-t border-line bg-white py-20 lg:py-24">
        <Container>
          <SectionHeading
            id="property"
            eyebrow="The property"
            title="At a glance"
            className="reveal"
          />
          <dl className="mt-12 grid reveal gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col-reverse justify-end border-t border-line pt-6"
              >
                <dt className="mt-2 text-sm text-muted">{fact.label}</dt>
                <dd className="font-serif text-[2.75rem] leading-none font-semibold text-forest-900 lining-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ClosingCta image={media.shoreSunset} />
    </>
  );
}
