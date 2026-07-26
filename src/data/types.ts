export type SiteStatus = 'active' | 'build' | 'optimization' | 'blocked'
export type VisitStatus = 'draft' | 'in_progress' | 'completed' | 'blocked'
export type ItemStatus = 'pending' | 'pass' | 'fail' | 'na'
export type ChecklistCategory =
  | 'safety'
  | 'civil'
  | 'rf'
  | 'power'
  | 'transmission'
  | 'data_collection'
export type ActionStatus =
  | 'proposed'
  | 'approved'
  | 'in_progress'
  | 'verified'
  | 'closed'
  | 'rejected'
export type ActionType = 'TILT_E' | 'TILT_M' | 'PWR' | 'NBR' | 'PCI' | 'CAP'
export type SyncStatus = 'local' | 'pending' | 'synced' | 'error'

/** Structured field capture slot kinds */
export type CaptureSlotKind =
  | 'SITE_OVERVIEW'
  | 'TOWER_HEIGHT'
  | 'ANTENNA_HEIGHT'
  | 'TILT_MECH'
  | 'TILT_ELEC'
  | 'PANORAMA'
  | 'SHELTER'
  | 'GROUNDING'
  | 'OTHER'

export interface Sector {
  id: string
  name: string
  technology: string
  azimuthPlanned: number
  tiltPlanned: number
  /** Mechanical tilt planned (same as tiltPlanned when single value) */
  mechTiltPlanned?: number
  elecTiltPlanned?: number
  azimuthActual?: number
  tiltActual?: number
  mechTiltActual?: number
  elecTiltActual?: number
  antennaHeightM?: number
  heightM: number
  pci?: number
}

export interface CaptureSlotDef {
  id: string
  kind: CaptureSlotKind
  label: string
  required: boolean
  /** For panoramas: expected compass bearing */
  bearingDeg?: number
  sectorId?: string
}

export interface CaptureAsset {
  id: string
  slotId: string
  capturedAt: string
  lat?: number
  lng?: number
  accuracyM?: number
  bearingDeg?: number
  note?: string
  /** Compressed JPEG data URL for MVP offline store */
  dataUrl?: string
  /** Measurement entered with this capture (e.g. height meters) */
  measuredValue?: string
}

export interface ChecklistItem {
  id: string
  category: ChecklistCategory
  label: string
  required: boolean
  status: ItemStatus
  plannedValue?: string
  measuredValue?: string
  evidenceIds: string[]
  notes?: string
}

export interface VisitMeasurements {
  towerHeightM?: number
  antennaHeightM?: number
}

export interface Visit {
  id: string
  siteId: string
  startedAt: string
  completedAt?: string
  status: VisitStatus
  syncStatus: SyncStatus
  syncedAt?: string
  checklist: ChecklistItem[]
  /** Slot definitions frozen at visit start from template */
  slots: CaptureSlotDef[]
  captures: CaptureAsset[]
  measurements: VisitMeasurements
  notes?: string
}

export interface Site {
  id: string
  code: string
  name: string
  region: string
  lat: number
  lng: number
  technology: string[]
  status: SiteStatus
  sectors: Sector[]
  address: string
}

export interface OptimizationAction {
  id: string
  siteId: string
  sectorId?: string
  visitId?: string
  type: ActionType
  title: string
  description: string
  status: ActionStatus
  priority: 'low' | 'medium' | 'high'
  proposedBy: string
  approvedBy?: string
  expectedImpact: string
  /** e.g. electrical tilt before */
  valueBefore?: string
  valueAfter?: string
  kpiBefore?: string
  kpiAfter?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  syncStatus: SyncStatus
}

export interface SyncQueueItem {
  id: string
  createdAt: string
  kind: 'visit_upsert' | 'action_upsert'
  entityId: string
  attempts: number
  lastError?: string
}

export interface AppState {
  sites: Site[]
  visits: Visit[]
  actions: OptimizationAction[]
  syncQueue: SyncQueueItem[]
  online: boolean
}
