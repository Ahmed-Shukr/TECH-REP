# TECH-REP

Industry-oriented **field app + web portal** for radio site verification, structured data collection, and optimization actions — designed **offline-first**.

## Docs

- [`docs/PRODUCT_BLUEPRINT.md`](docs/PRODUCT_BLUEPRINT.md) — architecture, capture slots, sync model, API target, industry recommendations

## What’s in this build

### Field app
- Run a **site verification checklist** (safety, civil, RF, power, transmission, data collection)
- Collect structured evidence:
  - Site overview, tower height photo, antenna height photo
  - Per-sector mechanical / electrical tilt photos
  - Panoramas at **0° / 60° / 120° / 180° / 240° / 300°** with **compass assist** (Δ > 15° warning)
  - Numeric tower & antenna heights + sector actuals
- Photos compressed on device (**1920px / JPEG 0.7**) with **SHA-256** integrity
- Log **optimization actions** (electrical / mechanical tilt changes, etc.)
- Work **offline** (PWA shell + IndexedDB); queue and **Sync to portal** via local mock REST API

### Web portal
- Browse visit dossiers after sync
- Review checklist results, media gallery by slot, linked actions
- **Export PDF** dossier (print / Save as PDF)
- **Audit log** of captures, checklist changes, action transitions, and sync flushes

### Demo RBAC
Use the top-bar **Role** switcher:
- Field — capture + propose
- RF / Opt Lead / Region Manager — approve / verify / close
- Auditor — read-only portal + audit

## Run

```bash
npm install
npm run dev
```

Production build (includes service worker):

```bash
npm run build
npm run preview
```

Installable as a PWA from the browser when served over HTTPS / localhost.

## Suggested next production steps

1. Swap `src/api/client.ts` to a real HTTP backend + object storage  
2. Enterprise SSO instead of the demo role switcher  
3. Capacitor wrapper for Play Store / MDM  
4. Hard-gate panoramas on compass when policy requires it  
5. Server-side PDF acceptance packs  

See blueprint §10 for the full recommendation list.
