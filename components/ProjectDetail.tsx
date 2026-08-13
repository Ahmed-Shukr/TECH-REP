import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { TechBadge } from "@/components/TechBadge";
import type { Project } from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProjectDetail({
  project,
  related,
  variant = "project",
}: {
  project: Project;
  related: Project[];
  variant?: "project" | "case-study";
}) {
  return (
    <article>
      <header className="border-b border-border bg-surface">
        <Container className="py-14">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {variant === "case-study" ? "Case study" : "Project"} · {project.year}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.github ? (
              <Button href={project.github} variant="secondary" external>
                GitHub
              </Button>
            ) : null}
            {project.demo ? (
              <Button href={project.demo} variant="secondary" external>
                Demo
              </Button>
            ) : null}
            {variant === "project" && project.caseStudy ? (
              <Button href={`/case-studies/${project.slug}`} variant="secondary">
                Read case study
              </Button>
            ) : null}
            {variant === "case-study" ? (
              <Button href={`/projects/${project.slug}`} variant="secondary">
                Project page
              </Button>
            ) : null}
          </div>
        </Container>
      </header>

      <Container className="py-6">
        <Section title="Overview">
          <p className="max-w-3xl text-[15px] leading-7 text-muted">
            {project.overview}
          </p>
        </Section>

        <Section title="The problem">
          <blockquote className="max-w-3xl border-l-2 border-accent pl-4 text-[15px] leading-7 text-foreground">
            {project.problem}
          </blockquote>
        </Section>

        <Section title="The solution">
          <p className="max-w-3xl text-[15px] leading-7 text-muted">
            {project.solution}
          </p>
        </Section>

        <Section title="My role">
          <p className="text-sm font-medium">{project.role}</p>
          <ul className="mt-4 space-y-2">
            {project.responsibilities.map((item) => (
              <li key={item} className="text-sm leading-6 text-muted">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Architecture">
          <ArchitectureDiagram nodes={project.architecture} />
        </Section>

        <Section title="Key features">
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-6"
              >
                {feature}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Challenges">
          <div className="grid gap-4 md:grid-cols-2">
            {project.challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {challenge.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Implementation">
          <ol className="space-y-3">
            {project.implementation.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="mt-0.5 font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        {project.screenshots.length > 0 ? (
          <Section title="Screenshots">
            <div className="grid gap-6">
              {project.screenshots.map((shot) => (
                <figure
                  key={shot.src}
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1200}
                    height={720}
                    className="h-auto w-full"
                  />
                  {shot.caption ? (
                    <figcaption className="border-t border-border px-4 py-3 text-sm text-muted">
                      {shot.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="Impact">
          <ul className="space-y-2">
            {project.impact.map((item) => (
              <li key={item} className="text-sm leading-6 text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Results">
          <ul className="space-y-2">
            {project.results.map((item) => (
              <li key={item} className="text-sm leading-6 text-muted">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Lessons learned">
          <ul className="space-y-3">
            {project.lessons.map((item) => (
              <li
                key={item}
                className="max-w-3xl text-sm leading-7 text-muted italic"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {related.length > 0 ? (
          <Section title="Related projects">
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </Section>
        ) : null}

        <div className="border-t border-border py-10">
          <Link href="/projects" className="text-sm font-medium text-accent">
            ← All projects
          </Link>
        </div>
      </Container>
    </article>
  );
}
