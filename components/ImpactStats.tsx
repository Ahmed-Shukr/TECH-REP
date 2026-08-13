import { Container } from "@/components/Container";
import { impactStats } from "@/lib/site";

export function ImpactStats() {
  return (
    <section className="border-y border-rule">
      <Container className="py-0">
        <div className="grid grid-cols-2 bg-rule gap-px sm:grid-cols-4">
          {impactStats.map((stat) => (
            <div key={stat.label} className="bg-paper px-5 py-8">
              <p className="font-display text-4xl text-accent sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
