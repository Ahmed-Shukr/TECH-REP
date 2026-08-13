import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6">
      <p className="text-xs font-medium tracking-wide text-subtle uppercase">
        {article.category} · {formatDate(article.date)} · {article.readingTime}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">
        <Link href={`/articles/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">{article.description}</p>
    </article>
  );
}
