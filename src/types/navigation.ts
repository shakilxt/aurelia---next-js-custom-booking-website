import type { Route } from "next";

export interface NavItem {
  label: string;
  href: Route;
}
