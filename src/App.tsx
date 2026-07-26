import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { StoreProvider } from './data/store'
import { DashboardPage } from './pages/DashboardPage'
import { DossierPage } from './pages/DossierPage'
import { LandingPage } from './pages/LandingPage'
import { OptimizationDetailPage } from './pages/OptimizationDetailPage'
import { OptimizationsPage } from './pages/OptimizationsPage'
import { PortalPage } from './pages/PortalPage'
import { SiteDetailPage } from './pages/SiteDetailPage'
import { SitesPage } from './pages/SitesPage'
import { VerificationPage } from './pages/VerificationPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/sites/:siteId" element={<SiteDetailPage />} />
            <Route path="/sites/:siteId/verify/:visitId" element={<VerificationPage />} />
            <Route path="/optimizations" element={<OptimizationsPage />} />
            <Route path="/optimizations/:actionId" element={<OptimizationDetailPage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/portal/visits/:visitId" element={<DossierPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
