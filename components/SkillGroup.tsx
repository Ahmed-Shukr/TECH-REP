import type { SkillGroup as SkillGroupType } from "@/lib/types";

export function SkillGroup({ group }: { group: SkillGroupType }) {
  return (
    <article className="plate p-6">
      <h3 className="font-display text-2xl">{group.title}</h3>
      <ul className="mt-5 space-y-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="border-b border-rule/70 pb-2 font-mono text-[12px] tracking-[0.08em] text-ink/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
