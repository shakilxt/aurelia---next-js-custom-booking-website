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
    <Container as="header" className="pt-14 pb-10 sm:pt-20 sm:pb-12">
      <SectionHeading level={1} eyebrow={eyebrow} title={title} description={description} />
      {children}
    </Container>
  );
}
