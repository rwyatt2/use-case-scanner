import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DevPanel } from '@/components/DevPanel'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { AddDocuments } from '@/pages/AddDocuments'
import { RecommendedUseCases } from '@/pages/RecommendedUseCases'
import { Marketplace } from '@/pages/Marketplace'
import { MarketplaceDetail } from '@/pages/MarketplaceDetail'
import { MarketplaceDocs } from '@/pages/MarketplaceDocs'
import { NewUseCase } from '@/pages/NewUseCase'
import { ScanResults } from '@/pages/ScanResults'
import { BuildCapability } from '@/pages/BuildCapability'
import { Settings } from '@/pages/Settings'
import { Docs } from '@/pages/Docs'
import { NotFound } from '@/pages/NotFound'
import { ROUTES } from '@/constants'

export default function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.LANDING} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<AddDocuments />} />
          <Route path="documents/recommendations" element={<RecommendedUseCases />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id/docs" element={<MarketplaceDocs />} />
          <Route path="marketplace/:id" element={<MarketplaceDetail />} />
          <Route path="scan" element={<NewUseCase />} />
          <Route path="results/:scanId" element={<ScanResults />} />
          <Route path="build/:gapId" element={<BuildCapability />} />
          <Route path="settings" element={<Settings />} />
          <Route path="docs" element={<Docs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <DevPanel />
    </>
  )
}
