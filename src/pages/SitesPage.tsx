import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useStore } from '../data/useStore'
import type { SiteStatus } from '../data/types'

export function SitesPage() {
  const { state } = useStore()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [status, setStatus] = useState<'all' | SiteStatus>('all')

  const regions = useMemo(
    () => ['all', ...Array.from(new Set(state.sites.map((s) => s.region)))],
    [state.sites],
  )

  const filtered = state.sites.filter((site) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      site.code.toLowerCase().includes(q) ||
      site.name.toLowerCase().includes(q) ||
      site.address.toLowerCase().includes(q)
    const matchesRegion = region === 'all' || site.region === region
    const matchesStatus = status === 'all' || site.status === status
    return matchesQuery && matchesRegion && matchesStatus
  })

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Sites</h1>
          <p className="page__lede">
            Site master with verification status. Open a site to start or continue a visit.
          </p>
        </div>
      </header>

      <div className="filters">
        <label className="field">
          <span>Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Code, name, address"
          />
        </label>
        <label className="field">
          <span>Region</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All regions' : r}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | SiteStatus)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="build">Build</option>
            <option value="optimization">Optimization</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Region</th>
              <th>Technology</th>
              <th>Sectors</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((site) => (
              <tr key={site.id}>
                <td>
                  <Link to={`/sites/${site.id}`} className="list__title">
                    {site.code}
                  </Link>
                  <div className="muted">{site.name}</div>
                </td>
                <td>{site.region}</td>
                <td>{site.technology.join(' · ')}</td>
                <td>{site.sectors.length}</td>
                <td>
                  <StatusBadge kind="site" value={site.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="empty">No sites match these filters.</p> : null}
      </div>
    </div>
  )
}
