import { createContext } from 'react'
import type {
  ActionStatus,
  AppState,
  ChecklistItem,
  OptimizationAction,
} from './types'

export type StoreApi = {
  state: AppState
  resetDemo: () => void
  startVisit: (siteId: string) => string
  updateChecklistItem: (
    visitId: string,
    itemId: string,
    patch: Partial<Pick<ChecklistItem, 'status' | 'measuredValue' | 'notes'>>,
  ) => void
  addEvidenceNote: (visitId: string, caption: string) => void
  captureGps: (visitId: string) => void
  addPhotoEvidence: (visitId: string, caption: string) => void
  completeVisit: (visitId: string) => { ok: boolean; message: string }
  updateSectorActuals: (
    siteId: string,
    sectorId: string,
    actuals: { azimuthActual?: number; tiltActual?: number },
  ) => void
  proposeAction: (
    input: Omit<OptimizationAction, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) => string
  transitionAction: (
    actionId: string,
    status: ActionStatus,
    extra?: Partial<OptimizationAction>,
  ) => void
}

export const StoreContext = createContext<StoreApi | null>(null)
