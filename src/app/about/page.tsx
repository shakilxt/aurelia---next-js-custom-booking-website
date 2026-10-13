import { PageIntro } from "@/components/layout/PageIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "The story, hospitality philosophy and sustainable design approach behind AURELIA, a fictional island resort concept.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageIntro
      eyebrow="About"
      title="A quieter kind of luxury"
      description="AURELIA is a design concept for an island retreat built around nature, craft and generous space."
    />
  );
}
