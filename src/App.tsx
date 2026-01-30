import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { AddDocuments } from '@/pages/AddDocuments'
import { RecommendedUseCases } from '@/pages/RecommendedUseCases'
import { NewUseCase } from '@/pages/NewUseCase'
import { ScanResults } from '@/pages/ScanResults'
import { BuildCapability } from '@/pages/BuildCapability'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents" element={<AddDocuments />} />
        <Route path="/documents/recommendations" element={<RecommendedUseCases />} />
        <Route path="/scan" element={<NewUseCase />} />
        <Route path="/results/:scanId" element={<ScanResults />} />
        <Route path="/build/:gapId" element={<BuildCapability />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}
