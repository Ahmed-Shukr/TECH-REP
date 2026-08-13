import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Article, ArticleFrontmatter } from "@/lib/types";

const articlesDirectory = path.join(process.cwd(), "content/articles");

function readingTimeFrom(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): Article {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;

  return {
    ...frontmatter,
    slug: frontmatter.slug ?? slug,
    content,
    readingTime: readingTimeFrom(content),
  };
}

export function getArticles(): Article[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedArticles(): Article[] {
  const featured = getArticles().filter((article) => article.featured);
  return featured.length > 0 ? featured.slice(0, 3) : getArticles().slice(0, 3);
}
