import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/Button";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Connect } from "@/components/Connect";
import { Container } from "@/components/Container";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Hero } from "@/components/Hero";
import { ImpactStats } from "@/components/ImpactStats";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatIDo } from "@/components/WhatIDo";
import { homepageTechnologies } from "@/content/skills";
import { getFeaturedArticles } from "@/lib/articles";
import { getHomepageExperience } from "@/lib/experience";
import { getCaseStudies, getFeaturedProjects } from "@/lib/projects";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const experience = getHomepageExperience();
  const caseStudies = getCaseStudies().slice(0, 3);
  const articles = getFeaturedArticles();

  return (
    <>
      <Hero />
      <WhatIDo />
      <ImpactStats />

      <section className="py-20">
        <Container>
          <SectionHeading
            index={3}
            eyebrow="Selected work"
            title="Built for operations, not for a demo."
            description="Hospital, registrar, examination and support systems that had to run after go-live."
          />
          <div className="mt-12">
            <ProjectGrid projects={featuredProjects} />
          </div>
          <div className="mt-8">
            <Button href="/projects" variant="secondary">
              All plates
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-y border-rule py-20">
        <Container>
          <SectionHeading
            index={4}
            eyebrow="Record of service"
            title="Software in the office. Radio in the field."
            description="Consulting and ERP delivery, in parallel with live-network RNPO."
          />
          <div className="mt-12 max-w-3xl">
            <ExperienceTimeline items={experience} />
          </div>
          <div className="mt-8">
            <Button href="/experience" variant="secondary">
              Full record
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            index={5}
            eyebrow="Instruments"
            title="The working set."
            description="Tools used in delivery. No percentage bars."
          />
          <div className="mt-10 flex flex-wrap gap-px bg-rule">
            {homepageTechnologies.map((tech) => (
              <span
                key={tech}
                className="bg-paper px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-ink uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/skills"
              className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase"
            >
              Full inventory →
            </Link>
          </p>
        </Container>
      </section>

      <section className="border-y border-rule py-20">
        <Container>
          <SectionHeading
            index={6}
            eyebrow="Case studies"
            title="Problem. Architecture. Result."
            description="The same sequence on every major engagement."
          />
          <div className="mt-12 grid gap-px bg-rule md:grid-cols-3">
            {caseStudies.map((project) => (
              <div key={project.slug} className="bg-paper">
                <CaseStudyCard project={project} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/case-studies" variant="secondary">
              All studies
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            index={7}
            eyebrow="Notes"
            title="If you can explain it, you can consult on it."
            description="Odoo, OWL, dashboards, deployment, and radio KPIs."
          />
          <div className="mt-12 grid gap-px bg-rule md:grid-cols-3">
            {articles.map((article) => (
              <div key={article.slug} className="bg-paper">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/articles" variant="secondary">
              All notes
            </Button>
          </div>
        </Container>
      </section>

      <Connect />
    </>
  );
}
