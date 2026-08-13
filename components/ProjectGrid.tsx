import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-px bg-rule md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <div key={project.slug} className="bg-paper">
          <ProjectCard project={project} index={index + 1} />
        </div>
      ))}
    </div>
  );
}
