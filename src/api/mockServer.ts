import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { OptimizationAction, Site, Visit } from '../data/types'

/**
 * Local mock REST backend (IndexedDB) — stands in for Phase 2 API + object store
 * until a real cloud backend exists. Paths mirror docs/PRODUCT_BLUEPRINT.md §7.
 */

interface PortalDb extends DBSchema {
  sites: { key: string; value: Site }
  visits: { key: string; value: Visit }
  actions: { key: string; value: OptimizationAction }
  media: { key: string; value: { id: string; visitId: string; slotId: string; sha256?: string; byteSize?: number; dataUrl?: string; completedAt: string } }
  meta: { key: string; value: string }
}

const DB_NAME = 'tech-rep-portal-api'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<PortalDb>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<PortalDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sites')) db.createObjectStore('sites')
        if (!db.objectStoreNames.contains('visits')) db.createObjectStore('visits')
        if (!db.objectStoreNames.contains('actions')) db.createObjectStore('actions')
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media')
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta')
      },
    })
  }
  return dbPromise
}

export type ApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: string }

function ok<T>(data: T, status = 200): ApiResult<T> {
  return { ok: true, status, data }
}

function fail(error: string, status = 400): ApiResult<never> {
  return { ok: false, status, error }
}

async function latency() {
  await new Promise((r) => setTimeout(r, 120 + Math.random() * 180))
}

/** POST /auth/token — demo token mint */
export async function postAuthToken(userId: string): Promise<ApiResult<{ accessToken: string; expiresIn: number }>> {
  await latency()
  if (!userId) return fail('invalid_user', 401)
  return ok({
    accessToken: `demo.${userId}.${Date.now().toString(36)}`,
    expiresIn: 3600,
  })
}

/** GET /sites?assignedTo=me */
export async function getAssignedSites(sites: Site[]): Promise<ApiResult<{ sites: Site[]; cursor: string }>> {
  await latency()
  const db = await getDb()
  const tx = db.transaction('sites', 'readwrite')
  for (const site of sites) await tx.store.put(site, site.id)
  await tx.done
  return ok({ sites, cursor: new Date().toISOString() })
}

/** POST /visits — upsert visit dossier */
export async function upsertVisit(visit: Visit): Promise<ApiResult<{ visitId: string; syncStatus: 'synced' }>> {
  await latency()
  const db = await getDb()
  const published: Visit = {
    ...visit,
    syncStatus: 'synced',
    syncedAt: new Date().toISOString(),
  }
  await db.put('visits', published, visit.id)

  for (const cap of visit.captures) {
    if (!cap.dataUrl && !cap.sha256) continue
    await db.put(
      'media',
      {
        id: cap.id,
        visitId: visit.id,
        slotId: cap.slotId,
        sha256: cap.sha256,
        byteSize: cap.byteSize,
        dataUrl: cap.dataUrl,
        completedAt: cap.capturedAt,
      },
      cap.id,
    )
  }

  await db.put('meta', new Date().toISOString(), 'sync-cursor')
  return ok({ visitId: visit.id, syncStatus: 'synced' })
}

/** POST /actions — upsert optimization action */
export async function upsertAction(
  action: OptimizationAction,
): Promise<ApiResult<{ actionId: string; syncStatus: 'synced' }>> {
  await latency()
  const db = await getDb()
  const published: OptimizationAction = { ...action, syncStatus: 'synced' }
  await db.put('actions', published, action.id)
  await db.put('meta', new Date().toISOString(), 'sync-cursor')
  return ok({ actionId: action.id, syncStatus: 'synced' })
}

/** GET /portal/sites/:id/dossier */
export async function getPortalDossier(siteId: string): Promise<
  ApiResult<{ siteId: string; visits: Visit[]; actions: OptimizationAction[] }>
> {
  await latency()
  const db = await getDb()
  const visits = (await db.getAll('visits')).filter((v) => v.siteId === siteId)
  const actions = (await db.getAll('actions')).filter((a) => a.siteId === siteId)
  return ok({ siteId, visits, actions })
}

/** GET /sync/cursor */
export async function getSyncCursor(): Promise<ApiResult<{ cursor: string | null }>> {
  await latency()
  const db = await getDb()
  const cursor = (await db.get('meta', 'sync-cursor')) ?? null
  return ok({ cursor })
}

export async function clearPortalApi(): Promise<void> {
  const db = await getDb()
  await Promise.all([
    db.clear('sites'),
    db.clear('visits'),
    db.clear('actions'),
    db.clear('media'),
    db.clear('meta'),
  ])
}
