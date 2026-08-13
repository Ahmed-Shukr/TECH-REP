import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useStore } from '../data/useStore'
import type { ActionStatus, ActionType } from '../data/types'

const actionTypes: ActionType[] = ['TILT_E', 'TILT_M', 'PWR', 'NBR', 'PCI', 'CAP']

export function OptimizationsPage() {
  const { state, proposeAction } = useStore()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'all' | ActionStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    siteId: state.sites[0]?.id ?? '',
    sectorId: '',
    type: 'TILT_E' as ActionType,
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    expectedImpact: '',
    proposedBy: 'RF Engineer',
    valueBefore: '',
    valueAfter: '',
  })

  const filtered = useMemo(
    () =>
      state.actions.filter((a) => (status === 'all' ? true : a.status === status)),
    [state.actions, status],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.siteId) return
    const id = proposeAction({
      siteId: form.siteId,
      sectorId: form.sectorId || undefined,
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      proposedBy: form.proposedBy.trim() || 'RF Engineer',
      expectedImpact: form.expectedImpact.trim() || 'TBD post-check',
      valueBefore: form.valueBefore.trim() || undefined,
      valueAfter: form.valueAfter.trim() || undefined,
    })
    setShowForm(false)
    navigate(`/optimizations/${id}`)
  }

  const selectedSite = state.sites.find((s) => s.id === form.siteId)

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Closed-loop RF</p>
          <h1>Optimization actions</h1>
          <p className="page__lede">
            Propose catalog actions, move them through approval, and record KPI outcomes.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Close form' : 'Propose action'}
        </button>
      </header>

      {showForm ? (
        <form className="panel form" onSubmit={onSubmit}>
          <div className="panel__head">
            <h2>New optimization action</h2>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Site</span>
              <select
                value={form.siteId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, siteId: e.target.value, sectorId: '' }))
                }
              >
                {state.sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Sector (optional)</span>
              <select
                value={form.sectorId}
                onChange={(e) => setForm((f) => ({ ...f, sectorId: e.target.value }))}
              >
                <option value="">Site-wide</option>
                {selectedSite?.sectors.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Sector {sec.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Type</span>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as ActionType }))
                }
              >
                {actionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="field field--full">
              <span>Title</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Short action title"
              />
            </label>
            <label className="field field--full">
              <span>Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Trigger, intended change, risk notes"
              />
            </label>
            <label className="field">
              <span>Value before</span>
              <input
                value={form.valueBefore}
                onChange={(e) => setForm((f) => ({ ...f, valueBefore: e.target.value }))}
                placeholder="e.g. elec tilt 4°"
              />
            </label>
            <label className="field">
              <span>Value after</span>
              <input
                value={form.valueAfter}
                onChange={(e) => setForm((f) => ({ ...f, valueAfter: e.target.value }))}
                placeholder="e.g. elec tilt 6°"
              />
            </label>
            <label className="field">
              <span>Expected impact</span>
              <input
                value={form.expectedImpact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expectedImpact: e.target.value }))
                }
                placeholder="e.g. HO success +3pp"
              />
            </label>
            <label className="field">
              <span>Proposed by</span>
              <input
                value={form.proposedBy}
                onChange={(e) => setForm((f) => ({ ...f, proposedBy: e.target.value }))}
              />
            </label>
          </div>
          <button type="submit" className="btn btn--primary">
            Create proposed action
          </button>
        </form>
      ) : null}

      <div className="filters">
        <label className="field">
          <span>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | ActionStatus)}
          >
            <option value="all">All</option>
            <option value="proposed">Proposed</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In progress</option>
            <option value="verified">Verified</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      <ul className="list list--actions">
        {filtered.map((action) => {
          const site = state.sites.find((s) => s.id === action.siteId)
          return (
            <li key={action.id} className="list__row">
              <div>
                <Link to={`/optimizations/${action.id}`} className="list__title">
                  {action.title}
                </Link>
                <p className="muted">
                  {site?.code} · {action.type} · {action.priority} · {action.proposedBy}
                </p>
              </div>
              <StatusBadge kind="action" value={action.status} />
            </li>
          )
        })}
      </ul>
      {filtered.length === 0 ? <p className="empty">No actions in this filter.</p> : null}
    </div>
  )
}
