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
        eyebrow="Contact"
        title="Let's connect"
        description="The fastest path is email. LinkedIn is useful for context. GitHub is useful if you want to inspect how this site is built."
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              LinkedIn
            </p>
            <p className="mt-3 text-sm text-muted">Professional background and recommendations.</p>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              GitHub
            </p>
            <p className="mt-3 text-sm text-muted">Repositories, including this portfolio.</p>
          </a>
          <a
            href={mailto}
            className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              Email
            </p>
            <p className="mt-3 text-sm text-muted">{site.email}</p>
          </a>
        </div>
      </Container>
    </>
  );
}
