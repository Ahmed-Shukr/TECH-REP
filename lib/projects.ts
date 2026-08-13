import { projects } from "@/content/projects";
import type { Project, ProjectFilter } from "@/lib/types";

export const projectFilters: ProjectFilter[] = [
  "All",
  "ERP",
  "Odoo",
  "Telecom",
  "AI",
  "Web",
];

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getCaseStudies(): Project[] {
  return projects.filter((project) => project.caseStudy);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string): Project[] {
  const project = getProjectBySlug(slug);
  if (!project) return [];
  return project.related
    .map((relatedSlug) => getProjectBySlug(relatedSlug))
    .filter((item): item is Project => Boolean(item));
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

export function getCaseStudySlugs(): string[] {
  return getCaseStudies().map((project) => project.slug);
}

export function filterProjects(
  items: Project[],
  filter: ProjectFilter,
): Project[] {
  if (filter === "All") return items;
  return items.filter((project) => project.filters.includes(filter));
}
