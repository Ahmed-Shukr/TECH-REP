import type { ArchitectureNode } from "@/lib/types";

function NodeCard({ node }: { node: ArchitectureNode }) {
  return (
    <div className="w-full max-w-xl rounded-lg border border-border bg-surface px-4 py-3 text-center">
      <p className="text-sm font-medium">{node.label}</p>
      {node.detail ? (
        <p className="mt-1 text-xs text-muted">{node.detail}</p>
      ) : null}
      {node.children?.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {node.children.map((child) => (
            <div
              key={child.id}
              className="rounded-md bg-background px-3 py-2 text-xs text-muted"
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
    <div className="flex flex-col items-center gap-0">
      {nodes.map((node, index) => (
        <div key={node.id} className="flex w-full flex-col items-center">
          <NodeCard node={node} />
          {index < nodes.length - 1 ? (
            <div className="h-6 w-px bg-border" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}
