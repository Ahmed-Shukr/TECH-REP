import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-20 sm:py-28">
        <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
          {site.name}
        </p>
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
          {site.roleLine}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          {site.summary}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/projects">View My Work</Button>
          <Button href={site.resumePath} variant="secondary">
            Download CV
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            LinkedIn <ArrowUpRight size={14} />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            Email <ArrowUpRight size={14} />
          </a>
        </div>
      </Container>
    </section>
  );
}
