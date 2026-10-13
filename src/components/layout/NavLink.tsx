"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: Route;
  className: string;
  onNavigate?: () => void;
  children: ReactNode;
}

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Link that marks itself as the current page; styling hooks off `aria-current`. */
export function NavLink({ href, className, onNavigate, children }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      aria-current={isActivePath(pathname, href) ? "page" : undefined}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}
