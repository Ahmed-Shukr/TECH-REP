import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useStore } from '../data/useStore'

export function PortalPage() {
  const { state } = useStore()
  const published = [...state.visits].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Web portal</p>
          <h1>Site dossiers</h1>
          <p className="page__lede">
            Visits and media recorded in the field app appear here after sync. Synced visits are the
            system of record for RF acceptance and audit.
          </p>
        </div>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Started</th>
              <th>Visit status</th>
              <th>Sync</th>
              <th>Captures</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {published.map((visit) => {
              const site = state.sites.find((s) => s.id === visit.siteId)
              return (
                <tr key={visit.id}>
                  <td>
                    <div className="list__title">{site?.code}</div>
                    <div className="muted">{site?.name}</div>
                  </td>
                  <td>{new Date(visit.startedAt).toLocaleString()}</td>
                  <td>
                    <StatusBadge kind="visit" value={visit.status} />
                  </td>
                  <td>
                    <span className="chip">{visit.syncStatus}</span>
                  </td>
                  <td>
                    {visit.captures.length}/{visit.slots.filter((s) => s.required).length} req
                  </td>
                  <td>
                    <Link to={`/portal/visits/${visit.id}`}>Open dossier</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
