import type { ExperienceItem } from "@/lib/types";
import { plate } from "@/lib/format";

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {items.map((item, index) => (
        <li
          key={`${item.title}-${item.organization}`}
          className="grid gap-6 py-8 md:grid-cols-[88px_1fr]"
        >
          <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
            {plate(index + 1)}
          </span>
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
              {item.period}
              {item.current ? " · Live" : ""}
            </p>
            <h3 className="font-display mt-2 text-3xl leading-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{item.organization}</p>
            <p className="mt-4 text-sm leading-7 text-muted">{item.summary}</p>
            <ul className="mt-5 space-y-2">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="text-sm leading-6 text-ink/80 before:mr-3 before:text-accent before:content-['—']"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
