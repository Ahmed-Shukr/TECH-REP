import { useEffect, useState } from 'react'
import { BEARING_WARN_DEG, bearingDelta, readDeviceBearing } from '../data/compass'

type Props = {
  expectedBearing?: number
}

export function CompassAssist({ expectedBearing }: Props) {
  const [bearing, setBearing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    if (!listening || expectedBearing === undefined) return
    let cancelled = false
    let timer: number | undefined

    const tick = async () => {
      const value = await readDeviceBearing()
      if (cancelled) return
      if (value == null) {
        setError('Compass unavailable on this device/browser')
        return
      }
      setError(null)
      setBearing(value)
      timer = window.setTimeout(() => void tick(), 800)
    }

    void tick()
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [listening, expectedBearing])

  if (expectedBearing === undefined) return null

  const delta = bearing != null ? bearingDelta(bearing, expectedBearing) : null
  const off = delta != null && delta > BEARING_WARN_DEG

  return (
    <div className={`compass ${off ? 'is-off' : ''}`}>
      <div className="compass__row">
        <strong>Compass assist</strong>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setListening((v) => !v)}
        >
          {listening ? 'Stop' : 'Enable'}
        </button>
      </div>
      <p className="muted tight">
        Aim device near <strong>{expectedBearing}°</strong>
        {bearing != null ? ` · live ${bearing}°` : ''}
        {delta != null ? ` · Δ ${delta}°` : ''}
        {off ? ` · warn if > ${BEARING_WARN_DEG}°` : ''}
      </p>
      {error ? <p className="banner banner--warn tight">{error}</p> : null}
    </div>
  )
}
