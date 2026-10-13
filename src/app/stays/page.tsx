import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Stays",
  description:
    "Pool villas, ocean suites and garden bungalows at AURELIA, a concept island resort. Demonstration prices in USD.",
  path: "/stays",
});

export default function StaysPage() {
  return (
    <PageIntro
      eyebrow="Stays"
      title="Villas, suites and bungalows"
      description="Each residence opens to the garden, the lagoon or the open ocean. Compare by type, capacity and nightly rate."
    />
  );
}
