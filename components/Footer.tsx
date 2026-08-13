import Link from "next/link";
import { Container } from "@/components/Container";
import { footerNavigation, navigation, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] uppercase">
            {site.name}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            {site.roleLine}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {[...navigation, ...footerNavigation].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            {site.email}
          </a>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="py-4 text-xs text-subtle">
          © {new Date().getFullYear()} {site.name}. Engineering portfolio.
        </Container>
      </div>
    </footer>
  );
}
