import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectIcon } from "@/components/ProjectIcon";
import { TechBadge } from "@/components/TechBadge";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <ProjectIcon name={project.icon} />
        </div>
        <span className="text-xs font-medium tracking-wide text-subtle uppercase">
          {project.category}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        <Link href={`/projects/${project.slug}`} className="hover:text-accent">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((tech) => (
          <TechBadge key={tech}>{tech}</TechBadge>
        ))}
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2"
      >
        View project <ArrowRight size={14} />
      </Link>
    </article>
  );
}
