import Link from "next/link";
import { footerNav, site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer data-surface="dark" className="bg-forest-900 text-shell">
      <Container className="grid gap-12 pt-20 pb-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-5">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-[0.32em]">
            {site.name}
          </Link>
          <p className="mt-2 text-eyebrow font-medium text-gold uppercase">{site.tagline}</p>
          <p className="mt-6 max-w-sm leading-relaxed text-shell/70">
            {site.location}. Pool villas, ocean suites and garden bungalows among palms and still
            lagoons.
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title} className="lg:col-span-2">
            <h2 className="font-sans text-eyebrow font-medium text-gold uppercase">
              {group.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-shell/80 transition-colors hover:text-shell"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className="font-sans text-eyebrow font-medium text-gold uppercase">Contact</h2>
          <dl className="mt-5 space-y-3 text-shell/80">
            <div>
              <dt className="sr-only">Email</dt>
              <dd className="[overflow-wrap:anywhere]">{site.contact.email}</dd>
            </div>
            <div>
              <dt className="sr-only">Phone</dt>
              <dd>{site.contact.phone}</dd>
            </div>
            <div>
              <dt className="sr-only">Hours</dt>
              <dd>{site.contact.hours}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-shell/60">Demonstration details — not a real contact.</p>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-4 border-t border-shell/15 py-8 text-sm text-shell/70 md:flex-row md:items-start md:justify-between md:gap-12">
          <p className="max-w-2xl leading-relaxed">{site.disclaimer}</p>
          <p className="shrink-0">© {new Date().getFullYear()} Shakil · Portfolio demo</p>
        </div>
      </Container>
    </footer>
  );
}
