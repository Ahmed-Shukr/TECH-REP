const BEARING_WARN_DEG = 15

export function bearingDelta(actual: number, expected: number): number {
  const raw = Math.abs(((actual - expected + 540) % 360) - 180)
  return Math.round(raw * 10) / 10
}

export function isBearingOffSlot(actual: number, expected: number, maxDelta = BEARING_WARN_DEG) {
  return bearingDelta(actual, expected) > maxDelta
}

export function normalizeBearing(deg: number): number {
  return ((deg % 360) + 360) % 360
}

/**
 * Read device compass bearing when available.
 * iOS requires a prior user gesture calling DeviceOrientationEvent.requestPermission.
 */
export async function readDeviceBearing(): Promise<number | null> {
  if (typeof window === 'undefined') return null

  const DOE = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied' | 'default'>
  }

  try {
    if (typeof DOE.requestPermission === 'function') {
      const permission = await DOE.requestPermission()
      if (permission !== 'granted') return null
    }
  } catch {
    return null
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = (value: number | null) => {
      if (settled) return
      settled = true
      window.removeEventListener('deviceorientationabsolute', onAbs as EventListener)
      window.removeEventListener('deviceorientation', onRel as EventListener)
      clearTimeout(timer)
      resolve(value)
    }

    const onAbs = (event: DeviceOrientationEvent) => {
      const heading =
        typeof (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading === 'number'
          ? (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading
          : event.alpha != null
            ? normalizeBearing(360 - event.alpha)
            : null
      if (heading != null) finish(Math.round(heading))
    }

    const onRel = (event: DeviceOrientationEvent) => {
      if (event.absolute === false && event.alpha == null) return
      const heading =
        typeof (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading === 'number'
          ? (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading
          : event.alpha != null
            ? normalizeBearing(360 - event.alpha)
            : null
      if (heading != null) finish(Math.round(heading))
    }

    window.addEventListener('deviceorientationabsolute', onAbs as EventListener)
    window.addEventListener('deviceorientation', onRel as EventListener)
    const timer = window.setTimeout(() => finish(null), 2500)
  })
}

export { BEARING_WARN_DEG }
