import { TechBadge } from "@/components/TechBadge";
import type { SkillGroup as SkillGroupType } from "@/lib/types";

export function SkillGroup({ group }: { group: SkillGroupType }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <TechBadge key={item}>{item}</TechBadge>
        ))}
      </div>
    </article>
  );
}
