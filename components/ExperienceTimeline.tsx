import type { ExperienceItem } from "@/lib/types";

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="relative space-y-8 border-l border-border pl-6">
      {items.map((item) => (
        <li key={`${item.title}-${item.organization}`} className="relative">
          <span className="absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 border-accent bg-surface" />
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            {item.period}
            {item.current ? " · Current" : ""}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">
            {item.title}
          </h3>
          <p className="text-sm text-muted">{item.organization}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
          <ul className="mt-4 space-y-2">
            {item.highlights.map((highlight) => (
              <li key={highlight} className="text-sm leading-6 text-foreground/80">
                {highlight}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
