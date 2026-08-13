import { focusAreas } from "@/content/skills";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { plate } from "@/lib/format";

export function WhatIDo() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          index={1}
          eyebrow="What I do"
          title="Four practices. One discipline."
          description="ERP, software, radio networks and consulting — treated as one engineering method, not four job titles."
        />
        <div className="mt-12 grid gap-px bg-rule md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <article key={area.title} className="bg-paper p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl leading-tight text-ink">
                  {area.title}
                </h3>
                <span className="font-mono text-[11px] text-accent">
                  {plate(index + 1)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                {area.description}
              </p>
              <ul className="mt-6 space-y-1.5">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[11px] tracking-[0.08em] text-ink/80"
                  >
                    — {item}
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
