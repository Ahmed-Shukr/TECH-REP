import { useMemo, useRef, useState } from 'react'
import { BEARING_WARN_DEG, bearingDelta, isBearingOffSlot, readDeviceBearing } from '../data/compass'
import { compressAndHashImage, getOrCreateDeviceId, readDeviceGps } from '../data/media'
import type { CaptureAsset, CaptureSlotDef } from '../data/types'
import { CompassAssist } from './CompassAssist'

type Props = {
  slots: CaptureSlotDef[]
  captures: CaptureAsset[]
  locked?: boolean
  userId?: string
  onCapture: (asset: Omit<CaptureAsset, 'id'> & { id?: string }) => void
}

export function CaptureSlotGrid({ slots, captures, locked, userId, onCapture }: Props) {
  const [busySlot, setBusySlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activePanorama, setActivePanorama] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const bySlot = new Map(captures.map((c) => [c.slotId, c]))
  const activeSlot = useMemo(
    () => slots.find((s) => s.id === activePanorama),
    [activePanorama, slots],
  )

  const handleFile = async (slot: CaptureSlotDef, file: File | undefined) => {
    if (!file || locked) return
    setBusySlot(slot.id)
    setError(null)
    try {
      const media = await compressAndHashImage(file)
      const gps = await readDeviceGps()
      const deviceBearing =
        slot.kind === 'PANORAMA' && slot.bearingDeg !== undefined
          ? await readDeviceBearing()
          : null

      const bearingDeg = deviceBearing ?? slot.bearingDeg
      const bearingSource = deviceBearing != null ? 'device' : slot.bearingDeg != null ? 'slot_default' : undefined
      const bearingDeltaDeg =
        deviceBearing != null && slot.bearingDeg !== undefined
          ? bearingDelta(deviceBearing, slot.bearingDeg)
          : undefined

      if (
        slot.kind === 'PANORAMA' &&
        deviceBearing != null &&
        slot.bearingDeg !== undefined &&
        isBearingOffSlot(deviceBearing, slot.bearingDeg)
      ) {
        setError(
          `${slot.label}: compass Δ ${bearingDeltaDeg}° exceeds ${BEARING_WARN_DEG}° — photo saved with warning`,
        )
      }

      onCapture({
        slotId: slot.id,
        capturedAt: new Date().toISOString(),
        dataUrl: media.dataUrl,
        sha256: media.sha256,
        byteSize: media.byteSize,
        deviceId: getOrCreateDeviceId(),
        userId,
        lat: gps?.lat,
        lng: gps?.lng,
        accuracyM: gps?.accuracyM,
        bearingDeg,
        bearingSource,
        bearingDeltaDeg,
        note: slot.label,
      })
    } catch {
      setError('Could not process image. Try a smaller photo.')
    } finally {
      setBusySlot(null)
    }
  }

  const groups = [
    {
      title: 'Site & structure',
      kinds: ['SITE_OVERVIEW', 'TOWER_HEIGHT', 'ANTENNA_HEIGHT', 'SHELTER', 'GROUNDING'],
    },
    { title: 'Tilt evidence', kinds: ['TILT_MECH', 'TILT_ELEC'] },
    { title: 'Panoramas (0°–300°)', kinds: ['PANORAMA'] },
  ] as const

  return (
    <div className="capture">
      {error ? <p className="banner banner--warn">{error}</p> : null}
      {activeSlot?.kind === 'PANORAMA' ? (
        <CompassAssist expectedBearing={activeSlot.bearingDeg} />
      ) : null}
      {groups.map((group) => {
        const groupSlots = slots.filter((s) =>
          (group.kinds as readonly string[]).includes(s.kind),
        )
        if (!groupSlots.length) return null
        return (
          <div key={group.title} className="capture__group">
            <h3>{group.title}</h3>
            <div className="capture__grid">
              {groupSlots.map((slot) => {
                const existing = bySlot.get(slot.id)
                const off =
                  existing?.bearingDeltaDeg != null &&
                  existing.bearingDeltaDeg > BEARING_WARN_DEG
                return (
                  <div
                    key={slot.id}
                    className={`capture__card ${existing ? 'is-filled' : ''} ${slot.required ? 'is-required' : ''} ${off ? 'is-bearing-off' : ''}`}
                  >
                    <div className="capture__meta">
                      <strong>{slot.label}</strong>
                      <span className="muted">
                        {slot.required ? 'Required' : 'Optional'}
                        {slot.bearingDeg !== undefined ? ` · aim ~${slot.bearingDeg}°` : ''}
                      </span>
                    </div>
                    {existing?.dataUrl ? (
                      <img
                        src={existing.dataUrl}
                        alt={slot.label}
                        className="capture__thumb"
                      />
                    ) : existing ? (
                      <div className="capture__placeholder">Recorded (seed / no preview)</div>
                    ) : (
                      <div className="capture__placeholder">No photo yet</div>
                    )}
                    {!locked ? (
                      <>
                        <input
                          ref={(el) => {
                            inputRefs.current[slot.id] = el
                          }}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          hidden
                          onChange={(e) => {
                            void handleFile(slot, e.target.files?.[0])
                            e.target.value = ''
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          disabled={busySlot === slot.id}
                          onClick={() => {
                            if (slot.kind === 'PANORAMA') setActivePanorama(slot.id)
                            inputRefs.current[slot.id]?.click()
                          }}
                        >
                          {busySlot === slot.id
                            ? 'Processing…'
                            : existing
                              ? 'Retake'
                              : 'Capture / upload'}
                        </button>
                      </>
                    ) : null}
                    {existing?.capturedAt ? (
                      <p className="muted tight">
                        {new Date(existing.capturedAt).toLocaleString()}
                        {existing.lat !== undefined
                          ? ` · ${existing.lat.toFixed(5)}, ${existing.lng?.toFixed(5)}`
                          : ''}
                        {existing.bearingSource === 'device' && existing.bearingDeg != null
                          ? ` · compass ${existing.bearingDeg}°`
                          : ''}
                        {existing.sha256 ? ` · ${existing.sha256.slice(0, 8)}…` : ''}
                      </p>
                    ) : null}
                    {off ? (
                      <p className="banner banner--warn tight">
                        Bearing Δ {existing?.bearingDeltaDeg}° over {BEARING_WARN_DEG}° threshold
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
