import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Photography of the AURELIA concept resort: villas, lagoon, gardens, dining and the island at dusk.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <PageIntro
      eyebrow="Gallery"
      title="The island, in light"
      description="Stone, timber and linen; palms, reef and long evening light."
    />
  );
}
