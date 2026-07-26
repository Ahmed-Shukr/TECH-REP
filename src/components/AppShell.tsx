import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../data/useStore'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sites', label: 'Sites' },
  { to: '/optimizations', label: 'Optimizations' },
]

export function AppShell() {
  const { resetDemo } = useStore()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  if (isLanding) {
    return <Outlet />
  }

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand-mark">
          <span className="brand-mark__signal" aria-hidden />
          <span className="brand-mark__text">TECH-REP</span>
        </NavLink>
        <nav className="topnav" aria-label="Primary">
          {links.map((link) => (
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
        <button type="button" className="btn btn--ghost btn--sm" onClick={resetDemo}>
          Reset demo
        </button>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
