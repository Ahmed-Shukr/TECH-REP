import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export function Connect() {
  return (
    <section className="py-20">
      <Container className="crop-frame">
        <SectionHeading
          index={8}
          eyebrow="Correspondence"
          title="Write if the work is real."
          description="ERP implementation, Odoo development, technical consulting, or radio-network conversations."
        />
        <div className="mt-10 grid gap-px bg-rule sm:grid-cols-3">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-paper px-5 py-6 hover:bg-surface"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              01
            </p>
            <p className="font-display mt-3 text-2xl">LinkedIn</p>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-paper px-5 py-6 hover:bg-surface"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              02
            </p>
            <p className="font-display mt-3 text-2xl">GitHub</p>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="bg-paper px-5 py-6 hover:bg-surface"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              03
            </p>
            <p className="font-display mt-3 text-2xl">Email</p>
            <p className="mt-2 font-mono text-[11px] text-muted">{site.email}</p>
          </a>
        </div>
      </Container>
    </section>
  );
}
