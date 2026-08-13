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
      <header className="border-b border-rule">
        <Container className="crop-frame py-16">
          <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
            {article.category} · {formatDate(article.date)} · {article.readingTime}
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl leading-[0.95] sm:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
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
