function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export const site = {
  name: "Ahmed Muhumed",
  title: "Ahmed Muhumed — ERP Developer · Technical Consultant",
  headline: "ERP Developer · Technical Consultant",
  subheadline: "Odoo Specialist · Telecom Engineer",
  roleLine:
    "ERP Developer · Odoo Specialist · Technical Consultant · Telecom Engineer",
  summary:
    "I design, develop and implement business systems, combining ERP engineering, software development, telecom engineering and technical consulting.",
  location: "Hargeisa, Somaliland",
  email: "ahmetoshukr@gmail.com",
  github: "https://github.com/Ahmed-Shukr",
  linkedin: "https://www.linkedin.com/in/ahmed-muhumed",
  medium: "https://medium.com/@ahmedmuhumed",
  url: resolveSiteUrl(),
  resumePath: "/resume.pdf",
} as const;

export const navigation = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/articles", label: "Articles" },
] as const;

export const footerNavigation = [
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
] as const;

export const impactStats = [
  { value: "10+", label: "ERP modules" },
  { value: "5+", label: "Business domains" },
  { value: "4+", label: "Years telecom engineering" },
  { value: "8+", label: "Projects delivered" },
] as const;
