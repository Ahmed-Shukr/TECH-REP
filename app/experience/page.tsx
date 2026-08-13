import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { PageHeader } from "@/components/PageHeader";
import { getExperience, getFieldExperience } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Software engineering, technical consulting and RNPO engineering experience.",
};

export default function ExperiencePage() {
  const items = getExperience();
  const field = getFieldExperience();

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="A record of service, not a LinkedIn paste."
        description="ERP delivery and live-network engineering are listed as they are actually practiced: overlapping, evidence-led, and tied to implementation."
      />
      <Container className="py-14">
        <div className="max-w-3xl">
          <ExperienceTimeline items={items} />
        </div>

        <section className="plate mt-16 max-w-3xl p-6">
          <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
            {field.title}
          </p>
          <h2 className="font-display mt-3 text-3xl leading-tight">
            {field.region}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{field.note}</p>
          <ul className="mt-4 flex flex-wrap gap-px bg-rule">
            {field.cities.map((city) => (
              <li
                key={city}
                className="bg-paper px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-muted uppercase"
              >
                {city}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
