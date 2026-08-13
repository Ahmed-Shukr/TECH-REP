# Ahmed Muhumed — Engineering Portfolio

Professional engineering portfolio for [ahmedmuhumed.dev](https://ahmedmuhumed.dev). It is not a generic developer landing page. A recruiter or client should be able to answer four questions in the first 30 seconds:

> Who is Ahmed? → What can he do? → What has he actually built? → What problems has he solved?

The homepage is the executive summary. Project pages, case studies, experience and articles are the evidence.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · MDX · Vercel · GitHub · custom domain

The repository is itself a portfolio artifact: it shows a production-quality Next.js application with a data-driven content model, not a single hardcoded page.

## Site map

```
ahmedmuhumed.dev
│
├── /                         Home (executive summary)
├── /about                    About / professional journey
├── /experience               Experience timeline
├── /projects                 All projects + domain filters
│   └── /projects/[slug]
├── /case-studies             Detailed case studies
│   └── /case-studies/[slug]
├── /skills                   Technical skills (no percentage bars)
├── /articles                 Technical articles (MDX)
│   └── /articles/[slug]
├── /contact                  Contact
└── /resume.pdf               CV
```

Primary navigation stays short: About, Experience, Projects, Case Studies, Articles. Skills and Contact live in the footer. GitHub, LinkedIn and CV sit in the header.

## Architecture

```
app/                  App Router pages and metadata
components/           Presentational UI (Navbar, Hero, cards, timeline)
content/
  projects/           Project and case-study records
  experience/         Timeline + field experience
  skills/             Skill groups and homepage focus areas
  articles/           MDX articles with frontmatter
lib/                  Accessors, types, site identity
public/
  projects/           Architecture / product visuals
  resume.pdf          Generated CV
scripts/              Resume generator
```

Projects are data, not pages. Adding a tenth project is a content change plus optional visuals — Next.js generates `/projects/[slug]` and, when `caseStudy: true`, `/case-studies/[slug]`.

## Implementation guidelines

These rules are the product specification. Do not drift from them when extending the site.

### 1. Positioning

Build a professional engineering / consulting portfolio. Do not write generic copy such as “passionate developer who loves coding.” The advantage is real-world engineering across ERP, software, telecom and consulting.

### 2. Homepage is an executive summary

Do not duplicate every page on the home screen. Keep this flow:

1. Hero — name, roles, one-sentence summary, View My Work, Download CV, LinkedIn / GitHub / Email
2. What I do — four cards: ERP & Odoo, Software Engineering, Telecom, Technical Consulting
3. Selected projects
4. Experience (compressed timeline)
5. Technology badges
6. Case studies
7. Articles
8. Contact

### 3. Hero

Keep it quiet. No particle fields, no spinning 3D, no giant glowing green text. Two primary actions only: **View My Work** and **Download CV**.

### 4. Projects are case studies

A project page is not “I developed a hospital module.” Use this structure:

Overview · The problem · The solution · My role · Architecture · Technologies · Key features · Challenges · Implementation · Screenshots · Impact · Results · Lessons learned · Related projects

Impact statements should be concrete (“centralized…”, “reduced manual…”, “enabled…”). Use numbers only when they can be substantiated.

### 5. Experience is a timeline

Do not paste LinkedIn. Keep a dated timeline plus a field-experience note for Somaliland / Somalia telecom work. Do not publish site names, operator internals or sensitive network data.

### 6. Skills are grouped, not scored

Do not use `Python: 95%` bars. Group tools:

- ERP — Odoo 17/18 · Python · PostgreSQL · ORM · XML · Security · Workflows
- Frontend — JavaScript · OWL · Chart.js · HTML · CSS · Tailwind
- DevOps — Linux · Docker · Git · PostgreSQL · Deployment
- Telecom — 2G · 3G · 4G · 5G · RNPO · RF/KPI Analysis
- AI — LLM integrations · AI-assisted workflows · Automation

### 7. Articles demonstrate explanation

Technical consulting requires the ability to explain. Articles live in `content/articles/*.mdx` and should stay precise enough for an engineer and clear enough for a client.

### 8. Visual design

Clean engineering / consulting aesthetic:

| Token        | Value                          |
| ------------ | ------------------------------ |
| Background   | White / very light gray        |
| Text         | Dark charcoal                  |
| Accent       | Deep blue (`#1e3a8a`)          |
| Cards        | White, subtle borders          |
| Typography   | Geist                          |
| Motion       | Hover and fade only, very quiet |

### 9. Filtering

`/projects` is an application surface, not a static grid. Filters: All, ERP, Odoo, Telecom, AI, Web.

### 10. Content is the source of truth

Identity lives in `lib/site.ts`. Projects live in `content/projects/index.ts`. Do not hardcode a new project into a page component.

## Add a project

1. Append a `Project` object in `content/projects/index.ts`.
2. Required fields: `title`, `slug`, `description`, `role`, `technologies`, `category`, `filters`, `problem`, `solution`, `features`, `architecture`, `challenges`, `results`, `impact`.
3. Set `featured: true` to appear on the homepage.
4. Set `caseStudy: true` to generate `/case-studies/[slug]`.
5. Add a visual at `public/projects/<slug>.svg` (or PNG) and reference it from `screenshots`.
6. Optional: `github`, `demo`, `related`.

## Add an article

Create `content/articles/<slug>.mdx`:

```mdx
---
title: "Title"
slug: "title-slug"
description: "One sentence."
date: "2026-01-15"
category: "Odoo"
tags: ["Odoo"]
featured: false
---

Body in MDX.
```

`featured: true` articles appear on the homepage (up to three).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

Regenerate the CV after profile changes:

```bash
python3 scripts/generate-resume.py
```

`reportlab` is required only for that script (`pip install reportlab`).

## Deploy

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com). Framework preset: Next.js.
3. Attach the custom domain `ahmedmuhumed.dev`.
4. Replace placeholder screenshots with production captures when they can be shown without exposing client data.
5. Confirm `lib/site.ts` email, LinkedIn, GitHub and domain before the first public launch.

## What to customize later

- Exact employment dates if they differ from the public summary used here
- Client-safe screenshots in place of the architecture wireframes
- Additional projects — append to the content module, do not fork the page
- Article drafts as they are written
- A signed-off PDF if a designed CV supersedes `scripts/generate-resume.py`
