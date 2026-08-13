# TECH-REP Product Blueprint

Industry-grade digital platform for radio network **site verification**, **structured field data collection**, and **optimization actions** — with a **mobile field app** linked to a **web portal**, designed **offline-first**.

---

## 1. What we are building

| Surface | Who | Purpose |
|---------|-----|---------|
| **Field app** (PWA now → native wrapper later) | Tech reps / contractors on site | Checklists, photo/data capture, log optimization actions — works without network |
| **Web portal** | RF, optimization, ops managers | Site master, visit dossiers, approvals, reporting, audit |
| **Sync backbone** | System | Queues field work offline; uploads media + forms when connectivity returns |

**Core loop:** assign visit → capture on site (offline OK) → sync to portal → RF review / accept → optimization actions with before/after evidence → KPI post-check.

---

## 2. Field app — Site verification

### 2.1 Checklist (required tasks)

Configurable per operator / technology. Default categories:

| Category | Example required tasks |
|----------|------------------------|
| Safety | PPE, RF exclusion, climb permit |
| Civil | Access, fence, foundation, ladder/cage |
| Tower / structure | Visual structural OK, marking, grounding |
| RF / antenna | Azimuth, mechanical tilt, electrical tilt, antenna model, feeder/jumper |
| Power | Rectifier, battery, genset, AC |
| Transmission | MW/fiber status, alarms clear |
| Data collection | All mandatory photo slots complete (see below) |

Each item: **Pending / Pass / Fail / N/A**, measured value, notes, linked evidence IDs.  
Visit cannot close while required items are Pending. Required Fail → visit status **Blocked** (exception to portal).

### 2.2 Structured data collection (media & measurements)

Not free-form photo dumping — **named capture slots** with rules.

| Slot code | Description | Required |
|-----------|-------------|----------|
| `SITE_OVERVIEW` | Site / compound overview | Yes |
| `TOWER_HEIGHT` | Tower / pole height reference photo | Yes |
| `ANTENNA_HEIGHT` | Antenna mounting height photo | Yes |
| `TILT_MECH_{sector}` | Mechanical tilt / bracket photo per sector | Yes per sector |
| `TILT_ELEC_{sector}` | Electrical tilt indicator / RET screenshot if available | Optional / policy |
| `PANORAMA_0` | Horizon panorama bearing **0°** | Yes |
| `PANORAMA_60` | Horizon panorama bearing **60°** | Yes |
| `PANORAMA_120` | Horizon panorama bearing **120°** | Yes |
| `PANORAMA_180` | Horizon panorama bearing **180°** *(recommended; include in template)* | Yes |
| `PANORAMA_240` | Horizon panorama bearing **240°** | Yes |
| `PANORAMA_300` | Horizon panorama bearing **300°** | Yes |
| `SHELTER` / `CABINET` | Indoor / outdoor cabinet | Policy |
| `GROUNDING` | Earthing bond photo | Policy |

**Each capture should store (when device allows):**

- JPEG/WebP blob (compressed on device)
- Timestamp (device + optional server time on sync)
- GPS lat/lng + accuracy
- Compass bearing (for panoramas — warn if off slot bearing by >15°)
- Device id / user id
- Optional EXIF strip policy for privacy vs keep GPS for audit

**Measurements on the same visit:**

- Tower height (m), antenna height (m) — numeric + photo proof
- Per sector: azimuth actual, mechanical tilt actual, electrical tilt actual
- Thresholds vs design (e.g. azimuth Δ > 5°, tilt Δ > 1°) → auto exception

### 2.3 Optimization actions (from the field or portal)

Log actions tied to **site + sector**:

| Type | Example |
|------|---------|
| `TILT_E` | Change electrical tilt 4° → 6° on sector A |
| `TILT_M` | Change mechanical tilt / adjust bracket |
| `PWR` | Power adjust |
| `NBR` | Neighbor add/remove |
| `PCI` | PCI / scrambling conflict fix |
| `CAP` | Capacity recommendation |

Lifecycle: **Proposed → Approved → In progress → Verified → Closed** (or Rejected / Rolled back).

Field tech can record **executed** tilt changes during the visit with before/after photos and values; portal RF lead approves where policy requires.

---

## 3. Web portal — linked system of record

Everything synced from the field becomes the **site dossier**:

- Visit timeline and checklist results
- Full media gallery by slot (panoramas, tilt, heights)
- As-planned vs as-built RF table
- Open / closed optimization actions
- Exceptions and acceptance sign-off
- Export PDF/ZIP for landlord / regulatory / vendor acceptance *(phase 2)*

Roles: Field user, RF engineer, Opt lead, Region manager, Read-only auditor.

---

## 4. Offline-first architecture

```
┌─────────────────────┐     sync queue      ┌─────────────────────┐
│  Field app (PWA)    │ ──────────────────► │  API + object store │
│  IndexedDB + cache  │ ◄────────────────── │  Web portal DB      │
│  camera / GPS       │   site master pull  │  dashboards         │
└─────────────────────┘                     └─────────────────────┘
```

**Rules:**

1. **Download** assigned sites + design parameters before leaving coverage (or last sync).
2. **All writes** go to local DB first (checklist, media blobs, actions).
3. **Sync queue** retries with backoff; media uploads multipart / resumable.
4. **Conflict policy:** field evidence wins for as-built measurements; portal wins for design/planned values; action approval only on portal.
5. **UI:** clear Online / Offline / Syncing / Pending uploads badge.
6. **PWA** app shell cached via service worker; later wrap with Capacitor/Android for Play Store + background upload.

**MVP in this repo:** same codebase serves Field + Portal UIs; IndexedDB persistence; service worker offline shell; sync queue that “publishes” visits to the portal dossier view (simulated server until real API exists).

---

## 5. Target tech stack (industry path)

| Layer | Recommendation |
|-------|----------------|
| Field client | PWA (React) → Capacitor iOS/Android when store distribution needed |
| Portal | Same React app or separate Next.js portal; RBAC |
| API | REST or GraphQL + OpenAPI; idempotent sync endpoints |
| Media | S3-compatible object storage; CDN for portal; virus scan |
| DB | PostgreSQL (sites, visits, actions); Redis for jobs |
| Auth | SSO (Entra/Okta) + field PIN/biometric optional |
| Observability | OpenTelemetry, sync failure alerts, media backlog SLA |
| MDM | Intune/Workspace ONE for contractor devices (optional) |

---

## 6. Data model (extended)

```
Site, Sector                    — master + planned RF
Visit                           — one field session
  checklist[]                   — required tasks
  captures[]                    — typed slots with media refs
  measurements                  — heights, sector actuals
  syncStatus                    — local | pending | synced | error
OptimizationAction              — linked site/sector/visit?
MediaObject                     — blob key, hash, size, gps, bearing
SyncOutbox                      — mutation id, payload, retries
```

See TypeScript types in `src/data/types.ts`.

---

## 7. API surface (production target)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/token` | Login / refresh |
| GET | `/sites?assignedTo=me` | Pull site master for offline |
| POST | `/visits` | Create / upsert visit |
| PUT | `/visits/:id/checklist` | Upsert checklist state |
| POST | `/visits/:id/captures/:slot` | Initiate media upload (presigned URL) |
| PUT | `/media/:id/complete` | Confirm upload + metadata |
| POST | `/actions` | Propose / log optimization action |
| PATCH | `/actions/:id` | Transition workflow |
| GET | `/portal/sites/:id/dossier` | Aggregated visit + media + actions |
| GET | `/sync/cursor` | Delta pull since last sync |

---

## 8. Phased delivery

| Phase | Scope |
|-------|--------|
| **MVP (this repo)** | Field verification UI with checklist + capture slots + camera; optimization actions; portal dossier; PWA offline shell; IndexedDB; mock sync |
| **Phase 2 (this repo)** | Local mock REST API (IndexedDB portal store), demo auth/RBAC, PDF dossier export, compass-assisted panoramas, media SHA-256, immutable audit log |
| **Phase 3** | Capacitor apps, resumable uploads, MDM, OSS/KPI hooks, e-sign acceptance |
| **Phase 4** | Closed-loop SON parameter push, automated post-check |

---

## 9. Success metrics

- % visits with **100% mandatory slots** on first sync
- Median time site arrival → sync complete
- First-time-right (no block on verification)
- Optimization actions with before/after media + verified KPI
- Sync failure rate / media backlog older than 24h

---

## 10. Industry recommendations (do these early)

1. **Slot templates per operator** — don’t hardcode only one photo list; version templates (`templateId` + `version`).
2. **Mandatory vs advisory slots** — enforce in app, not by training alone.
3. **Compress on device** (e.g. 1920px edge, JPEG 0.7) before queueing — towers have poor uplink.
4. **Checksum (SHA-256)** per media file for integrity and dedupe.
5. **Immutable audit log** — who changed tilt, when, old→new value.
6. **Safety first** — block “start climb” checklist until safety items pass (policy flag).
7. **Contractor mode** — limited site list, watermark photos with site code + timestamp.
8. **Design freeze** — planned azimuth/tilt come from planning system; field cannot edit planned.
9. **Retention & privacy** — define media retention (e.g. 5–7 years), EXIF policy, residency.
10. **UAT with real tech reps** — 3 sites, full offline day, measure sync pain before scaling.
11. **Panorama discipline** — include **180°** in the standard set (0/60/120/180/240/300) even if legacy paper packs omitted it.
12. **Dual confirmation for RF-impacting actions** — field executes, RF lead acknowledges on portal within SLA.

---

## 11. Out of scope / still cloud-bound

- Real cloud API / S3 (local mock REST stands in — see `src/api/`)
- Native store builds / Capacitor
- Enterprise SSO (demo role switcher only)
- Live OSS counters
- Hard block on panorama capture when compass Δ > 15° (warn + audit only)
