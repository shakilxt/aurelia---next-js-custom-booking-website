import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cx } from "@/lib/cx";

interface DemoNoticeProps {
  children: ReactNode;
  className?: string;
}

/** Marks demonstration-only behaviour (prices, availability, submissions). */
export function DemoNotice({ children, className }: DemoNoticeProps) {
  return (
    <p className={cx("flex gap-2.5 text-sm leading-relaxed text-muted", className)}>
      <Info
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-gold-ink"
        strokeWidth={1.75}
      />
      <span>{children}</span>
    </p>
  );
}
