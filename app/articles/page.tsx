import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Technical articles on Odoo, OWL, dashboards, deployment and radio network KPIs.",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <>
      <PageHeader
        eyebrow="Articles"
        title="Know the technology, and be able to explain it"
        description="Short technical notes written the way a consultant has to speak: precise enough for an engineer, clear enough for a client."
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Container>
    </>
  );
}
