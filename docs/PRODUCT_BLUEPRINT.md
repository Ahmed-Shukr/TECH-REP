# TECH-REP Product Blueprint

Digital platform for radio network field operations: site verification, optimization actions, and closed-loop evidence.

## 1. Vision

Replace paper checklists, scattered photos, and tribal optimization knowledge with a single **site-centric** workflow: plan → visit → verify → act → prove.

**Primary users**

| Role | Job |
|------|-----|
| Tech Rep / Field Engineer | Run site verification, capture evidence, execute approved actions |
| RF / Optimization Engineer | Review exceptions, propose/approve optimization actions |
| Region / Ops Manager | Track SLA, first-time-right, open sites, KPI outcomes |
| Contractor Supervisor | Assign visits, ensure mandatory evidence before close |

## 2. Product modules

### M1 — Site Master
Single inventory of sites, cells/sectors, planned RF parameters, and asset tags.

- Site ID, name, region, technology (2G/3G/4G/5G), status
- Sectors: azimuth (planned), tilt (planned), height, PCI/PSC, power
- Links to design docs and previous visits

### M2 — Site Verification (field)
Mobile-first visit workflow with offline support (MVP: online + mock GPS).

- Standardized checklists: Civil, RF, Power, Transmission, Safety
- As-planned vs as-built capture (azimuth, tilt, GPS, photos)
- Pass / fail / exception with mandatory evidence rules
- Auto-generated visit report & acceptance packet

### M3 — Optimization Actions
Catalog-driven RF actions tied to KPIs and sites.

- Action types: electrical/mechanical tilt, power, neighbor add/remove, PCI fix, capacity note
- Lifecycle: Proposed → Approved → In progress → Verified → Closed (or Rolled back)
- Expected impact + mandatory post-check window
- Evidence and before/after KPI notes

### M4 — Operations Dashboard
Region view of verification progress, open exceptions, and optimization hit rate.

### M5 — Integrations (post-MVP)
- OSS/NMS (CM/PM/FM)
- Planning / design export
- Ticketing (ServiceNow, Jira)
- SON / parameter push APIs
- Identity (SSO), contractor portals

## 3. Data model (core)

```
Site
  id, code, name, region, lat, lng, technology[], status
  sectors[]: Sector
  visits[]: Visit
  actions[]: OptimizationAction

Sector
  id, name, azimuthPlanned, tiltPlanned, azimuthActual?, tiltActual?
  heightM, technology, pci?

Visit
  id, siteId, startedAt, completedAt?, status (draft|in_progress|completed|blocked)
  checklist: ChecklistItem[]
  evidence: Evidence[]
  notes?

ChecklistItem
  id, category, label, required, status (pending|pass|fail|na)
  measuredValue?, plannedValue?, evidenceIds[]

Evidence
  id, type (photo|gps|note|measurement), capturedAt
  lat?, lng?, caption?, dataUrl? (MVP media)

OptimizationAction
  id, siteId, sectorId?, type, title, description
  status (proposed|approved|in_progress|verified|closed|rejected)
  priority, proposedBy, approvedBy?
  expectedImpact, kpiBefore?, kpiAfter?
  createdAt, updatedAt, completedAt?
```

## 4. API surface (target)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/sites` | List sites (filter region/status) |
| GET | `/api/sites/:id` | Site detail + sectors |
| POST | `/api/sites/:id/visits` | Start verification visit |
| PATCH | `/api/visits/:id/items/:itemId` | Update checklist item |
| POST | `/api/visits/:id/evidence` | Attach evidence |
| POST | `/api/visits/:id/complete` | Complete visit (validate required) |
| GET | `/api/actions` | List optimization actions |
| POST | `/api/actions` | Propose action |
| PATCH | `/api/actions/:id` | Transition status |
| GET | `/api/dashboard` | Aggregated ops metrics |

**MVP persistence:** browser `localStorage` with seeded demo data (no backend).

## 5. Verification rules (MVP)

- Required checklist items must be `pass` or `na` to complete (fails create an exception but visit can complete as `blocked` if required fails).
- Azimuth/tilt: flag exception if \|actual − planned\| > threshold (azimuth 5°, tilt 1°).
- At least one photo evidence for RF category when any RF item fails.
- GPS stub recorded at visit start.

## 6. Optimization action catalog

| Code | Type | Typical trigger |
|------|------|-----------------|
| TILT_E | Electrical tilt adjust | Overshoot / coverage hole |
| TILT_M | Mechanical tilt adjust | Persistent overshoot |
| PWR | Power adjust | Interference / dominance |
| NBR | Neighbor relation | HO fail / missing neighbor |
| PCI | PCI / scrambling conflict | Confusion / drops |
| CAP | Capacity recommendation | PRB congestion |

## 7. Phased roadmap

1. **MVP (this repo)** — Web app: landing, dashboard, sites, verification UI, optimization workflow, local seed data
2. **Field hardening** — PWA offline, real camera/GPS, role auth, PDF report export
3. **Integrations** — OSS KPI ingest, design import, ticketing sync
4. **Closed loop** — Approved parameter push, automatic post-check, rollback

## 8. Success metrics

- First-time-right verification rate
- Mean time visit → acceptance
- % optimization actions with verified KPI lift
- Open exceptions older than SLA
- Evidence completeness per closed visit

## 9. Out of scope for MVP

- Real OSS connectivity
- Native mobile apps
- Multi-tenant SSO
- Automated SON execution
- Full GIS coverage layers
