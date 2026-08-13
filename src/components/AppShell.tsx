import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { can } from '../data/auth'
import { useStore } from '../data/useStore'
import { RoleSwitcher } from './RoleSwitcher'
import { SyncBar } from './SyncBar'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sites', label: 'Sites' },
  { to: '/optimizations', label: 'Optimizations' },
  { to: '/portal', label: 'Portal' },
  { to: '/audit', label: 'Audit', permission: 'audit.view' as const },
]

export function AppShell() {
  const { resetDemo, ready, state } = useStore()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  if (isLanding) {
    return <Outlet />
  }

  if (!ready) {
    return (
      <div className="shell shell--loading">
        <p>Loading offline store…</p>
      </div>
    )
  }

  const visibleLinks = links.filter(
    (link) => !('permission' in link) || can(state.currentUser.role, link.permission!),
  )

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand-mark">
          <span className="brand-mark__signal" aria-hidden />
          <span className="brand-mark__text">TECH-REP</span>
        </NavLink>
        <nav className="topnav" aria-label="Primary">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'topnav__link is-active' : 'topnav__link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <RoleSwitcher />
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => void resetDemo()}
        >
          Reset demo
        </button>
      </header>
      <SyncBar />
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
