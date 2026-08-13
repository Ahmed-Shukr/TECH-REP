import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { can } from '../data/auth'
import { slotFillCount } from '../data/templates'
import { useStore } from '../data/useStore'
import { exportVisitDossierPdf } from '../export/dossierPdf'

export function DossierPage() {
  const { visitId } = useParams()
  const { state } = useStore()
  const visit = state.visits.find((v) => v.id === visitId)
  const site = state.sites.find((s) => s.id === visit?.siteId)
  const actions = state.actions.filter(
    (a) => a.visitId === visitId || a.siteId === visit?.siteId,
  )
  const [exportMessage, setExportMessage] = useState<string | null>(null)

  if (!visit || !site) {
    return (
      <div className="page">
        <p className="empty">Dossier not found.</p>
        <Link to="/portal">Back to portal</Link>
      </div>
    )
  }

  const fill = slotFillCount(visit.slots, new Set(visit.captures.map((c) => c.slotId)))
  const bySlot = new Map(visit.captures.map((c) => [c.slotId, c]))
  const canExport = can(state.currentUser.role, 'dossier.export')

  const onExport = () => {
    try {
      exportVisitDossierPdf({
        site,
        visit,
        actions,
        exportedBy: state.currentUser.name,
      })
      setExportMessage('Print dialog opened — choose Save as PDF')
    } catch (err) {
      setExportMessage(err instanceof Error ? err.message : 'Export failed')
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Portal dossier</p>
          <h1>
            {site.code} <span className="h-sub">{site.name}</span>
          </h1>
          <p className="page__lede">
            System-of-record view of the field visit after sync — checklist, media slots, heights,
            and linked optimization actions.
          </p>
          <div className="chip-row">
            <StatusBadge kind="visit" value={visit.status} />
            <span className="chip">sync: {visit.syncStatus}</span>
            {visit.syncedAt ? (
              <span className="chip">synced {new Date(visit.syncedAt).toLocaleString()}</span>
            ) : null}
            {state.syncCursor ? (
              <span className="chip">API cursor {new Date(state.syncCursor).toLocaleString()}</span>
            ) : null}
          </div>
        </div>
        <div className="btn-row">
          {canExport ? (
            <button type="button" className="btn btn--primary" onClick={onExport}>
              Export PDF
            </button>
          ) : null}
          <Link className="btn btn--secondary" to={`/sites/${site.id}/verify/${visit.id}`}>
            Open field visit
          </Link>
        </div>
      </header>

      {exportMessage ? <p className="banner">{exportMessage}</p> : null}

      {visit.syncStatus !== 'synced' ? (
        <p className="banner banner--warn">
          This visit is not fully synced yet. Use Sync to portal from the field bar so RF/ops see
          the latest media and checklist.
        </p>
      ) : null}

      <section className="metric-row" aria-label="Dossier summary">
        <div className="metric">
          <span className="metric__value">
            {visit.checklist.filter((i) => i.status === 'pass').length}
          </span>
          <span className="metric__label">Checklist passes</span>
        </div>
        <div className="metric">
          <span className="metric__value">
            {fill.filled}/{fill.required}
          </span>
          <span className="metric__label">Mandatory slots</span>
        </div>
        <div className="metric">
          <span className="metric__value">{visit.measurements.towerHeightM ?? '—'}m</span>
          <span className="metric__label">Tower height</span>
        </div>
        <div className="metric">
          <span className="metric__value">{visit.measurements.antennaHeightM ?? '—'}m</span>
          <span className="metric__label">Antenna height</span>
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel__head">
            <h2>Checklist results</h2>
          </div>
          <ul className="list">
            {visit.checklist.map((item) => (
              <li key={item.id} className="list__row">
                <div>
                  <p className="list__title">{item.label}</p>
                  <p className="muted">
                    {item.category.replace('_', ' ')}
                    {item.measuredValue ? ` · ${item.measuredValue}` : ''}
                  </p>
                </div>
                <span className={`badge badge--visit-${item.status === 'fail' ? 'blocked' : item.status === 'pass' ? 'completed' : 'in_progress'}`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Optimization actions</h2>
          </div>
          {actions.length === 0 ? (
            <p className="empty">No linked actions.</p>
          ) : (
            <ul className="list">
              {actions.map((action) => (
                <li key={action.id} className="list__row">
                  <div>
                    <Link to={`/optimizations/${action.id}`} className="list__title">
                      {action.title}
                    </Link>
                    <p className="muted">
                      {action.type}
                      {action.valueBefore
                        ? ` · ${action.valueBefore} → ${action.valueAfter}`
                        : ''}
                    </p>
                  </div>
                  <StatusBadge kind="action" value={action.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <div className="panel__head">
          <h2>Media gallery by slot</h2>
        </div>
        <div className="capture__grid">
          {visit.slots.map((slot) => {
            const cap = bySlot.get(slot.id)
            return (
              <div
                key={slot.id}
                className={`capture__card ${cap ? 'is-filled' : ''}`}
              >
                <div className="capture__meta">
                  <strong>{slot.label}</strong>
                  <span className="muted">
                    {cap ? 'Captured' : 'Missing'}
                    {cap?.sha256 ? ` · ${cap.sha256.slice(0, 8)}…` : ''}
                  </span>
                </div>
                {cap?.dataUrl ? (
                  <img src={cap.dataUrl} alt={slot.label} className="capture__thumb" />
                ) : (
                  <div className="capture__placeholder">
                    {cap ? 'Synced metadata (no image bytes in seed)' : 'Empty'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
