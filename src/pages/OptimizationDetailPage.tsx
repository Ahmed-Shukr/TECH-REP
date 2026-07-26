import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useStore } from '../data/useStore'
import type { ActionStatus } from '../data/types'

const transitions: Record<ActionStatus, ActionStatus[]> = {
  proposed: ['approved', 'rejected'],
  approved: ['in_progress', 'rejected'],
  in_progress: ['verified', 'rejected'],
  verified: ['closed'],
  closed: [],
  rejected: [],
}

export function OptimizationDetailPage() {
  const { actionId } = useParams()
  const { state, transitionAction } = useStore()
  const action = state.actions.find((a) => a.id === actionId)
  const site = state.sites.find((s) => s.id === action?.siteId)
  const sector = site?.sectors.find((s) => s.id === action?.sectorId)
  const [kpiAfter, setKpiAfter] = useState(action?.kpiAfter ?? '')
  const [message, setMessage] = useState<string | null>(null)

  if (!action || !site) {
    return (
      <div className="page">
        <p className="empty">Action not found.</p>
        <Link to="/optimizations">Back</Link>
      </div>
    )
  }

  const next = transitions[action.status]

  const move = (status: ActionStatus) => {
    transitionAction(action.id, status, {
      kpiAfter: kpiAfter || action.kpiAfter,
      approvedBy: status === 'approved' ? 'Opt Lead' : action.approvedBy,
    })
    setMessage(`Moved to ${status.replace('_', ' ')}`)
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">
            <Link to="/optimizations">Optimizations</Link> · {action.type}
          </p>
          <h1>{action.title}</h1>
          <p className="page__lede">{action.description}</p>
          <div className="chip-row">
            <StatusBadge kind="action" value={action.status} />
            <span className="chip">{action.priority} priority</span>
            <Link className="chip" to={`/sites/${site.id}`}>
              {site.code}
            </Link>
            {sector ? <span className="chip">Sector {sector.name}</span> : null}
          </div>
        </div>
      </header>

      {message ? <p className="banner">{message}</p> : null}

      <div className="split">
        <section className="panel">
          <div className="panel__head">
            <h2>Action detail</h2>
          </div>
          <dl className="meta">
            <div>
              <dt>Proposed by</dt>
              <dd>{action.proposedBy}</dd>
            </div>
            <div>
              <dt>Approved by</dt>
              <dd>{action.approvedBy ?? '—'}</dd>
            </div>
            <div>
              <dt>Expected impact</dt>
              <dd>{action.expectedImpact}</dd>
            </div>
            <div>
              <dt>KPI before</dt>
              <dd>{action.kpiBefore ?? '—'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(action.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(action.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Workflow</h2>
          </div>
          <label className="field">
            <span>KPI after / post-check notes</span>
            <textarea
              rows={3}
              value={kpiAfter}
              onChange={(e) => setKpiAfter(e.target.value)}
              placeholder="Record measured outcome before verify/close"
            />
          </label>
          <div className="btn-row">
            {next.map((status) => (
              <button
                key={status}
                type="button"
                className={
                  status === 'rejected' ? 'btn btn--ghost' : 'btn btn--primary'
                }
                onClick={() => move(status)}
              >
                Mark {status.replace('_', ' ')}
              </button>
            ))}
            {next.length === 0 ? (
              <p className="muted">Terminal state — no further transitions.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
