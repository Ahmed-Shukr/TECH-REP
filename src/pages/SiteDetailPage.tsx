import { Link, useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useStore } from '../data/useStore'

function delta(actual: number | undefined, planned: number) {
  if (actual === undefined) return null
  return Math.abs(actual - planned)
}

export function SiteDetailPage() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { state, startVisit } = useStore()
  const site = state.sites.find((s) => s.id === siteId)
  const visits = state.visits.filter((v) => v.siteId === siteId)
  const actions = state.actions.filter((a) => a.siteId === siteId)
  const openVisit = visits.find((v) => v.status === 'in_progress')

  if (!site) {
    return (
      <div className="page">
        <p className="empty">Site not found.</p>
        <Link to="/sites">Back to sites</Link>
      </div>
    )
  }

  const onStart = () => {
    if (openVisit) {
      navigate(`/sites/${site.id}/verify/${openVisit.id}`)
      return
    }
    const id = startVisit(site.id)
    navigate(`/sites/${site.id}/verify/${id}`)
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">{site.region}</p>
          <h1>
            {site.code} <span className="h-sub">{site.name}</span>
          </h1>
          <p className="page__lede">{site.address}</p>
          <div className="chip-row">
            <StatusBadge kind="site" value={site.status} />
            <span className="chip">{site.technology.join(' · ')}</span>
            <span className="chip">
              {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
            </span>
          </div>
        </div>
        <button type="button" className="btn btn--primary" onClick={onStart}>
          {openVisit ? 'Continue verification' : 'Start verification'}
        </button>
      </header>

      <section className="panel">
        <div className="panel__head">
          <h2>Sectors — planned vs actual</h2>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Tech</th>
                <th>Azimuth</th>
                <th>Tilt</th>
                <th>Height</th>
                <th>PCI</th>
                <th>Delta</th>
              </tr>
            </thead>
            <tbody>
              {site.sectors.map((sec) => {
                const az = delta(sec.azimuthActual, sec.azimuthPlanned)
                const ti = delta(sec.tiltActual, sec.tiltPlanned)
                const azBad = az !== null && az > 5
                const tiBad = ti !== null && ti > 1
                return (
                  <tr key={sec.id}>
                    <td>{sec.name}</td>
                    <td>{sec.technology}</td>
                    <td>
                      {sec.azimuthPlanned}°
                      {sec.azimuthActual !== undefined ? (
                        <span className={azBad ? 'warn' : 'ok'}> → {sec.azimuthActual}°</span>
                      ) : (
                        <span className="muted"> → —</span>
                      )}
                    </td>
                    <td>
                      {sec.tiltPlanned}°
                      {sec.tiltActual !== undefined ? (
                        <span className={tiBad ? 'warn' : 'ok'}> → {sec.tiltActual}°</span>
                      ) : (
                        <span className="muted"> → —</span>
                      )}
                    </td>
                    <td>{sec.heightM} m</td>
                    <td>{sec.pci ?? '—'}</td>
                    <td>
                      {azBad || tiBad ? (
                        <span className="warn">Exception</span>
                      ) : sec.azimuthActual === undefined ? (
                        <span className="muted">Pending</span>
                      ) : (
                        <span className="ok">OK</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel__head">
            <h2>Visits</h2>
          </div>
          {visits.length === 0 ? (
            <p className="empty">No visits yet.</p>
          ) : (
            <ul className="list">
              {visits.map((visit) => (
                <li key={visit.id} className="list__row">
                  <div>
                    <Link
                      to={`/sites/${site.id}/verify/${visit.id}`}
                      className="list__title"
                    >
                      {new Date(visit.startedAt).toLocaleString()}
                    </Link>
                    <p className="muted">
                      {visit.syncStatus}
                      {visit.notes ? ` · ${visit.notes}` : ` · ${visit.captures.length} captures`}
                      {visit.syncStatus === 'synced' ? (
                        <>
                          {' · '}
                          <Link to={`/portal/visits/${visit.id}`}>portal dossier</Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <StatusBadge kind="visit" value={visit.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Linked actions</h2>
            <Link to="/optimizations">Propose</Link>
          </div>
          {actions.length === 0 ? (
            <p className="empty">No optimization actions for this site.</p>
          ) : (
            <ul className="list">
              {actions.map((action) => (
                <li key={action.id} className="list__row">
                  <div>
                    <Link to={`/optimizations/${action.id}`} className="list__title">
                      {action.title}
                    </Link>
                    <p className="muted">{action.type}</p>
                  </div>
                  <StatusBadge kind="action" value={action.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
