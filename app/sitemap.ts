import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/articles";
import { getCaseStudySlugs, getProjectSlugs } from "@/lib/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/case-studies",
    "/skills",
    "/articles",
    "/contact",
  ];

  const projectRoutes = getProjectSlugs().map((slug) => `/projects/${slug}`);
  const caseStudyRoutes = getCaseStudySlugs().map(
    (slug) => `/case-studies/${slug}`,
  );
  const articleRoutes = getArticleSlugs().map((slug) => `/articles/${slug}`);

  return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes, ...articleRoutes].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
    }),
  );
}
