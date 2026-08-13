"use client";

import { useMemo, useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { filterProjects, projectFilters } from "@/lib/projects";
import type { Project, ProjectFilter as Filter } from "@/lib/types";
import { cx } from "@/lib/utils";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(
    () => filterProjects(projects, filter),
    [projects, filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {projectFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cx(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              filter === item
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-muted hover:border-accent/30 hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <ProjectGrid projects={visible} />
      </div>
    </div>
  );
}
