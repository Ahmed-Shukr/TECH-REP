# TECH-REP

Industry-oriented **field app + web portal** for radio site verification, structured data collection, and optimization actions — designed **offline-first**.

## Docs

- [`docs/PRODUCT_BLUEPRINT.md`](docs/PRODUCT_BLUEPRINT.md) — architecture, capture slots, sync model, API target, industry recommendations

## What you can do in the MVP

### Field app
- Run a **site verification checklist** (safety, civil, RF, power, transmission, data collection)
- Collect structured evidence:
  - Site overview, tower height photo, antenna height photo
  - Per-sector mechanical / electrical tilt photos
  - Panoramas at **0° / 60° / 120° / 180° / 240° / 300°**
  - Numeric tower & antenna heights + sector actuals
- Log **optimization actions** (electrical / mechanical tilt changes, etc.)
- Work **offline** (PWA shell + IndexedDB); queue and **Sync to portal**

### Web portal
- Browse visit dossiers after sync
- Review checklist results, media gallery by slot, linked actions

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

1. Real API + object storage for media  
2. Auth / RBAC (field vs RF vs manager)  
3. Capacitor wrapper for Play Store / MDM  
4. Compass-assisted panorama validation  
5. PDF acceptance pack export  

See blueprint §10 for the full recommendation list.
