import Link from "next/link";
import { Container } from "@/components/Container";
import { footerNavigation, navigation, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            {site.roleLine}
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
          {[...navigation, ...footerNavigation].map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="normal-case tracking-normal hover:text-accent">
            {site.email}
          </a>
        </div>
      </Container>
      <div className="border-t border-rule">
        <Container className="flex flex-wrap justify-between gap-3 py-4 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Engineering specification · Rev A</span>
        </Container>
      </div>
    </footer>
  );
}
