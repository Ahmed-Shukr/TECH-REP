import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { checklistProgress } from '../data/helpers'
import { useStore } from '../data/useStore'
import type { ChecklistCategory, ItemStatus } from '../data/types'

const categories: ChecklistCategory[] = ['civil', 'rf', 'power', 'transmission', 'safety']

export function VerificationPage() {
  const { siteId, visitId } = useParams()
  const {
    state,
    updateChecklistItem,
    updateSectorActuals,
    addEvidenceNote,
    captureGps,
    addPhotoEvidence,
    completeVisit,
  } = useStore()

  const site = state.sites.find((s) => s.id === siteId)
  const visit = state.visits.find((v) => v.id === visitId)
  const [message, setMessage] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [photoCaption, setPhotoCaption] = useState('Antenna / bracket photo')
  const [sectorDrafts, setSectorDrafts] = useState<
    Record<string, { azimuthActual: string; tiltActual: string }>
  >({})

  const progress = useMemo(
    () => (visit ? checklistProgress(visit.checklist) : { done: 0, total: 0, pct: 0 }),
    [visit],
  )

  if (!site || !visit) {
    return (
      <div className="page">
        <p className="empty">Visit not found.</p>
        <Link to="/sites">Back to sites</Link>
      </div>
    )
  }

  const locked = visit.status === 'completed' || visit.status === 'blocked'

  const onComplete = () => {
    const result = completeVisit(visit.id)
    setMessage(result.message)
  }

  const saveSector = (sectorId: string) => {
    const draft = sectorDrafts[sectorId]
    if (!draft) return
    const azimuthActual = Number(draft.azimuthActual)
    const tiltActual = Number(draft.tiltActual)
    updateSectorActuals(site.id, sectorId, {
      azimuthActual: Number.isFinite(azimuthActual) ? azimuthActual : undefined,
      tiltActual: Number.isFinite(tiltActual) ? tiltActual : undefined,
    })
    setMessage('Sector actuals saved — check deltas on site page')
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">
            <Link to={`/sites/${site.id}`}>{site.code}</Link> · Verification
          </p>
          <h1>Site visit checklist</h1>
          <p className="page__lede">
            Started {new Date(visit.startedAt).toLocaleString()}
            {visit.completedAt ? ` · Closed ${new Date(visit.completedAt).toLocaleString()}` : ''}
          </p>
          <div className="chip-row">
            <StatusBadge kind="visit" value={visit.status} />
            <span className="chip">{site.name}</span>
          </div>
        </div>
        {!locked ? (
          <button type="button" className="btn btn--primary" onClick={onComplete}>
            Complete visit
          </button>
        ) : null}
      </header>

      {message ? <p className="banner">{message}</p> : null}

      <ProgressBar value={progress.pct} label={`${progress.done}/${progress.total} items`} />

      <div className="split split--verify">
        <section className="panel">
          <div className="panel__head">
            <h2>Checklist</h2>
          </div>
          {categories.map((category) => {
            const items = visit.checklist.filter((i) => i.category === category)
            if (!items.length) return null
            return (
              <div key={category} className="checklist-group">
                <h3>{category}</h3>
                <ul className="checklist">
                  {items.map((item) => (
                    <li key={item.id} className="checklist__item">
                      <div className="checklist__main">
                        <p className="checklist__label">
                          {item.label}
                          {item.required ? <span className="req">Required</span> : null}
                        </p>
                        {item.plannedValue ? (
                          <p className="muted">Planned: {item.plannedValue}</p>
                        ) : null}
                        <input
                          className="input-inline"
                          disabled={locked}
                          placeholder="Measured / notes"
                          value={item.measuredValue ?? ''}
                          onChange={(e) =>
                            updateChecklistItem(visit.id, item.id, {
                              measuredValue: e.target.value,
                            })
                          }
                        />
                      </div>
                      <select
                        disabled={locked}
                        value={item.status}
                        onChange={(e) =>
                          updateChecklistItem(visit.id, item.id, {
                            status: e.target.value as ItemStatus,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="na">N/A</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>

        <aside className="stack">
          <section className="panel">
            <div className="panel__head">
              <h2>As-built sectors</h2>
            </div>
            <ul className="sector-edit">
              {site.sectors.map((sec) => {
                const draft = sectorDrafts[sec.id] ?? {
                  azimuthActual: String(sec.azimuthActual ?? ''),
                  tiltActual: String(sec.tiltActual ?? ''),
                }
                return (
                  <li key={sec.id}>
                    <strong>
                      Sector {sec.name} · plan {sec.azimuthPlanned}° / {sec.tiltPlanned}°
                    </strong>
                    <div className="inline-fields">
                      <label>
                        Azimuth
                        <input
                          disabled={locked}
                          value={draft.azimuthActual}
                          onChange={(e) =>
                            setSectorDrafts((prev) => ({
                              ...prev,
                              [sec.id]: { ...draft, azimuthActual: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        Tilt
                        <input
                          disabled={locked}
                          value={draft.tiltActual}
                          onChange={(e) =>
                            setSectorDrafts((prev) => ({
                              ...prev,
                              [sec.id]: { ...draft, tiltActual: e.target.value },
                            }))
                          }
                        />
                      </label>
                      {!locked ? (
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          onClick={() => saveSector(sec.id)}
                        >
                          Save
                        </button>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Evidence</h2>
            </div>
            {!locked ? (
              <div className="evidence-actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => captureGps(visit.id)}
                >
                  Capture GPS
                </button>
                <div className="inline-fields">
                  <input
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Photo caption"
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => {
                      addPhotoEvidence(visit.id, photoCaption || 'Photo evidence')
                      setMessage('Photo evidence stub added')
                    }}
                  >
                    Add photo
                  </button>
                </div>
                <div className="inline-fields">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Field note"
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => {
                      if (!note.trim()) return
                      addEvidenceNote(visit.id, note.trim())
                      setNote('')
                    }}
                  >
                    Add note
                  </button>
                </div>
              </div>
            ) : null}
            <ul className="evidence-list">
              {visit.evidence.map((ev) => (
                <li key={ev.id}>
                  <span className="chip">{ev.type}</span>
                  <div>
                    <strong>{ev.caption ?? ev.type}</strong>
                    <p className="muted">
                      {new Date(ev.capturedAt).toLocaleString()}
                      {ev.lat !== undefined
                        ? ` · ${ev.lat.toFixed(5)}, ${ev.lng?.toFixed(5)}`
                        : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
