import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="section-y">
      <SectionHeading
        level={1}
        eyebrow="404 · Page not found"
        title="This path leads out to sea"
        description="The page you were looking for doesn’t exist or has moved. Our stays and experiences are a short walk away."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Return home</ButtonLink>
        <ButtonLink href="/stays" variant="secondary">
          Browse stays
        </ButtonLink>
      </div>
    </Container>
  );
}
