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
      <div className="flex flex-wrap gap-px bg-rule">
        {projectFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cx(
              "px-4 py-2 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors",
              filter === item
                ? "bg-ink text-paper"
                : "bg-paper text-muted hover:text-ink",
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
