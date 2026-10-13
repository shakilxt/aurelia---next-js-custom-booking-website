import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experiences",
  description:
    "Private beach dining, spa rituals, reef snorkelling, sunset cruises and guided island excursions at AURELIA.",
  path: "/experiences",
});

export default function ExperiencesPage() {
  return (
    <PageIntro
      eyebrow="Experiences"
      title="Days shaped by the island"
      description="From reef mornings to candlelit dinners on the sand — a curated set of experiences, arranged at your own pace."
    />
  );
}
