import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ahmed Muhumed for ERP, Odoo, consulting or telecom work.",
};

export default function ContactPage() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Portfolio enquiry")}`;

  return (
    <>
      <PageHeader
        eyebrow="Correspondence"
        title="Write if the work is real."
        description="Email is the fastest path. LinkedIn is context. GitHub is the construction of this site."
      />
      <Container className="py-14">
        <div className="grid gap-px bg-rule md:grid-cols-3">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-paper p-6 hover:bg-surface"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              01 LinkedIn
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Professional background and recommendations.
            </p>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-paper p-6 hover:bg-surface"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              02 GitHub
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Repositories, including this portfolio.
            </p>
          </a>
          <a href={mailto} className="bg-paper p-6 hover:bg-surface">
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              03 Email
            </p>
            <p className="mt-4 font-mono text-sm text-ink">{site.email}</p>
          </a>
        </div>
      </Container>
    </>
  );
}
