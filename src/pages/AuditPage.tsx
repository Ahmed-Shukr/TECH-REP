import { roleLabel } from '../data/auth'
import { useStore } from '../data/useStore'

export function AuditPage() {
  const { state } = useStore()
  const events = state.auditLog

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Immutable activity</p>
          <h1>Audit log</h1>
          <p className="page__lede">
            Append-only trail of checklist changes, captures, optimization transitions, and portal
            sync flushes for the current demo workspace.
          </p>
        </div>
      </header>

      {events.length === 0 ? (
        <p className="empty">No audit events yet.</p>
      ) : (
        <section className="panel">
          <ul className="list">
            {events.map((event) => (
              <li key={event.id} className="list__row list__row--stack">
                <div>
                  <p className="list__title">{event.summary}</p>
                  <p className="muted">
                    {new Date(event.at).toLocaleString()} · {event.actorName} (
                    {roleLabel(event.role)}) · {event.entityType}/{event.action}
                  </p>
                  {event.before || event.after ? (
                    <p className="muted tight">
                      {event.before ? `before: ${event.before}` : ''}
                      {event.before && event.after ? ' · ' : ''}
                      {event.after ? `after: ${event.after}` : ''}
                    </p>
                  ) : null}
                </div>
                <span className="chip">{event.entityId}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
