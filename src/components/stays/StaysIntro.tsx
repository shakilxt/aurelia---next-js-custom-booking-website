import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNotice } from "@/components/ui/DemoNotice";

/** Shared by the page and its loading state so the intro never shifts. */
export function StaysIntro() {
  return (
    <PageIntro
      eyebrow="Stays"
      title="Villas, suites and bungalows"
      description="Each residence opens to the garden, the lagoon or the open ocean. Compare by type, capacity and nightly rate."
    >
      <DemoNotice className="mt-6">
        Demonstration rates in USD. Every residence is shown as available; there is no live
        inventory.
      </DemoNotice>
    </PageIntro>
  );
}
