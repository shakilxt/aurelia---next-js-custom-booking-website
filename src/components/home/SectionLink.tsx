import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

/** Understated "view all" link placed beside a section heading. */
export function SectionLink({ href, children }: { href: Route; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium tracking-[0.14em] text-forest-900 uppercase"
    >
      <span className="underline-offset-8 group-hover:underline">{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}
