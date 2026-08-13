import { MDXRemote } from "next-mdx-remote/rsc";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-article max-w-3xl">
      <MDXRemote source={source} />
    </div>
  );
}
