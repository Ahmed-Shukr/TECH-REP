# TECH-REP

Digital field operations for radio networks: **site verification**, **optimization actions**, and an ops dashboard.

## What’s in this repo

| Path | Purpose |
|------|---------|
| [`docs/PRODUCT_BLUEPRINT.md`](docs/PRODUCT_BLUEPRINT.md) | Product vision, modules, data model, APIs, roadmap |
| `src/` | MVP web app (React + Vite + TypeScript) |

## MVP capabilities

- Site inventory with planned vs actual sector parameters
- Start / continue verification visits with categorized checklists
- Evidence stubs: GPS, photo, notes
- Complete visits with validation (required items, RF photo rule)
- Propose and transition optimization actions (catalog types)
- Dashboard metrics + demo data in `localStorage` (Reset demo in the header)

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Design note

Landing and console use a field-ops visual language (Syne + IBM Plex Sans, atmospheric wash, signal teal / copper accents). Demo data is seeded for Indonesia-style regions for narrative concreteness only.
