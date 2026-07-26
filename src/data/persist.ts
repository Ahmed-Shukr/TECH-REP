import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { AppState } from './types'

interface TechRepDb extends DBSchema {
  meta: {
    key: string
    value: AppState
  }
}

const DB_NAME = 'tech-rep-db'
const DB_VERSION = 1
const STATE_KEY = 'app-state-v2'

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

export async function loadPersistedState(): Promise<AppState | null> {
  try {
    const db = await getDb()
    return (await db.get('meta', STATE_KEY)) ?? null
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
}
