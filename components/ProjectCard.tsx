import Link from "next/link";
import { plate } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index = 1,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article className="group plate flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
          {plate(index)}
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="font-display text-[1.7rem] leading-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted">
          {project.description}
        </p>
        <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-ink/70 uppercase">
          {project.technologies.slice(0, 4).join(" · ")}
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 font-mono text-[11px] tracking-[0.16em] text-accent uppercase"
        >
          Open plate →
        </Link>
      </div>
    </article>
  );
}
