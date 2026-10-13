import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact the AURELIA concept resort. A demonstration enquiry form — no message is transmitted.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageIntro
      eyebrow="Contact"
      title="Begin a conversation"
      description="Questions about a stay, an experience or a celebration on the island. This is a demonstration: enquiries are not sent anywhere."
    />
  );
}
