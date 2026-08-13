export function TechBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center border border-rule px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
      {children}
    </span>
  );
}
