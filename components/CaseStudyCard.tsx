import Link from "next/link";
import type { Project } from "@/lib/types";

export function CaseStudyCard({ project }: { project: Project }) {
  return (
    <article className="plate flex h-full flex-col p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
        {project.category}
      </p>
      <h3 className="font-display mt-4 text-3xl leading-tight">{project.title}</h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-muted">{project.summary}</p>
      <p className="measure mt-6">Problem → result</p>
      <Link
        href={`/case-studies/${project.slug}`}
        className="mt-4 font-mono text-[11px] tracking-[0.16em] text-accent uppercase"
      >
        Read the plate →
      </Link>
    </article>
  );
}
