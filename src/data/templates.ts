import type { CaptureSlotDef, ChecklistItem, Sector } from './types'

export function buildChecklist(siteCode: string): ChecklistItem[] {
  const stamp = Date.now()
  const item = (
    suffix: string,
    category: ChecklistItem['category'],
    label: string,
    plannedValue?: string,
  ): ChecklistItem => ({
    id: `${siteCode}-${suffix}-${stamp}`,
    category,
    label,
    required: true,
    status: 'pending',
    plannedValue,
    evidenceIds: [],
  })

  return [
    item('s1', 'safety', 'PPE worn & RF exclusion zone observed'),
    item('s2', 'safety', 'Climb / work permit validated (if applicable)'),
    item('c1', 'civil', 'Compound access & fencing secure'),
    item('c2', 'civil', 'Tower / pole structural visual OK'),
    item('r1', 'rf', 'Sector azimuth matches design', 'per sector'),
    item('r2', 'rf', 'Mechanical tilt matches design', 'per sector'),
    item('r3', 'rf', 'Electrical tilt matches design / RET', 'per sector'),
    item('r4', 'rf', 'Antenna model & mount verified'),
    item('p1', 'power', 'Rectifier / battery status nominal'),
    item('t1', 'transmission', 'Backhaul link up / alarms clear'),
    item('d1', 'data_collection', 'All mandatory photo slots captured'),
    item('d2', 'data_collection', 'Tower & antenna heights recorded with photos'),
  ]
}

/** Standard industry pack: overview, heights, per-sector tilts, 6-shot panorama */
export function buildCaptureSlots(sectors: Sector[]): CaptureSlotDef[] {
  const slots: CaptureSlotDef[] = [
    {
      id: 'SITE_OVERVIEW',
      kind: 'SITE_OVERVIEW',
      label: 'Site / compound overview',
      required: true,
    },
    {
      id: 'TOWER_HEIGHT',
      kind: 'TOWER_HEIGHT',
      label: 'Tower / pole height photo',
      required: true,
    },
    {
      id: 'ANTENNA_HEIGHT',
      kind: 'ANTENNA_HEIGHT',
      label: 'Antenna height photo',
      required: true,
    },
    {
      id: 'SHELTER',
      kind: 'SHELTER',
      label: 'Shelter / cabinet photo',
      required: false,
    },
    {
      id: 'GROUNDING',
      kind: 'GROUNDING',
      label: 'Grounding / earthing photo',
      required: false,
    },
  ]

  for (const sector of sectors) {
    slots.push({
      id: `TILT_MECH_${sector.id}`,
      kind: 'TILT_MECH',
      label: `Sector ${sector.name} — mechanical tilt / bracket`,
      required: true,
      sectorId: sector.id,
    })
    slots.push({
      id: `TILT_ELEC_${sector.id}`,
      kind: 'TILT_ELEC',
      label: `Sector ${sector.name} — electrical tilt / RET`,
      required: false,
      sectorId: sector.id,
    })
  }

  const bearings = [0, 60, 120, 180, 240, 300]
  for (const bearing of bearings) {
    slots.push({
      id: `PANORAMA_${bearing}`,
      kind: 'PANORAMA',
      label: `Panorama ${bearing}°`,
      required: true,
      bearingDeg: bearing,
    })
  }

  return slots
}

export function slotFillCount(slots: CaptureSlotDef[], capturedSlotIds: Set<string>) {
  const required = slots.filter((s) => s.required)
  const filled = required.filter((s) => capturedSlotIds.has(s.id))
  return {
    required: required.length,
    filled: filled.length,
    pct: required.length ? Math.round((filled.length / required.length) * 100) : 100,
    complete: filled.length === required.length,
  }
}
