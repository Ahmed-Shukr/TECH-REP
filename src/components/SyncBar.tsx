import { useState } from 'react'
import { useStore } from '../data/useStore'

export function SyncBar() {
  const { state, queueSync, flushSyncQueue } = useStore()
  const [message, setMessage] = useState<string | null>(null)
  const pending =
    state.syncQueue.length +
    state.visits.filter((v) => v.syncStatus === 'pending' || v.syncStatus === 'local').length

  const onSync = async () => {
    queueSync()
    const result = await flushSyncQueue()
    setMessage(result.message)
  }

  return (
    <div className={`syncbar ${state.online ? 'is-online' : 'is-offline'}`}>
      <div className="syncbar__status">
        <span className="syncbar__dot" aria-hidden />
        <span>
          {state.online ? 'Online' : 'Offline'} · queue {state.syncQueue.length}
          {pending ? ` · ${pending} field change(s) not fully synced` : ''}
        </span>
      </div>
      <div className="syncbar__actions">
        {message ? <span className="syncbar__msg">{message}</span> : null}
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => void onSync()}>
          Sync to portal
        </button>
      </div>
    </div>
  )
}
