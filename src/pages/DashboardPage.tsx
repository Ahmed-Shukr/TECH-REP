import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { checklistProgress } from '../data/helpers'
import { useStore } from '../data/useStore'

export function DashboardPage() {
  const { state } = useStore()
  const openVisits = state.visits.filter((v) => v.status === 'in_progress')
  const blocked = state.sites.filter((s) => s.status === 'blocked')
  const activeActions = state.actions.filter((a) =>
    ['proposed', 'approved', 'in_progress'].includes(a.status),
  )
  const verifiedActions = state.actions.filter((a) =>
    ['verified', 'closed'].includes(a.status),
  )
  const completedVisits = state.visits.filter((v) => v.status === 'completed')
  const ftr =
    state.visits.filter((v) => v.status === 'completed' || v.status === 'blocked').length > 0
      ? Math.round(
          (completedVisits.length /
            state.visits.filter((v) => v.status === 'completed' || v.status === 'blocked')
              .length) *
            100,
        )
      : 0

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Network field console</h1>
          <p className="page__lede">
            Live demo data for verification progress and optimization throughput.
          </p>
        </div>
        <Link to="/sites" className="btn btn--primary">
          Open sites
        </Link>
      </header>

      <section className="metric-row" aria-label="Key metrics">
        <div className="metric">
          <span className="metric__value">{openVisits.length}</span>
          <span className="metric__label">Open visits</span>
        </div>
        <div className="metric">
          <span className="metric__value">{blocked.length}</span>
          <span className="metric__label">Blocked sites</span>
        </div>
        <div className="metric">
          <span className="metric__value">{activeActions.length}</span>
          <span className="metric__label">Active actions</span>
        </div>
        <div className="metric">
          <span className="metric__value">{ftr}%</span>
          <span className="metric__label">First-time-right</span>
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel__head">
            <h2>Open verifications</h2>
            <Link to="/sites">All sites</Link>
          </div>
          {openVisits.length === 0 ? (
            <p className="empty">No visits in progress. Start one from a site page.</p>
          ) : (
            <ul className="list">
              {openVisits.map((visit) => {
                const site = state.sites.find((s) => s.id === visit.siteId)
                const progress = checklistProgress(visit.checklist)
                return (
                  <li key={visit.id} className="list__row">
                    <div>
                      <Link to={`/sites/${visit.siteId}/verify/${visit.id}`} className="list__title">
                        {site?.code} · {site?.name}
                      </Link>
                      <p className="muted">{site?.region}</p>
                      <ProgressBar value={progress.pct} label="Checklist" />
                    </div>
                    <StatusBadge kind="visit" value={visit.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Optimization pipeline</h2>
            <Link to="/optimizations">All actions</Link>
          </div>
          <ul className="list">
            {state.actions.slice(0, 5).map((action) => {
              const site = state.sites.find((s) => s.id === action.siteId)
              return (
                <li key={action.id} className="list__row">
                  <div>
                    <Link to={`/optimizations/${action.id}`} className="list__title">
                      {action.title}
                    </Link>
                    <p className="muted">
                      {site?.code} · {action.type} · {action.priority}
                    </p>
                  </div>
                  <StatusBadge kind="action" value={action.status} />
                </li>
              )
            })}
          </ul>
          <p className="muted tight">
            Verified / closed: {verifiedActions.length} of {state.actions.length}
          </p>
        </section>
      </div>
    </div>
  )
}
