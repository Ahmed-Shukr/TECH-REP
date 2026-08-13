import { api } from './client'
import type { AppState, SyncQueueItem } from '../data/types'

export type SyncFlushResult = {
  flushed: number
  failed: number
  message: string
  nextState: Pick<AppState, 'visits' | 'actions' | 'syncQueue' | 'syncCursor'>
  auditSummary?: string
}

/**
 * Process the outbox against the mock REST API with simple retry bookkeeping.
 */
export async function flushQueueAgainstApi(state: AppState): Promise<SyncFlushResult> {
  if (!state.online && !navigator.onLine) {
    return {
      flushed: 0,
      failed: 0,
      message: 'Offline — sync will retry when connectivity returns',
      nextState: {
        visits: state.visits,
        actions: state.actions,
        syncQueue: state.syncQueue,
        syncCursor: state.syncCursor,
      },
    }
  }

  const auth = await api.authToken(state.currentUser.id)
  if (!auth.ok) {
    return {
      flushed: 0,
      failed: state.syncQueue.length,
      message: `Auth failed (${auth.error})`,
      nextState: {
        visits: state.visits,
        actions: state.actions,
        syncQueue: state.syncQueue,
        syncCursor: state.syncCursor,
      },
    }
  }

  await api.pullSites(state.sites)

  let visits = [...state.visits]
  let actions = [...state.actions]
  const remaining: SyncQueueItem[] = []
  let flushed = 0
  let failed = 0
  const now = new Date().toISOString()

  for (const item of state.syncQueue) {
    if (item.kind === 'visit_upsert') {
      const visit = visits.find((v) => v.id === item.entityId)
      if (!visit) {
        flushed += 1
        continue
      }
      const res = await api.upsertVisit(visit)
      if (res.ok) {
        flushed += 1
        visits = visits.map((v) =>
          v.id === visit.id ? { ...v, syncStatus: 'synced', syncedAt: now } : v,
        )
      } else {
        failed += 1
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
          lastError: res.error,
        })
        visits = visits.map((v) =>
          v.id === visit.id ? { ...v, syncStatus: 'error' } : v,
        )
      }
      continue
    }

    const action = actions.find((a) => a.id === item.entityId)
    if (!action) {
      flushed += 1
      continue
    }
    const res = await api.upsertAction(action)
    if (res.ok) {
      flushed += 1
      actions = actions.map((a) =>
        a.id === action.id ? { ...a, syncStatus: 'synced' } : a,
      )
    } else {
      failed += 1
      remaining.push({
        ...item,
        attempts: item.attempts + 1,
        lastError: res.error,
      })
      actions = actions.map((a) =>
        a.id === action.id ? { ...a, syncStatus: 'error' } : a,
      )
    }
  }

  const cursorRes = await api.syncCursor()
  const syncCursor = cursorRes.ok ? cursorRes.data.cursor ?? now : now

  let message: string
  if (flushed === 0 && failed === 0) {
    message = 'Nothing pending — portal already up to date'
  } else if (failed === 0) {
    message = `Synced ${flushed} item(s) to portal API`
  } else {
    message = `Synced ${flushed}, ${failed} failed — will retry`
  }

  return {
    flushed,
    failed,
    message,
    auditSummary: `flush visits/actions via mock REST (token ${auth.data.accessToken.slice(0, 18)}…)`,
    nextState: {
      visits,
      actions,
      syncQueue: remaining,
      syncCursor,
    },
  }
}
