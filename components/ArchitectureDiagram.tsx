import type { ArchitectureNode } from "@/lib/types";

function NodeCard({ node }: { node: ArchitectureNode }) {
  return (
    <div className="w-full max-w-xl border border-rule bg-paper px-4 py-3 text-center">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase">{node.label}</p>
      {node.detail ? (
        <p className="mt-1 text-xs text-muted">{node.detail}</p>
      ) : null}
      {node.children?.length ? (
        <div className="mt-3 grid gap-px bg-rule sm:grid-cols-2">
          {node.children.map((child) => (
            <div
              key={child.id}
              className="bg-surface px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-muted uppercase"
            >
              {child.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ArchitectureDiagram({ nodes }: { nodes: ArchitectureNode[] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((node, index) => (
        <div key={node.id} className="flex w-full flex-col items-center">
          <NodeCard node={node} />
          {index < nodes.length - 1 ? (
            <div className="h-7 w-px bg-accent" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}
