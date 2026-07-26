import { createContext } from 'react'
import type {
  ActionStatus,
  AppState,
  CaptureAsset,
  ChecklistItem,
  OptimizationAction,
  VisitMeasurements,
} from './types'

export type StoreApi = {
  state: AppState
  ready: boolean
  resetDemo: () => Promise<void>
  startVisit: (siteId: string) => string
  updateChecklistItem: (
    visitId: string,
    itemId: string,
    patch: Partial<Pick<ChecklistItem, 'status' | 'measuredValue' | 'notes'>>,
  ) => void
  upsertCapture: (visitId: string, asset: Omit<CaptureAsset, 'id'> & { id?: string }) => void
  updateMeasurements: (visitId: string, measurements: VisitMeasurements) => void
  updateSectorActuals: (
    siteId: string,
    sectorId: string,
    actuals: {
      azimuthActual?: number
      tiltActual?: number
      mechTiltActual?: number
      elecTiltActual?: number
      antennaHeightM?: number
    },
  ) => void
  completeVisit: (visitId: string) => { ok: boolean; message: string }
  queueSync: (visitId?: string) => void
  flushSyncQueue: () => Promise<{ flushed: number; message: string }>
  proposeAction: (
    input: Omit<
      OptimizationAction,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'syncStatus'
    >,
  ) => string
  transitionAction: (
    actionId: string,
    status: ActionStatus,
    extra?: Partial<OptimizationAction>,
  ) => void
  logFieldTiltAction: (input: {
    siteId: string
    sectorId: string
    visitId: string
    type: 'TILT_E' | 'TILT_M'
    valueBefore: string
    valueAfter: string
    note?: string
  }) => string
}

export const StoreContext = createContext<StoreApi | null>(null)

export type { AppState }
