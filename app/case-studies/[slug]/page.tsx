import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import {
  getCaseStudySlugs,
  getProjectBySlug,
  getRelatedProjects,
} from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) return {};
  return {
    title: `${project.title} case study`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) notFound();

  return (
    <ProjectDetail
      project={project}
      related={getRelatedProjects(project.slug)}
      variant="case-study"
    />
  );
}
