import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createSeedState, newChecklistForSite } from './seed'
import { StoreContext, type StoreApi } from './store-context'
import type {
  ActionStatus,
  AppState,
  ChecklistItem,
  OptimizationAction,
  Visit,
} from './types'

const STORAGE_KEY = 'tech-rep-mvp-v1'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignore */
  }
  return createSeedState()
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const resetDemo = useCallback(() => {
    const next = createSeedState()
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
        checklist: newChecklistForSite(site?.code ?? siteId),
        evidence: [
          {
            id: uid('ev'),
            type: 'gps',
            capturedAt: new Date().toISOString(),
            lat: site?.lat,
            lng: site?.lng,
            caption: 'Visit start fix',
          },
        ],
      }
      setState((prev) => ({ ...prev, visits: [visit, ...prev.visits] }))
      return id
    },
    [state.sites],
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
            : {
                ...v,
                checklist: v.checklist.map((item) =>
                  item.id === itemId ? { ...item, ...patch } : item,
                ),
              },
        ),
      }))
    },
    [],
  )

  const addEvidenceNote = useCallback((visitId: string, caption: string) => {
    setState((prev) => ({
      ...prev,
      visits: prev.visits.map((v) =>
        v.id !== visitId
          ? v
          : {
              ...v,
              evidence: [
                ...v.evidence,
                {
                  id: uid('ev'),
                  type: 'note',
                  capturedAt: new Date().toISOString(),
                  caption,
                },
              ],
            },
      ),
    }))
  }, [])

  const captureGps = useCallback((visitId: string) => {
    setState((prev) => {
      const visit = prev.visits.find((v) => v.id === visitId)
      const site = prev.sites.find((s) => s.id === visit?.siteId)
      return {
        ...prev,
        visits: prev.visits.map((v) =>
          v.id !== visitId
            ? v
            : {
                ...v,
                evidence: [
                  ...v.evidence,
                  {
                    id: uid('ev'),
                    type: 'gps',
                    capturedAt: new Date().toISOString(),
                    lat: site ? site.lat + (Math.random() - 0.5) * 0.001 : undefined,
                    lng: site ? site.lng + (Math.random() - 0.5) * 0.001 : undefined,
                    caption: 'Manual GPS capture',
                  },
                ],
              },
        ),
      }
    })
  }, [])

  const addPhotoEvidence = useCallback((visitId: string, caption: string) => {
    setState((prev) => ({
      ...prev,
      visits: prev.visits.map((v) =>
        v.id !== visitId
          ? v
          : {
              ...v,
              evidence: [
                ...v.evidence,
                {
                  id: uid('ev'),
                  type: 'photo',
                  capturedAt: new Date().toISOString(),
                  caption,
                  preview: 'photo',
                },
              ],
            },
      ),
    }))
  }, [])

  const completeVisit = useCallback((visitId: string) => {
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
          message: `${pendingRequired.length} required item(s) still pending`,
        }
        return prev
      }

      const failedRequired = visit.checklist.filter(
        (i) => i.required && i.status === 'fail',
      )
      const rfFails = visit.checklist.filter(
        (i) => i.category === 'rf' && i.status === 'fail',
      )
      const hasPhoto = visit.evidence.some((e) => e.type === 'photo')
      if (rfFails.length && !hasPhoto) {
        result = {
          ok: false,
          message: 'RF failures require at least one photo evidence',
        }
        return prev
      }

      const status = failedRequired.length ? 'blocked' : 'completed'
      result = {
        ok: true,
        message:
          status === 'blocked'
            ? 'Visit closed as blocked — exceptions recorded'
            : 'Visit completed — acceptance packet ready',
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
            ? { ...v, status, completedAt: new Date().toISOString() }
            : v,
        ),
      }
    })
    return result
  }, [])

  const updateSectorActuals = useCallback(
    (
      siteId: string,
      sectorId: string,
      actuals: { azimuthActual?: number; tiltActual?: number },
    ) => {
      setState((prev) => ({
        ...prev,
        sites: prev.sites.map((s) =>
          s.id !== siteId
            ? s
            : {
                ...s,
                sectors: s.sectors.map((sec) =>
                  sec.id === sectorId ? { ...sec, ...actuals } : sec,
                ),
              },
        ),
      }))
    },
    [],
  )

  const proposeAction = useCallback(
    (input: Omit<OptimizationAction, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const id = uid('act')
      const now = new Date().toISOString()
      const action: OptimizationAction = {
        ...input,
        id,
        status: 'proposed',
        createdAt: now,
        updatedAt: now,
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
      return id
    },
    [],
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
                completedAt:
                  status === 'closed' || status === 'verified'
                    ? new Date().toISOString()
                    : a.completedAt,
                approvedBy:
                  status === 'approved' ? extra?.approvedBy ?? 'Opt Lead' : a.approvedBy,
              },
        ),
      }))
    },
    [],
  )

  const api = useMemo<StoreApi>(
    () => ({
      state,
      resetDemo,
      startVisit,
      updateChecklistItem,
      addEvidenceNote,
      captureGps,
      addPhotoEvidence,
      completeVisit,
      updateSectorActuals,
      proposeAction,
      transitionAction,
    }),
    [
      state,
      resetDemo,
      startVisit,
      updateChecklistItem,
      addEvidenceNote,
      captureGps,
      addPhotoEvidence,
      completeVisit,
      updateSectorActuals,
      proposeAction,
      transitionAction,
    ],
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}
