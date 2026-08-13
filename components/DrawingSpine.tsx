import { site } from "@/lib/site";

export function DrawingSpine() {
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-14 border-r border-rule bg-paper/80 md:block"
    >
      <div className="flex h-full flex-col items-center justify-between py-7">
        <span className="font-mono text-[10px] tracking-[0.28em] text-accent">
          AM
        </span>
        <p className="font-display text-[17px] tracking-[0.42em] text-ink [writing-mode:vertical-rl] rotate-180">
          {site.name}
        </p>
        <span className="font-mono text-[10px] tracking-[0.18em] text-subtle">
          2026
        </span>
      </div>
    </aside>
  );
}
