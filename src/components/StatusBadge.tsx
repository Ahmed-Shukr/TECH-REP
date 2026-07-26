import type { ActionStatus, SiteStatus, VisitStatus } from '../data/types'

const siteMap: Record<SiteStatus, string> = {
  active: 'Active',
  build: 'Build',
  optimization: 'Optimization',
  blocked: 'Blocked',
}

const visitMap: Record<VisitStatus, string> = {
  draft: 'Draft',
  in_progress: 'In progress',
  completed: 'Completed',
  blocked: 'Blocked',
}

const actionMap: Record<ActionStatus, string> = {
  proposed: 'Proposed',
  approved: 'Approved',
  in_progress: 'In progress',
  verified: 'Verified',
  closed: 'Closed',
  rejected: 'Rejected',
}

export function StatusBadge({
  kind,
  value,
}: {
  kind: 'site' | 'visit' | 'action'
  value: string
}) {
  const label =
    kind === 'site'
      ? siteMap[value as SiteStatus] ?? value
      : kind === 'visit'
        ? visitMap[value as VisitStatus] ?? value
        : actionMap[value as ActionStatus] ?? value

  return <span className={`badge badge--${kind}-${value}`}>{label}</span>
}
