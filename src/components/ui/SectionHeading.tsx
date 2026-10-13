import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface SectionHeadingProps {
  /** Short label above the title, e.g. "Stays". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level; pages keep a single h1, so sections default to h2. */
  level?: 1 | 2 | 3;
  align?: "start" | "center";
  tone?: "default" | "inverse";
  id?: string;
  className?: string;
}

const titleSize = { 1: "text-h1", 2: "text-h2", 3: "text-h3" } as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  align = "start",
  tone = "default",
  id,
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;
  const inverse = tone === "inverse";

  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cx(
            "mb-4 text-eyebrow font-medium uppercase",
            inverse ? "text-gold" : "text-gold-ink",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className={cx(titleSize[level], inverse ? "text-shell" : "text-forest-900")}>
        {title}
      </Heading>
      {description ? (
        <div className={cx("mt-5 text-lead", inverse ? "text-shell/80" : "text-muted")}>
          {description}
        </div>
      ) : null}
    </div>
  );
}
