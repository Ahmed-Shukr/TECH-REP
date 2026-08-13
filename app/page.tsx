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
import { TechBadge } from "@/components/TechBadge";
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
            eyebrow="Selected projects"
            title="What has actually been built"
            description="Operational systems across hospital, registrar, examination and support domains — not concept mockups."
          />
          <div className="mt-10">
            <ProjectGrid projects={featuredProjects} />
          </div>
          <div className="mt-8">
            <Button href="/projects" variant="secondary">
              View all projects
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <Container>
          <SectionHeading
            eyebrow="Professional experience"
            title="Engineering across ERP and live networks"
            description="Software engineering and technical consulting, preceded and paralleled by radio network planning and optimization."
          />
          <div className="mt-10 max-w-3xl">
            <ExperienceTimeline items={experience} />
          </div>
          <div className="mt-8">
            <Button href="/experience" variant="secondary">
              View experience
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Technology"
            title="Tools used in delivery"
            description="A working stack, not a percentage chart."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {homepageTechnologies.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link href="/skills" className="font-medium text-accent">
              Full skills breakdown →
            </Link>
          </p>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <Container>
          <SectionHeading
            eyebrow="Case studies"
            title="From business problem to implementation"
            description="Problem → architecture → implementation → result. The same structure used on every major engagement."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {caseStudies.map((project) => (
              <CaseStudyCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/case-studies" variant="secondary">
              Read case studies
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Articles"
            title="Explaining the work"
            description="Technical writing on Odoo, OWL, dashboards, deployment and radio KPIs — useful for consulting as well as engineering."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/articles" variant="secondary">
              All articles
            </Button>
          </div>
        </Container>
      </section>

      <Connect />
    </>
  );
}
