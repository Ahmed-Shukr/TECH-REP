import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__atmosphere" aria-hidden>
        <div className="landing__wash" />
        <div className="landing__waves" />
        <div className="landing__grid" />
      </div>

      <header className="landing__nav">
        <div className="brand-mark brand-mark--hero">
          <span className="brand-mark__signal" aria-hidden />
          <span className="brand-mark__text">TECH-REP</span>
        </div>
        <div className="landing__nav-actions">
          <Link to="/dashboard" className="btn btn--ghost">
            Open console
          </Link>
          <Link to="/sites" className="btn btn--primary">
            Start verification
          </Link>
        </div>
      </header>

      <section className="hero">
        <p className="hero__brand">TECH-REP</p>
        <h1 className="hero__title">Field truth for every radio site.</h1>
        <p className="hero__lede">
          Verify as-built against design, capture evidence once, and close optimization
          actions with a measurable post-check.
        </p>
        <div className="hero__cta">
          <Link to="/sites" className="btn btn--primary btn--lg">
            Enter site workflow
          </Link>
          <Link to="/optimizations" className="btn btn--secondary btn--lg">
            View optimization loop
          </Link>
        </div>
      </section>

      <section className="landing__strip" aria-label="Product focus">
        <div>
          <h2>Site verification</h2>
          <p>Checklist, GPS, photos, and planned-vs-actual RF parameters in one visit.</p>
        </div>
        <div>
          <h2>Optimization actions</h2>
          <p>Catalog-driven tilt, power, neighbor, and PCI changes with approval flow.</p>
        </div>
        <div>
          <h2>Ops visibility</h2>
          <p>Dashboard for open visits, blocked sites, and action throughput by region.</p>
        </div>
      </section>
    </div>
  )
}
