import type { OptimizationAction, Site, Visit } from '../data/types'
import * as mock from './mockServer'

/**
 * Thin client over the local mock REST surface.
 * Swap implementations here when a real backend is available.
 */
export const api = {
  authToken: (userId: string) => mock.postAuthToken(userId),
  pullSites: (sites: Site[]) => mock.getAssignedSites(sites),
  upsertVisit: (visit: Visit) => mock.upsertVisit(visit),
  upsertAction: (action: OptimizationAction) => mock.upsertAction(action),
  portalDossier: (siteId: string) => mock.getPortalDossier(siteId),
  syncCursor: () => mock.getSyncCursor(),
  reset: () => mock.clearPortalApi(),
}
