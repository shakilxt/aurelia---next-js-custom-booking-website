import Link from "next/link";
import { bookingCta, primaryNav, site } from "@/data/site";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cx } from "@/lib/cx";
import { HeaderFrame } from "./HeaderFrame";
import { MobileNavigation } from "./MobileNavigation";
import { NavLink } from "./NavLink";

const navLinkClass =
  "relative py-2 text-[0.8125rem] font-medium uppercase tracking-[0.16em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";

export function SiteHeader() {
  return (
    <HeaderFrame>
      <div
        className={cx(
          "border-b border-line bg-ivory text-forest-900 transition-colors duration-300",
          "header-overlay:border-ivory/20 header-overlay:bg-transparent header-overlay:text-ivory",
        )}
      >
        <Container className="flex h-(--header-h) items-center justify-between gap-6">
          <Link href="/" className="font-serif text-2xl tracking-[0.32em] lg:text-[1.75rem]">
            {site.name}
            <span className="sr-only"> — home</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={bookingCta.href}
              className={cx(
                buttonClasses(),
                "max-sm:hidden",
                "header-overlay:border-ivory/70 header-overlay:bg-transparent header-overlay:hover:bg-ivory header-overlay:hover:text-forest-900",
              )}
            >
              {bookingCta.label}
            </Link>
            <MobileNavigation items={primaryNav} cta={bookingCta} note={site.disclaimer} />
          </div>
        </Container>
      </div>
    </HeaderFrame>
  );
}
