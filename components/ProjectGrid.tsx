import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
