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
        title="A timeline, not a LinkedIn paste"
        description="ERP delivery and live-network engineering are listed as they are actually practiced: overlapping, evidence-led, and tied to implementation."
      />
      <Container className="py-14">
        <div className="max-w-3xl">
          <ExperienceTimeline items={items} />
        </div>

        <section className="mt-16 max-w-3xl rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {field.title}
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">
            {field.region}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{field.note}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {field.cities.map((city) => (
              <li
                key={city}
                className="rounded-full bg-background px-3 py-1 text-sm text-muted"
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
