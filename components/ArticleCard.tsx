import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="plate p-6">
      <p className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
        {article.category} · {formatDate(article.date)} · {article.readingTime}
      </p>
      <h3 className="font-display mt-4 text-2xl leading-tight">
        <Link href={`/articles/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted">{article.description}</p>
    </article>
  );
}
