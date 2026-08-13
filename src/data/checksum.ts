/** SHA-256 hex digest of a Blob, ArrayBuffer, or data URL payload. */
export async function sha256Hex(input: Blob | ArrayBuffer | string): Promise<string> {
  let buffer: ArrayBuffer
  if (typeof input === 'string') {
    if (input.startsWith('data:')) {
      const base64 = input.split(',')[1] ?? ''
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
      buffer = bytes.buffer
    } else {
      buffer = new TextEncoder().encode(input).buffer
    }
  } else if (input instanceof Blob) {
    buffer = await input.arrayBuffer()
  } else {
    buffer = input
  }

  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function byteLengthOfDataUrl(dataUrl: string): number {
  if (!dataUrl.startsWith('data:')) return new TextEncoder().encode(dataUrl).length
  const base64 = dataUrl.split(',')[1] ?? ''
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding)
}
