import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Plan your stay",
  description:
    "A simulated AURELIA booking flow with an estimated price breakdown. No reservation is created and no payment is taken.",
  path: "/book",
});

export default function BookPage() {
  return (
    <PageIntro
      eyebrow="Booking demonstration"
      title="Plan your stay"
      description="Choose a residence, dates and guests to see an estimated total. This flow is a simulation: no reservation is made and no payment is taken."
    />
  );
}
