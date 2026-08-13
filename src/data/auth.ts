import type { ActionStatus, DemoRole, DemoUser } from './types'

export type Permission =
  | 'field.capture'
  | 'field.complete_visit'
  | 'action.propose'
  | 'action.approve'
  | 'action.reject'
  | 'action.verify'
  | 'action.close'
  | 'portal.view'
  | 'audit.view'
  | 'dossier.export'

const ROLE_PERMISSIONS: Record<DemoRole, Permission[]> = {
  field: [
    'field.capture',
    'field.complete_visit',
    'action.propose',
    'portal.view',
    'dossier.export',
  ],
  rf_engineer: [
    'field.capture',
    'action.propose',
    'action.approve',
    'action.reject',
    'action.verify',
    'portal.view',
    'audit.view',
    'dossier.export',
  ],
  opt_lead: [
    'action.propose',
    'action.approve',
    'action.reject',
    'action.verify',
    'action.close',
    'portal.view',
    'audit.view',
    'dossier.export',
  ],
  region_manager: [
    'action.approve',
    'action.reject',
    'action.close',
    'portal.view',
    'audit.view',
    'dossier.export',
  ],
  auditor: ['portal.view', 'audit.view', 'dossier.export'],
}

export const DEMO_USERS: DemoUser[] = [
  { id: 'user-field', name: 'Field Tech Rep', role: 'field' },
  { id: 'user-rf', name: 'Sari W. (RF)', role: 'rf_engineer' },
  { id: 'user-opt', name: 'Andre K. (Opt Lead)', role: 'opt_lead' },
  { id: 'user-region', name: 'Region Manager', role: 'region_manager' },
  { id: 'user-auditor', name: 'Read-only Auditor', role: 'auditor' },
]

export const DEFAULT_DEMO_USER = DEMO_USERS[0]

export function can(role: DemoRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function canTransition(role: DemoRole, status: ActionStatus): boolean {
  switch (status) {
    case 'approved':
    case 'rejected':
      return can(role, 'action.approve') || can(role, 'action.reject')
    case 'in_progress':
      return can(role, 'action.propose') || can(role, 'action.approve')
    case 'verified':
      return can(role, 'action.verify')
    case 'closed':
      return can(role, 'action.close')
    case 'proposed':
      return can(role, 'action.propose')
    default:
      return false
  }
}

export function roleLabel(role: DemoRole): string {
  switch (role) {
    case 'field':
      return 'Field'
    case 'rf_engineer':
      return 'RF Engineer'
    case 'opt_lead':
      return 'Opt Lead'
    case 'region_manager':
      return 'Region Manager'
    case 'auditor':
      return 'Auditor'
  }
}
