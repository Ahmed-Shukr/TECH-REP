import { focusAreas } from "@/content/skills";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export function WhatIDo() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="What I do"
          title="Professional focus"
          description="Four domains, one engineering practice: systems that have to work in production, not just in a demo."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {focusAreas.map((area) => (
            <article
              key={area.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/25"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {area.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-background px-2.5 py-1 text-xs text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
