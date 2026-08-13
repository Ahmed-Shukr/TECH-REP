import { byteLengthOfDataUrl, sha256Hex } from './checksum'

export type CompressedCapture = {
  dataUrl: string
  sha256: string
  byteSize: number
}

/** Compress an image File to a JPEG data URL for offline storage. */
export async function compressImageFile(
  file: File,
  maxEdge = 1920,
  quality = 0.7,
): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', quality)
}

export async function compressAndHashImage(
  file: File,
  maxEdge = 1920,
  quality = 0.7,
): Promise<CompressedCapture> {
  const dataUrl = await compressImageFile(file, maxEdge, quality)
  const sha256 = await sha256Hex(dataUrl)
  return {
    dataUrl,
    sha256,
    byteSize: byteLengthOfDataUrl(dataUrl),
  }
}

export function readDeviceGps(): Promise<{ lat: number; lng: number; accuracyM?: number } | null> {
  if (!navigator.geolocation) return Promise.resolve(null)
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  })
}

export function getOrCreateDeviceId(): string {
  const key = 'tech-rep-device-id'
  try {
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = `dev-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(key, id)
    return id
  } catch {
    return 'dev-unknown'
  }
}
