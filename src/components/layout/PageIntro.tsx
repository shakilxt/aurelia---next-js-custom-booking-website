import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}

/** Opening block for pages without a full-bleed photographic hero. */
export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <Container as="header" className="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <SectionHeading level={1} eyebrow={eyebrow} title={title} description={description} />
      {children}
    </Container>
  );
}
