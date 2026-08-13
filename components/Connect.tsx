import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export function Connect() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Let's connect"
          title="Contact"
          description="For ERP implementation, Odoo development, technical consulting or telecom engineering conversations."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-accent/30"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-accent/30"
          >
            GitHub
          </a>
          <a
            href={`mailto:${site.email}`}
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Email
          </a>
        </div>
      </Container>
    </section>
  );
}
