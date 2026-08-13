import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { MdxContent } from "@/components/MdxContent";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return {
      title: article.title,
      description: article.description,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;
  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <header className="border-b border-border bg-surface">
        <Container className="py-14">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {article.category} · {formatDate(article.date)} · {article.readingTime}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {article.description}
          </p>
        </Container>
      </header>
      <Container className="py-14">
        <MdxContent source={article.content} />
      </Container>
    </article>
  );
}
