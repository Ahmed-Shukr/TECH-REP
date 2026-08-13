export type ProjectFilter =
  | "All"
  | "ERP"
  | "Odoo"
  | "Telecom"
  | "AI"
  | "Web";

export type ArchitectureNode = {
  id: string;
  label: string;
  detail?: string;
  children?: ArchitectureNode[];
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectChallenge = {
  title: string;
  description: string;
};

export type Project = {
  title: string;
  slug: string;
  description: string;
  summary: string;
  overview: string;
  role: string;
  responsibilities: string[];
  technologies: string[];
  category: string;
  filters: Exclude<ProjectFilter, "All">[];
  featured: boolean;
  caseStudy: boolean;
  icon: "hospital" | "chart" | "exam" | "ai" | "dashboard" | "radio" | "school" | "clinic";
  problem: string;
  solution: string;
  features: string[];
  architecture: ArchitectureNode[];
  challenges: ProjectChallenge[];
  implementation: string[];
  results: string[];
  impact: string[];
  screenshots: ProjectScreenshot[];
  lessons: string[];
  related: string[];
  github?: string;
  demo?: string;
  year: string;
};

export type ExperienceItem = {
  title: string;
  organization: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  featured?: boolean;
};

export type Article = ArticleFrontmatter & {
  content: string;
  readingTime: string;
};
