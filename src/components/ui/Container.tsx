import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ContainerElement = "div" | "section" | "header" | "footer" | "nav" | "article";

interface ContainerProps {
  as?: ContainerElement;
  /** `site` for page layouts, `narrow` for long-form reading widths. */
  size?: "site" | "narrow";
  className?: string;
  children: ReactNode;
}

export function Container({
  as: Element = "div",
  size = "site",
  className,
  children,
}: ContainerProps) {
  return (
    <Element
      className={cx(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "site" ? "max-w-site" : "max-w-narrow",
        className,
      )}
    >
      {children}
    </Element>
  );
}
