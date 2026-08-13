import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function CaseStudyCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
        {project.category}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {project.summary}
      </p>
      <p className="mt-5 text-xs tracking-wide text-subtle uppercase">
        Problem → architecture → implementation → result
      </p>
      <Link
        href={`/case-studies/${project.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
      >
        Read case study <ArrowRight size={14} />
      </Link>
    </article>
  );
}
