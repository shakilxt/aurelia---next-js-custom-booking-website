import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { getGalleryItems } from "@/lib/gallery";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Photography of the AURELIA concept resort: villas, lagoon, gardens, dining and the island at dusk.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="The island, in light"
        description="Stone, timber and linen; palms, reef and long evening light. Select any photograph to view it larger."
      >
        <DemoNotice className="mt-6">
          Photography from Unsplash, chosen to illustrate a fictional resort.
        </DemoNotice>
      </PageIntro>
      <Container className="pb-24 lg:pb-32">
        <GalleryBrowser items={getGalleryItems()} />
      </Container>
    </>
  );
}
