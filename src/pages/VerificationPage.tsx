import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CaptureSlotGrid } from '../components/CaptureSlotGrid'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { can } from '../data/auth'
import { checklistProgress } from '../data/helpers'
import { slotFillCount } from '../data/templates'
import { useStore } from '../data/useStore'
import type { ChecklistCategory, ItemStatus } from '../data/types'

const categories: ChecklistCategory[] = [
  'safety',
  'civil',
  'rf',
  'power',
  'transmission',
  'data_collection',
]

type Tab = 'checklist' | 'collection' | 'actions'

export function VerificationPage() {
  const { siteId, visitId } = useParams()
  const {
    state,
    updateChecklistItem,
    updateSectorActuals,
    updateMeasurements,
    upsertCapture,
    completeVisit,
    logFieldTiltAction,
    queueSync,
    flushSyncQueue,
  } = useStore()

  const site = state.sites.find((s) => s.id === siteId)
  const visit = state.visits.find((v) => v.id === visitId)
  const [tab, setTab] = useState<Tab>('checklist')
  const [message, setMessage] = useState<string | null>(null)
  const [tiltForm, setTiltForm] = useState({
    sectorId: site?.sectors[0]?.id ?? '',
    type: 'TILT_E' as 'TILT_E' | 'TILT_M',
    valueBefore: '',
    valueAfter: '',
    note: '',
  })

  const progress = useMemo(
    () => (visit ? checklistProgress(visit.checklist) : { done: 0, total: 0, pct: 0 }),
    [visit],
  )

  const fill = useMemo(() => {
    if (!visit) return { required: 0, filled: 0, pct: 0, complete: false }
    return slotFillCount(visit.slots, new Set(visit.captures.map((c) => c.slotId)))
  }, [visit])

  if (!site || !visit) {
    return (
      <div className="page">
        <p className="empty">Visit not found.</p>
        <Link to="/sites">Back to sites</Link>
      </div>
    )
  }

  const canCapture = can(state.currentUser.role, 'field.capture')
  const locked =
    visit.status === 'completed' || visit.status === 'blocked' || !canCapture
  const sectorId = tiltForm.sectorId || site.sectors[0]?.id || ''

  const onComplete = () => {
    const result = completeVisit(visit.id)
    setMessage(result.message)
  }

  const onSync = async () => {
    queueSync(visit.id)
    const result = await flushSyncQueue()
    setMessage(result.message)
  }

  return (
    <div className="page page--field">
      <header className="page__header">
        <div>
          <p className="eyebrow">
            <Link to={`/sites/${site.id}`}>{site.code}</Link> · Field verification
          </p>
          <h1>Site visit</h1>
          <p className="page__lede">
            Checklist + structured photos + tilt actions. Works offline; sync when back in coverage.
          </p>
          <div className="chip-row">
            <StatusBadge kind="visit" value={visit.status} />
            <span className="chip">sync: {visit.syncStatus}</span>
            <span className="chip">{site.name}</span>
          </div>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn--secondary" onClick={() => void onSync()}>
            Sync visit
          </button>
          {!locked ? (
            <button type="button" className="btn btn--primary" onClick={onComplete}>
              Complete visit
            </button>
          ) : (
            <Link className="btn btn--primary" to={`/portal/visits/${visit.id}`}>
              Open portal dossier
            </Link>
          )}
        </div>
      </header>

      {message ? <p className="banner">{message}</p> : null}

      <div className="dual-progress">
        <ProgressBar value={progress.pct} label={`Checklist ${progress.done}/${progress.total}`} />
        <ProgressBar value={fill.pct} label={`Mandatory photos ${fill.filled}/${fill.required}`} />
      </div>

      <div className="tabs" role="tablist">
        {(
          [
            ['checklist', 'Checklist'],
            ['collection', 'Data collection'],
            ['actions', 'Opt. actions'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            className={`tabs__btn ${tab === id ? 'is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'checklist' ? (
        <section className="panel">
          {categories.map((category) => {
            const items = visit.checklist.filter((i) => i.category === category)
            if (!items.length) return null
            return (
              <div key={category} className="checklist-group">
                <h3>{category.replace('_', ' ')}</h3>
                <ul className="checklist">
                  {items.map((item) => (
                    <li key={item.id} className="checklist__item">
                      <div className="checklist__main">
                        <p className="checklist__label">
                          {item.label}
                          {item.required ? <span className="req">Required</span> : null}
                        </p>
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
      ) : null}

      {tab === 'collection' ? (
        <div className="stack">
          <section className="panel">
            <div className="panel__head">
              <h2>Heights & sector actuals</h2>
            </div>
            <div className="form-grid">
              <label className="field">
                <span>Tower height (m)</span>
                <input
                  type="number"
                  disabled={locked}
                  value={visit.measurements.towerHeightM ?? ''}
                  onChange={(e) =>
                    updateMeasurements(visit.id, {
                      towerHeightM: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Antenna height (m)</span>
                <input
                  type="number"
                  disabled={locked}
                  value={visit.measurements.antennaHeightM ?? ''}
                  onChange={(e) =>
                    updateMeasurements(visit.id, {
                      antennaHeightM: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <ul className="sector-edit">
              {site.sectors.map((sec) => (
                <li key={sec.id}>
                  <strong>
                    Sector {sec.name} · plan az {sec.azimuthPlanned}° · mech{' '}
                    {sec.mechTiltPlanned ?? sec.tiltPlanned}° · elec {sec.elecTiltPlanned ?? '—'}°
                  </strong>
                  <div className="inline-fields inline-fields--4">
                    {(
                      [
                        ['azimuthActual', 'Azimuth', sec.azimuthActual],
                        ['mechTiltActual', 'Mech tilt', sec.mechTiltActual],
                        ['elecTiltActual', 'Elec tilt', sec.elecTiltActual],
                      ] as const
                    ).map(([key, label, value]) => (
                      <label key={key}>
                        {label}
                        <input
                          type="number"
                          disabled={locked}
                          defaultValue={value ?? ''}
                          onBlur={(e) => {
                            const n = Number(e.target.value)
                            if (!Number.isFinite(n)) return
                            updateSectorActuals(site.id, sec.id, { [key]: n })
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Photo data collection</h2>
            </div>
            <p className="muted" style={{ marginBottom: '0.85rem' }}>
              Capture site overview, tower/antenna height photos, per-sector tilt photos, and
              panoramas at 0° / 60° / 120° / 180° / 240° / 300°. Images are compressed and stored
              on-device until sync.
            </p>
            <CaptureSlotGrid
              slots={visit.slots}
              captures={visit.captures}
              locked={locked}
              userId={state.currentUser.id}
              onCapture={(asset) => upsertCapture(visit.id, asset)}
            />
          </section>
        </div>
      ) : null}

      {tab === 'actions' ? (
        <section className="panel">
          <div className="panel__head">
            <h2>Log optimization action</h2>
          </div>
          {!locked ? (
            <div className="form-grid">
              <label className="field">
                <span>Sector</span>
                <select
                  value={sectorId}
                  onChange={(e) => setTiltForm((f) => ({ ...f, sectorId: e.target.value }))}
                >
                  {site.sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      Sector {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Action type</span>
                <select
                  value={tiltForm.type}
                  onChange={(e) =>
                    setTiltForm((f) => ({
                      ...f,
                      type: e.target.value as 'TILT_E' | 'TILT_M',
                    }))
                  }
                >
                  <option value="TILT_E">Electrical tilt (TILT_E)</option>
                  <option value="TILT_M">Mechanical tilt (TILT_M)</option>
                </select>
              </label>
              <label className="field">
                <span>Value before</span>
                <input
                  value={tiltForm.valueBefore}
                  onChange={(e) => setTiltForm((f) => ({ ...f, valueBefore: e.target.value }))}
                  placeholder="e.g. 4°"
                />
              </label>
              <label className="field">
                <span>Value after</span>
                <input
                  value={tiltForm.valueAfter}
                  onChange={(e) => setTiltForm((f) => ({ ...f, valueAfter: e.target.value }))}
                  placeholder="e.g. 6°"
                />
              </label>
              <label className="field field--full">
                <span>Note</span>
                <textarea
                  rows={2}
                  value={tiltForm.note}
                  onChange={(e) => setTiltForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Reason / observation"
                />
              </label>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (!tiltForm.valueBefore || !tiltForm.valueAfter) {
                    setMessage('Enter before and after values')
                    return
                  }
                  const id = logFieldTiltAction({
                    siteId: site.id,
                    sectorId,
                    visitId: visit.id,
                    type: tiltForm.type,
                    valueBefore: tiltForm.valueBefore,
                    valueAfter: tiltForm.valueAfter,
                    note: tiltForm.note,
                  })
                  setMessage(`Optimization action ${id} logged and queued for portal`)
                  setTiltForm((f) => ({ ...f, valueBefore: '', valueAfter: '', note: '' }))
                }}
              >
                Log tilt change
              </button>
            </div>
          ) : (
            <p className="muted">Visit locked — open Optimizations or portal to progress actions.</p>
          )}

          <ul className="list" style={{ marginTop: '1rem' }}>
            {state.actions
              .filter((a) => a.visitId === visit.id || a.siteId === site.id)
              .map((action) => (
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
        </section>
      ) : null}
    </div>
  )
}
