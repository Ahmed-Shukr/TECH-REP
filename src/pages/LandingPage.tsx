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
          <Link to="/portal" className="btn btn--ghost">
            Web portal
          </Link>
          <Link to="/sites" className="btn btn--primary">
            Open field app
          </Link>
        </div>
      </header>

      <section className="hero">
        <p className="hero__brand">TECH-REP</p>
        <h1 className="hero__title">Verify on site. Sync to the portal.</h1>
        <p className="hero__lede">
          Offline-ready checklists, structured site photos (heights, tilts, panoramas), and
          optimization actions — recorded in the field and published to the web dossier.
        </p>
        <div className="hero__cta">
          <Link to="/sites" className="btn btn--primary btn--lg">
            Start site verification
          </Link>
          <Link to="/portal" className="btn btn--secondary btn--lg">
            View synced dossiers
          </Link>
        </div>
      </section>

      <section className="landing__strip" aria-label="Product focus">
        <div>
          <h2>Field verification</h2>
          <p>Required task checklist plus tower/antenna height, tilt, and 0°–300° panoramas.</p>
        </div>
        <div>
          <h2>Offline first</h2>
          <p>Capture without coverage; queue uploads and sync when the network returns.</p>
        </div>
        <div>
          <h2>Linked portal</h2>
          <p>One system of record for RF review, acceptance, and optimization audit trails.</p>
        </div>
      </section>
    </div>
  )
}
