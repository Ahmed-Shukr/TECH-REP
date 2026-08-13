import type { ExperienceItem } from "@/lib/types";

export const experience: ExperienceItem[] = [
  {
    title: "Software Engineer / Technical Consultant",
    organization: "Independent & client engagements",
    period: "2023 — Present",
    current: true,
    summary:
      "ERP development, implementation and deployment for organizations that need operational systems rather than generic software.",
    highlights: [
      "Custom Odoo module development across hospital, education, registrar and service workflows",
      "Requirements analysis and translation of business processes into implementable system design",
      "System architecture, access control, dashboards and integration work",
      "Deployment on Linux with Docker, PostgreSQL and multi-database Odoo environments",
      "Technical consulting, training and post-go-live support",
    ],
  },
  {
    title: "Software Developer",
    organization: "Merit Advisory Services LLP",
    period: "Odoo / OpenERP delivery",
    summary:
      "Design, development and testing of Odoo modules, products and interfaces for client requirements.",
    highlights: [
      "Customization of Odoo modules against documented business requirements",
      "Server configuration, installation and maintenance of multi-database Odoo/Ubuntu environments",
      "Analysis of customer needs and proposal of practical alternative solutions",
      "High-performance, reusable Python code and Git-based version control across projects",
    ],
  },
  {
    title: "RNPO Engineer",
    organization: "Telesom",
    period: "2019 — Present",
    current: true,
    summary:
      "Radio network planning and optimization across 2G, 3G, 4G and 5G, with KPI-driven quality work in live networks.",
    highlights: [
      "2G, 3G, 4G and 5G radio network planning and optimization",
      "KPI analysis covering accessibility, retainability, mobility and integrity",
      "Coverage, quality and capacity analysis from drive-test and OSS data",
      "Network troubleshooting across RF, parameter and neighbor-relation issues",
      "Field engineering across Somaliland / Somalia without exposing site-level operational detail",
    ],
  },
  {
    title: "Radio Network Planning & Optimization Engineer",
    organization: "Amtel",
    period: "Prior role",
    summary:
      "Radio network planning and optimization work that preceded the current RNPO role.",
    highlights: [
      "GSM / UMTS / LTE planning and optimization support",
      "Parameter review, neighbor management and quality investigation",
      "Coordination between planning outputs and field implementation",
    ],
  },
  {
    title: "Guest Lecturer / Technical Trainer",
    organization: "Gollis University — Department of Telecommunication Engineering",
    period: "2024",
    summary:
      "Technical training on the evolution of cellular systems from 1G through 5G NR for telecommunication engineering students.",
    highlights: [
      "Structured walkthrough of cellular generations, air interfaces and network architecture",
      "Practical discussion of GSM, 3G, LTE and 5G NR concepts used in live networks",
      "Translation of field engineering experience into teaching material",
    ],
  },
];

export const fieldExperience = {
  title: "Locations / Field Experience",
  region: "Somaliland / Somalia — Telecom Field Engineering",
  note: "Field work has covered multiple cities and live radio networks. Site names, operator internals and sensitive network data are intentionally omitted.",
  cities: ["Hargeisa", "Regional live-network assignments"],
};
