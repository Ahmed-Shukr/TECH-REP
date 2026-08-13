import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { DEFAULT_DEMO_USER } from './auth'
import type { AppState } from './types'

interface TechRepDb extends DBSchema {
  meta: {
    key: string
    value: AppState
  }
}

const DB_NAME = 'tech-rep-db'
const DB_VERSION = 1
const STATE_KEY = 'app-state-v3'
const LEGACY_KEYS = ['app-state-v2']

let dbPromise: Promise<IDBPDatabase<TechRepDb>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<TechRepDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }
      },
    })
  }
  return dbPromise
}

function normalizeState(raw: AppState | null): AppState | null {
  if (!raw) return null
  return {
    ...raw,
    currentUser: raw.currentUser ?? DEFAULT_DEMO_USER,
    auditLog: raw.auditLog ?? [],
    syncCursor: raw.syncCursor,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
  }
}

export async function loadPersistedState(): Promise<AppState | null> {
  try {
    const db = await getDb()
    const current = await db.get('meta', STATE_KEY)
    if (current) return normalizeState(current)

    for (const key of LEGACY_KEYS) {
      const legacy = await db.get('meta', key)
      if (legacy) {
        const normalized = normalizeState(legacy)
        if (normalized) {
          await db.put('meta', normalized, STATE_KEY)
          await db.delete('meta', key)
          return normalized
        }
      }
    }
    return null
  } catch {
    return null
  }
}

export async function savePersistedState(state: AppState): Promise<void> {
  const db = await getDb()
  await db.put('meta', state, STATE_KEY)
}

export async function clearPersistedState(): Promise<void> {
  const db = await getDb()
  await db.delete('meta', STATE_KEY)
  for (const key of LEGACY_KEYS) await db.delete('meta', key)
}
