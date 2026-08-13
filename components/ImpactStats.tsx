import { Container } from "@/components/Container";
import { impactStats } from "@/lib/site";

export function ImpactStats() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        {impactStats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-semibold tracking-tight text-accent">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
