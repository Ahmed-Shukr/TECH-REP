import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <Container className="crop-frame py-16 sm:py-24">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] text-subtle uppercase">
          <span>
            Sheet <span className="text-accent">00</span> · Identity
          </span>
          <span>Drawn {site.location}</span>
          <span>Scale 1:1</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-accent uppercase">
              Dual practice
            </p>
            <h1 className="font-display mt-4 text-[4.2rem] leading-[0.86] text-ink sm:text-[7.2rem]">
              Ahmed
              <br />
              Muhumed
            </h1>
          </div>

          <aside className="plate p-4 font-mono text-[10px] leading-5 tracking-[0.12em] text-muted uppercase">
            <div className="flex justify-between border-b border-rule pb-2">
              <span>Drawn</span>
              <span className="text-ink">AM</span>
            </div>
            <div className="flex justify-between border-b border-rule py-2">
              <span>Field</span>
              <span className="text-ink">Hargeisa</span>
            </div>
            <div className="flex justify-between border-b border-rule py-2">
              <span>Domains</span>
              <span className="text-ink">ERP × RF</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Sheet</span>
              <span className="text-accent">00 / 08</span>
            </div>
          </aside>
        </div>

        <div className="measure mt-10">ERP systems × live radio networks</div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <p className="max-w-xl text-lg leading-8 text-muted">
            {site.summary}
          </p>
          <div className="grid grid-cols-2 gap-px bg-rule self-start">
            <div className="bg-paper px-4 py-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
                Systems
              </p>
              <p className="mt-2 text-sm leading-6 text-ink">
                Odoo · Python · PostgreSQL · OWL
              </p>
            </div>
            <div className="bg-paper px-4 py-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
                Networks
              </p>
              <p className="mt-2 text-sm leading-6 text-ink">
                2G · 3G · 4G · 5G · RNPO
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="/projects">View the work</Button>
          <Button href={site.resumePath} variant="secondary">
            Specification / CV
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            01 LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            02 GitHub
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            03 Email
          </a>
        </div>
      </Container>
    </section>
  );
}
