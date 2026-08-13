import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Professional journey of Ahmed Muhumed: ERP development, Odoo, technical consulting and telecom engineering.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Who is Ahmed?"
        description="An engineer who builds business systems and has spent years operating live radio networks. The useful combination is not 'full stack' — it is ERP delivery plus field engineering discipline."
      />
      <Container className="max-w-3xl py-14">
        <div className="space-y-10 text-[15px] leading-7 text-muted">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Professional journey
            </h2>
            <p className="mt-4">
              I started as a telecommunication systems engineer. The RNPO work
              — 2G, 3G, 4G and 5G planning, KPI analysis, coverage and quality
              investigation — taught a habit that transfers directly into
              software: isolate the cause before changing the system.
            </p>
            <p className="mt-4">
              That habit now sits underneath ERP work. I design, develop and
              implement Odoo systems for organizations that need operational
              software: hospital workflows, registrar analytics, examination
              platforms, clinic modules and support processes. The job is not
              to write a module. The job is to turn a business process into a
              system people can run.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              How the work is done
            </h2>
            <ol className="mt-4 space-y-3">
              <li>1. Requirements analysis with the people who run the process</li>
              <li>2. Architecture and data model before screens</li>
              <li>3. Implementation on Odoo, Python and PostgreSQL</li>
              <li>4. Deployment, access control and operating notes</li>
              <li>5. Training and support after go-live</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Education and location
            </h2>
            <p className="mt-4">
              Bachelor&apos;s degree in Telecommunication Systems Engineering.
              Based in {site.location}, with telecom field experience across
              Somaliland / Somalia. I have also delivered technical training
              to telecommunication engineering students at Gollis University.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              What this portfolio is for
            </h2>
            <p className="mt-4">
              Recruiters and clients should be able to answer four questions
              in the first half-minute: who I am, what I can do, what I have
              actually built, and what problems those systems solved. The
              homepage is the executive summary. The project and case-study
              pages are the evidence.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/projects">View my work</Button>
          <Button href="/contact" variant="secondary">
            Contact
          </Button>
        </div>
      </Container>
    </>
  );
}
