import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearPersistedState, loadPersistedState, savePersistedState } from './persist'
import { createSeedState } from './seed'
import { StoreContext, type StoreApi } from './store-context'
import { buildCaptureSlots, buildChecklist, slotFillCount } from './templates'
import type {
  ActionStatus,
  AppState,
  CaptureAsset,
  ChecklistItem,
  OptimizationAction,
  Visit,
  VisitMeasurements,
} from './types'

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function markDirtyVisit(visit: Visit): Visit {
  return {
    ...visit,
    syncStatus: visit.syncStatus === 'synced' ? 'pending' : visit.syncStatus === 'local' ? 'local' : 'pending',
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createSeedState())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const persisted = await loadPersistedState()
      if (!cancelled && persisted) {
        setState({ ...persisted, online: navigator.onLine })
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    void savePersistedState(state)
  }, [state, ready])

  useEffect(() => {
    const onOnline = () => setState((s) => ({ ...s, online: true }))
    const onOffline = () => setState((s) => ({ ...s, online: false }))
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const resetDemo = useCallback(async () => {
    await clearPersistedState()
    const next = createSeedState()
    setState(next)
    await savePersistedState(next)
  }, [])

  const enqueue = useCallback((kind: 'visit_upsert' | 'action_upsert', entityId: string) => {
    setState((prev) => {
      if (prev.syncQueue.some((q) => q.kind === kind && q.entityId === entityId)) {
        return prev
      }
      return {
        ...prev,
        syncQueue: [
          ...prev.syncQueue,
          {
            id: uid('sync'),
            createdAt: new Date().toISOString(),
            kind,
            entityId,
            attempts: 0,
          },
        ],
      }
    })
  }, [])

  const startVisit = useCallback(
    (siteId: string) => {
      const site = state.sites.find((s) => s.id === siteId)
      const id = uid('visit')
      const visit: Visit = {
        id,
        siteId,
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        syncStatus: 'local',
        checklist: buildChecklist(site?.code ?? siteId),
        slots: buildCaptureSlots(site?.sectors ?? []),
        captures: [],
        measurements: {},
      }
      setState((prev) => ({ ...prev, visits: [visit, ...prev.visits] }))
      enqueue('visit_upsert', id)
      return id
    },
    [enqueue, state.sites],
  )

  const updateChecklistItem = useCallback(
    (
      visitId: string,
      itemId: string,
      patch: Partial<Pick<ChecklistItem, 'status' | 'measuredValue' | 'notes'>>,
    ) => {
      setState((prev) => ({
        ...prev,
        visits: prev.visits.map((v) =>
          v.id !== visitId
            ? v
            : markDirtyVisit({
                ...v,
                checklist: v.checklist.map((item) =>
                  item.id === itemId ? { ...item, ...patch } : item,
                ),
              }),
        ),
      }))
      enqueue('visit_upsert', visitId)
    },
    [enqueue],
  )

  const upsertCapture = useCallback(
    (visitId: string, asset: Omit<CaptureAsset, 'id'> & { id?: string }) => {
      setState((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => {
          if (v.id !== visitId) return v
          const id = asset.id ?? uid('cap')
          const nextAsset: CaptureAsset = { ...asset, id }
          const without = v.captures.filter((c) => c.slotId !== asset.slotId)
          return markDirtyVisit({
            ...v,
            captures: [...without, nextAsset],
          })
        }),
      }))
      enqueue('visit_upsert', visitId)
    },
    [enqueue],
  )

  const updateMeasurements = useCallback(
    (visitId: string, measurements: VisitMeasurements) => {
      setState((prev) => ({
        ...prev,
        visits: prev.visits.map((v) =>
          v.id !== visitId
            ? v
            : markDirtyVisit({
                ...v,
                measurements: { ...v.measurements, ...measurements },
              }),
        ),
      }))
      enqueue('visit_upsert', visitId)
    },
    [enqueue],
  )

  const updateSectorActuals = useCallback(
    (
      siteId: string,
      sectorId: string,
      actuals: {
        azimuthActual?: number
        tiltActual?: number
        mechTiltActual?: number
        elecTiltActual?: number
        antennaHeightM?: number
      },
    ) => {
      setState((prev) => ({
        ...prev,
        sites: prev.sites.map((s) =>
          s.id !== siteId
            ? s
            : {
                ...s,
                sectors: s.sectors.map((sec) =>
                  sec.id === sectorId
                    ? {
                        ...sec,
                        ...actuals,
                        tiltActual: actuals.mechTiltActual ?? actuals.tiltActual ?? sec.tiltActual,
                      }
                    : sec,
                ),
              },
        ),
      }))
    },
    [],
  )

  const completeVisit = useCallback(
    (visitId: string) => {
      let result = { ok: false, message: 'Visit not found' }
      setState((prev) => {
        const visit = prev.visits.find((v) => v.id === visitId)
        if (!visit) return prev

        const pendingRequired = visit.checklist.filter(
          (i) => i.required && i.status === 'pending',
        )
        if (pendingRequired.length) {
          result = {
            ok: false,
            message: `${pendingRequired.length} required checklist item(s) still pending`,
          }
          return prev
        }

        const captured = new Set(visit.captures.map((c) => c.slotId))
        const fill = slotFillCount(visit.slots, captured)
        if (!fill.complete) {
          result = {
            ok: false,
            message: `Mandatory data collection incomplete (${fill.filled}/${fill.required} slots)`,
          }
          return prev
        }

        if (
          visit.measurements.towerHeightM === undefined ||
          visit.measurements.antennaHeightM === undefined
        ) {
          result = {
            ok: false,
            message: 'Enter tower height and antenna height before completing',
          }
          return prev
        }

        const failedRequired = visit.checklist.filter(
          (i) => i.required && i.status === 'fail',
        )
        const status = failedRequired.length ? 'blocked' : 'completed'
        result = {
          ok: true,
          message:
            status === 'blocked'
              ? 'Visit closed as blocked — queued for portal sync'
              : 'Visit completed — queued for portal sync',
        }

        return {
          ...prev,
          sites: prev.sites.map((s) =>
            s.id === visit.siteId
              ? {
                  ...s,
                  status:
                    status === 'blocked'
                      ? 'blocked'
                      : s.status === 'build'
                        ? 'active'
                        : s.status,
                }
              : s,
          ),
          visits: prev.visits.map((v) =>
            v.id === visitId
              ? {
                  ...v,
                  status,
                  completedAt: new Date().toISOString(),
                  syncStatus: 'pending',
                }
              : v,
          ),
        }
      })
      enqueue('visit_upsert', visitId)
      return result
    },
    [enqueue],
  )

  const queueSync = useCallback(
    (visitId?: string) => {
      if (visitId) {
        enqueue('visit_upsert', visitId)
        setState((prev) => ({
          ...prev,
          visits: prev.visits.map((v) =>
            v.id === visitId ? { ...v, syncStatus: 'pending' } : v,
          ),
        }))
        return
      }
      setState((prev) => {
        const ids = prev.visits
          .filter((v) => v.syncStatus !== 'synced')
          .map((v) => v.id)
        const actions = prev.actions
          .filter((a) => a.syncStatus !== 'synced')
          .map((a) => a.id)
        const queue = [...prev.syncQueue]
        for (const id of ids) {
          if (!queue.some((q) => q.kind === 'visit_upsert' && q.entityId === id)) {
            queue.push({
              id: uid('sync'),
              createdAt: new Date().toISOString(),
              kind: 'visit_upsert',
              entityId: id,
              attempts: 0,
            })
          }
        }
        for (const id of actions) {
          if (!queue.some((q) => q.kind === 'action_upsert' && q.entityId === id)) {
            queue.push({
              id: uid('sync'),
              createdAt: new Date().toISOString(),
              kind: 'action_upsert',
              entityId: id,
              attempts: 0,
            })
          }
        }
        return {
          ...prev,
          syncQueue: queue,
          visits: prev.visits.map((v) =>
            v.syncStatus !== 'synced' ? { ...v, syncStatus: 'pending' } : v,
          ),
          actions: prev.actions.map((a) =>
            a.syncStatus !== 'synced' ? { ...a, syncStatus: 'pending' } : a,
          ),
        }
      })
    },
    [enqueue],
  )

  const flushSyncQueue = useCallback(async () => {
    if (!navigator.onLine) {
      return { flushed: 0, message: 'Offline — sync will retry when connectivity returns' }
    }
    // Simulated portal publish latency
    await new Promise((r) => setTimeout(r, 450))
    let flushed = 0
    setState((prev) => {
      flushed = prev.syncQueue.length
      const visitIds = new Set(
        prev.syncQueue.filter((q) => q.kind === 'visit_upsert').map((q) => q.entityId),
      )
      const actionIds = new Set(
        prev.syncQueue.filter((q) => q.kind === 'action_upsert').map((q) => q.entityId),
      )
      const now = new Date().toISOString()
      return {
        ...prev,
        syncQueue: [],
        visits: prev.visits.map((v) =>
          visitIds.has(v.id) ? { ...v, syncStatus: 'synced', syncedAt: now } : v,
        ),
        actions: prev.actions.map((a) =>
          actionIds.has(a.id) ? { ...a, syncStatus: 'synced' } : a,
        ),
      }
    })
    return {
      flushed,
      message:
        flushed === 0
          ? 'Nothing pending — portal already up to date'
          : `Synced ${flushed} item(s) to portal`,
    }
  }, [])

  const proposeAction = useCallback(
    (
      input: Omit<
        OptimizationAction,
        'id' | 'createdAt' | 'updatedAt' | 'status' | 'syncStatus'
      >,
    ) => {
      const id = uid('act')
      const now = new Date().toISOString()
      const action: OptimizationAction = {
        ...input,
        id,
        status: 'proposed',
        createdAt: now,
        updatedAt: now,
        syncStatus: 'pending',
      }
      setState((prev) => ({
        ...prev,
        actions: [action, ...prev.actions],
        sites: prev.sites.map((s) =>
          s.id === input.siteId && s.status === 'active'
            ? { ...s, status: 'optimization' }
            : s,
        ),
      }))
      enqueue('action_upsert', id)
      return id
    },
    [enqueue],
  )

  const transitionAction = useCallback(
    (actionId: string, status: ActionStatus, extra?: Partial<OptimizationAction>) => {
      setState((prev) => ({
        ...prev,
        actions: prev.actions.map((a) =>
          a.id !== actionId
            ? a
            : {
                ...a,
                ...extra,
                status,
                updatedAt: new Date().toISOString(),
                syncStatus: 'pending',
                completedAt:
                  status === 'closed' || status === 'verified'
                    ? new Date().toISOString()
                    : a.completedAt,
                approvedBy:
                  status === 'approved' ? extra?.approvedBy ?? 'Opt Lead' : a.approvedBy,
              },
        ),
      }))
      enqueue('action_upsert', actionId)
    },
    [enqueue],
  )

  const logFieldTiltAction = useCallback(
    (input: {
      siteId: string
      sectorId: string
      visitId: string
      type: 'TILT_E' | 'TILT_M'
      valueBefore: string
      valueAfter: string
      note?: string
    }) => {
      const site = state.sites.find((s) => s.id === input.siteId)
      const sector = site?.sectors.find((s) => s.id === input.sectorId)
      return proposeAction({
        siteId: input.siteId,
        sectorId: input.sectorId,
        visitId: input.visitId,
        type: input.type,
        title: `${input.type === 'TILT_E' ? 'Electrical' : 'Mechanical'} tilt change — sector ${sector?.name ?? ''}`,
        description:
          input.note ??
          `Field-logged ${input.type} change from ${input.valueBefore} to ${input.valueAfter}`,
        priority: 'high',
        proposedBy: 'Field Tech Rep',
        expectedImpact: 'Coverage / interference adjustment — verify KPIs 72h',
        valueBefore: input.valueBefore,
        valueAfter: input.valueAfter,
      })
    },
    [proposeAction, state.sites],
  )

  const api = useMemo<StoreApi>(
    () => ({
      state,
      ready,
      resetDemo,
      startVisit,
      updateChecklistItem,
      upsertCapture,
      updateMeasurements,
      updateSectorActuals,
      completeVisit,
      queueSync,
      flushSyncQueue,
      proposeAction,
      transitionAction,
      logFieldTiltAction,
    }),
    [
      state,
      ready,
      resetDemo,
      startVisit,
      updateChecklistItem,
      upsertCapture,
      updateMeasurements,
      updateSectorActuals,
      completeVisit,
      queueSync,
      flushSyncQueue,
      proposeAction,
      transitionAction,
      logFieldTiltAction,
    ],
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}
