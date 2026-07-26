export type SiteStatus = 'active' | 'build' | 'optimization' | 'blocked'
export type VisitStatus = 'draft' | 'in_progress' | 'completed' | 'blocked'
export type ItemStatus = 'pending' | 'pass' | 'fail' | 'na'
export type ChecklistCategory = 'civil' | 'rf' | 'power' | 'transmission' | 'safety'
export type ActionStatus =
  | 'proposed'
  | 'approved'
  | 'in_progress'
  | 'verified'
  | 'closed'
  | 'rejected'
export type ActionType = 'TILT_E' | 'TILT_M' | 'PWR' | 'NBR' | 'PCI' | 'CAP'

export interface Sector {
  id: string
  name: string
  technology: string
  azimuthPlanned: number
  tiltPlanned: number
  azimuthActual?: number
  tiltActual?: number
  heightM: number
  pci?: number
}

export interface Evidence {
  id: string
  type: 'photo' | 'gps' | 'note' | 'measurement'
  capturedAt: string
  lat?: number
  lng?: number
  caption?: string
  /** MVP: placeholder or data URL */
  preview?: string
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

export interface Visit {
  id: string
  siteId: string
  startedAt: string
  completedAt?: string
  status: VisitStatus
  checklist: ChecklistItem[]
  evidence: Evidence[]
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
  type: ActionType
  title: string
  description: string
  status: ActionStatus
  priority: 'low' | 'medium' | 'high'
  proposedBy: string
  approvedBy?: string
  expectedImpact: string
  kpiBefore?: string
  kpiAfter?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface AppState {
  sites: Site[]
  visits: Visit[]
  actions: OptimizationAction[]
}
