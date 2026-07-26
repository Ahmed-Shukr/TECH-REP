import type { ChecklistItem, ItemStatus } from './types'

export function checklistProgress(items: ChecklistItem[]) {
  const done = items.filter((i) => i.status !== 'pending').length
  return {
    done,
    total: items.length,
    pct: items.length ? Math.round((done / items.length) * 100) : 0,
  }
}

export function itemStatusLabel(status: ItemStatus) {
  return status.replace('_', ' ')
}
