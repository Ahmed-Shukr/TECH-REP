import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import { flushQueueAgainstApi } from '../api/syncAdapter'
import { can, canTransition, DEFAULT_DEMO_USER } from './auth'
import { clearPersistedState, loadPersistedState, savePersistedState } from './persist'
import { createSeedState } from './seed'
import { StoreContext, type StoreApi } from './store-context'
import { buildCaptureSlots, buildChecklist, slotFillCount } from './templates'
import type {
  ActionStatus,
  AppState,
  AuditEvent,
  CaptureAsset,
  ChecklistItem,
  DemoUser,
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

function makeAudit(
  user: DemoUser,
  partial: Omit<AuditEvent, 'id' | 'at' | 'actorId' | 'actorName' | 'role'>,
): AuditEvent {
  return {
    id: uid('audit'),
    at: new Date().toISOString(),
    actorId: user.id,
    actorName: user.name,
    role: user.role,
    ...partial,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createSeedState())
  const [ready, setReady] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const persisted = await loadPersistedState()
      if (!cancelled && persisted) {
        setState({
          ...persisted,
          online: navigator.onLine,
          currentUser: persisted.currentUser ?? DEFAULT_DEMO_USER,
          auditLog: persisted.auditLog ?? [],
        })
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
    await api.reset()
    const next = createSeedState()
    setState(next)
    await savePersistedState(next)
  }, [])

  const setDemoUser = useCallback((user: DemoUser) => {
    setState((prev) => ({
      ...prev,
      currentUser: user,
      auditLog: [
        makeAudit(user, {
          entityType: 'sync',
          entityId: user.id,
          action: 'auth.switch_role',
          summary: `Switched demo role to ${user.role}`,
          after: user.role,
        }),
        ...prev.auditLog,
      ].slice(0, 500),
    }))
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
      if (!can(state.currentUser.role, 'field.capture')) {
        return ''
      }
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
      setState((prev) => ({
        ...prev,
        visits: [visit, ...prev.visits],
        auditLog: [
          makeAudit(prev.currentUser, {
            entityType: 'visit',
            entityId: id,
            action: 'visit.start',
            summary: `Started verification visit on ${site?.code ?? siteId}`,
          }),
          ...prev.auditLog,
        ].slice(0, 500),
      }))
      enqueue('visit_upsert', id)
      return id
    },
    [enqueue, state.currentUser.role, state.sites],
  )

  const updateChecklistItem = useCallback(
    (
      visitId: string,
      itemId: string,
      patch: Partial<Pick<ChecklistItem, 'status' | 'measuredValue' | 'notes'>>,
    ) => {
      if (!can(state.currentUser.role, 'field.capture')) return
      setState((prev) => {
        const visit = prev.visits.find((v) => v.id === visitId)
        const before = visit?.checklist.find((i) => i.id === itemId)
        return {
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
          auditLog: [
            makeAudit(prev.currentUser, {
              entityType: 'checklist',
              entityId: itemId,
              action: 'checklist.patch',
              summary: `Checklist ${before?.label ?? itemId} → ${patch.status ?? before?.status}`,
              before: before?.status,
              after: patch.status ?? before?.status,
            }),
            ...prev.auditLog,
          ].slice(0, 500),
        }
      })
      enqueue('visit_upsert', visitId)
    },
    [enqueue, state.currentUser.role],
  )

  const upsertCapture = useCallback(
    (visitId: string, asset: Omit<CaptureAsset, 'id'> & { id?: string }) => {
      if (!can(state.currentUser.role, 'field.capture')) return
      setState((prev) => {
        const id = asset.id ?? uid('cap')
        const nextAsset: CaptureAsset = {
          ...asset,
          id,
          userId: asset.userId ?? prev.currentUser.id,
        }
        return {
          ...prev,
          visits: prev.visits.map((v) => {
            if (v.id !== visitId) return v
            const without = v.captures.filter((c) => c.slotId !== asset.slotId)
            return markDirtyVisit({
              ...v,
              captures: [...without, nextAsset],
            })
          }),
          auditLog: [
            makeAudit(prev.currentUser, {
              entityType: 'capture',
              entityId: id,
              action: 'capture.upsert',
              summary: `Captured slot ${asset.slotId}${asset.sha256 ? ` · ${asset.sha256.slice(0, 12)}…` : ''}`,
              after: asset.bearingDeg != null ? `${asset.bearingDeg}°` : undefined,
            }),
            ...prev.auditLog,
          ].slice(0, 500),
        }
      })
      enqueue('visit_upsert', visitId)
    },
    [enqueue, state.currentUser.role],
  )

  const updateMeasurements = useCallback(
    (visitId: string, measurements: VisitMeasurements) => {
      if (!can(state.currentUser.role, 'field.capture')) return
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
        auditLog: [
          makeAudit(prev.currentUser, {
            entityType: 'visit',
            entityId: visitId,
            action: 'visit.measurements',
            summary: `Updated heights tower=${measurements.towerHeightM ?? '—'} antenna=${measurements.antennaHeightM ?? '—'}`,
          }),
          ...prev.auditLog,
        ].slice(0, 500),
      }))
      enqueue('visit_upsert', visitId)
    },
    [enqueue, state.currentUser.role],
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
      if (!can(state.currentUser.role, 'field.capture')) return
      setState((prev) => {
        const site = prev.sites.find((s) => s.id === siteId)
        const sector = site?.sectors.find((s) => s.id === sectorId)
        return {
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
          auditLog: [
            makeAudit(prev.currentUser, {
              entityType: 'sector',
              entityId: sectorId,
              action: 'sector.actuals',
              summary: `Sector ${sector?.name ?? sectorId} actuals updated`,
              before:
                sector != null
                  ? `az ${sector.azimuthActual ?? '—'} / tilt ${sector.tiltActual ?? '—'}`
                  : undefined,
              after: `az ${actuals.azimuthActual ?? sector?.azimuthActual ?? '—'} / tilt ${actuals.mechTiltActual ?? actuals.tiltActual ?? sector?.tiltActual ?? '—'}`,
            }),
            ...prev.auditLog,
          ].slice(0, 500),
        }
      })
    },
    [state.currentUser.role],
  )

  const completeVisit = useCallback(
    (visitId: string) => {
      if (!can(state.currentUser.role, 'field.complete_visit')) {
        return { ok: false, message: 'Your role cannot complete field visits' }
      }
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
          auditLog: [
            makeAudit(prev.currentUser, {
              entityType: 'visit',
              entityId: visitId,
              action: 'visit.complete',
              summary: `Visit marked ${status}`,
              after: status,
            }),
            ...prev.auditLog,
          ].slice(0, 500),
        }
      })
      enqueue('visit_upsert', visitId)
      return result
    },
    [enqueue, state.currentUser.role],
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
        const actionIds = prev.actions
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
        for (const id of actionIds) {
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
    const snapshot = stateRef.current
    if (!navigator.onLine) {
      return { flushed: 0, message: 'Offline — sync will retry when connectivity returns' }
    }
    const result = await flushQueueAgainstApi({ ...snapshot, online: true })
    setState((prev) => ({
      ...prev,
      ...result.nextState,
      auditLog: [
        makeAudit(prev.currentUser, {
          entityType: 'sync',
          entityId: `flush-${Date.now()}`,
          action: 'sync.flush',
          summary: result.auditSummary ?? result.message,
          after: `${result.flushed} ok / ${result.failed} failed`,
        }),
        ...prev.auditLog,
      ].slice(0, 500),
    }))
    return { flushed: result.flushed, message: result.message }
  }, [])

  const proposeAction = useCallback(
    (
      input: Omit<
        OptimizationAction,
        'id' | 'createdAt' | 'updatedAt' | 'status' | 'syncStatus'
      >,
    ) => {
      if (!can(state.currentUser.role, 'action.propose')) return ''
      const id = uid('act')
      const now = new Date().toISOString()
      const action: OptimizationAction = {
        ...input,
        id,
        proposedBy: input.proposedBy || state.currentUser.name,
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
        auditLog: [
          makeAudit(prev.currentUser, {
            entityType: 'action',
            entityId: id,
            action: 'action.propose',
            summary: action.title,
            after: 'proposed',
          }),
          ...prev.auditLog,
        ].slice(0, 500),
      }))
      enqueue('action_upsert', id)
      return id
    },
    [enqueue, state.currentUser],
  )

  const transitionAction = useCallback(
    (actionId: string, status: ActionStatus, extra?: Partial<OptimizationAction>) => {
      if (!canTransition(state.currentUser.role, status)) {
        return { ok: false, message: `Role ${state.currentUser.role} cannot move actions to ${status}` }
      }
      setState((prev) => {
        const existing = prev.actions.find((a) => a.id === actionId)
        return {
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
                    status === 'approved'
                      ? extra?.approvedBy ?? prev.currentUser.name
                      : a.approvedBy,
                },
          ),
          auditLog: [
            makeAudit(prev.currentUser, {
              entityType: 'action',
              entityId: actionId,
              action: 'action.transition',
              summary: `${existing?.title ?? actionId} → ${status}`,
              before: existing?.status,
              after: status,
            }),
            ...prev.auditLog,
          ].slice(0, 500),
        }
      })
      enqueue('action_upsert', actionId)
      return { ok: true, message: `Moved to ${status.replace('_', ' ')}` }
    },
    [enqueue, state.currentUser],
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
        proposedBy: state.currentUser.name,
        expectedImpact: 'Coverage / interference adjustment — verify KPIs 72h',
        valueBefore: input.valueBefore,
        valueAfter: input.valueAfter,
      })
    },
    [proposeAction, state.currentUser.name, state.sites],
  )

  const apiSurface = useMemo<StoreApi>(
    () => ({
      state,
      ready,
      resetDemo,
      setDemoUser,
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
      setDemoUser,
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

  return <StoreContext.Provider value={apiSurface}>{children}</StoreContext.Provider>
}
