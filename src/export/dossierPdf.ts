import type { OptimizationAction, Site, Visit } from '../data/types'
import { slotFillCount } from '../data/templates'

function esc(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Opens a print-ready dossier window (Save as PDF from the browser print dialog).
 */
export function exportVisitDossierPdf(input: {
  site: Site
  visit: Visit
  actions: OptimizationAction[]
  exportedBy: string
}) {
  const { site, visit, actions, exportedBy } = input
  const fill = slotFillCount(visit.slots, new Set(visit.captures.map((c) => c.slotId)))
  const bySlot = new Map(visit.captures.map((c) => [c.slotId, c]))

  const checklistRows = visit.checklist
    .map(
      (item) => `
      <tr>
        <td>${esc(item.label)}</td>
        <td>${esc(item.category)}</td>
        <td>${esc(item.status)}</td>
        <td>${esc(item.measuredValue ?? '')}</td>
      </tr>`,
    )
    .join('')

  const actionRows = actions
    .map(
      (a) => `
      <tr>
        <td>${esc(a.type)}</td>
        <td>${esc(a.title)}</td>
        <td>${esc(a.status)}</td>
        <td>${esc(a.valueBefore ? `${a.valueBefore} → ${a.valueAfter ?? ''}` : '')}</td>
      </tr>`,
    )
    .join('')

  const mediaBlocks = visit.slots
    .map((slot) => {
      const cap = bySlot.get(slot.id)
      const img = cap?.dataUrl
        ? `<img src="${cap.dataUrl}" alt="${esc(slot.label)}" />`
        : `<div class="empty">No image</div>`
      return `
        <figure>
          <figcaption>${esc(slot.label)}${cap?.sha256 ? `<br/><small>sha256 ${esc(cap.sha256.slice(0, 12))}…</small>` : ''}</figcaption>
          ${img}
        </figure>`
    })
    .join('')

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>TECH-REP Dossier ${esc(site.code)}</title>
  <style>
    body { font-family: "IBM Plex Sans", Arial, sans-serif; color: #0a1628; margin: 24px; }
    h1,h2 { font-family: Syne, Arial, sans-serif; margin: 0 0 8px; }
    .meta { color: #5d6d7e; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; font-size: 12px; }
    th, td { border: 1px solid #c9d4de; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #eef4f7; }
    .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    figure { margin: 0; border: 1px solid #c9d4de; padding: 8px; break-inside: avoid; }
    figcaption { font-size: 11px; margin-bottom: 6px; }
    img { width: 100%; height: 120px; object-fit: cover; display: block; }
    .empty { height: 120px; display: grid; place-items: center; background: #f3f6f8; color: #5d6d7e; font-size: 12px; }
    @media print { body { margin: 12mm; } .noprint { display: none; } }
  </style>
</head>
<body>
  <p class="noprint"><button onclick="window.print()">Print / Save as PDF</button></p>
  <h1>TECH-REP Site Dossier</h1>
  <p class="meta">
    ${esc(site.code)} — ${esc(site.name)} · ${esc(site.region)}<br/>
    Visit ${esc(visit.id)} · status ${esc(visit.status)} · sync ${esc(visit.syncStatus)}<br/>
    Slots ${fill.filled}/${fill.required} · Tower ${visit.measurements.towerHeightM ?? '—'}m · Antenna ${visit.measurements.antennaHeightM ?? '—'}m<br/>
    Exported ${new Date().toLocaleString()} by ${esc(exportedBy)}
  </p>

  <h2>Checklist</h2>
  <table>
    <thead><tr><th>Item</th><th>Category</th><th>Status</th><th>Measured</th></tr></thead>
    <tbody>${checklistRows}</tbody>
  </table>

  <h2>Optimization actions</h2>
  <table>
    <thead><tr><th>Type</th><th>Title</th><th>Status</th><th>Values</th></tr></thead>
    <tbody>${actionRows || '<tr><td colspan="4">None</td></tr>'}</tbody>
  </table>

  <h2>Media by slot</h2>
  <div class="gallery">${mediaBlocks}</div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250))</script>
</body>
</html>`

  const win = window.open('', '_blank', 'noopener,noreferrer,width=960,height=800')
  if (!win) {
    throw new Error('Popup blocked — allow popups to export the dossier PDF')
  }
  win.document.open()
  win.document.write(html)
  win.document.close()
}
