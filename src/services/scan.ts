import type { UseCase, ScanResult, ExistingCapability, CapabilityGap } from '@/types'

const API_BASE = import.meta.env.VITE_SCAN_API_URL || ''

/**
 * Extension point: replace with your backend that:
 * - Accepts use case description
 * - Scans connected systems (APIs, docs, repos, data catalogs)
 * - Returns existing capabilities + gaps
 */
export async function runScan(useCase: Pick<UseCase, 'title' | 'description'>): Promise<ScanResult> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(useCase),
    })
    if (!res.ok) throw new Error('Scan failed')
    return res.json()
  }

  // Mock result for demo / development
  return mockScan(useCase)
}

function mockScan(useCase: Pick<UseCase, 'title' | 'description'>): ScanResult {
  const id = crypto.randomUUID()
  const existing: ExistingCapability[] = [
    {
      id: crypto.randomUUID(),
      name: 'Internal NLP API',
      type: 'api',
      source: 'api-catalog',
      relevance: 92,
      summary: 'Text classification and entity extraction. Could support intent detection for your use case.',
      link: '#',
    },
    {
      id: crypto.randomUUID(),
      name: 'Data Lake — Customer Events',
      type: 'dataset',
      source: 'data-catalog',
      relevance: 78,
      summary: 'Event stream of customer actions. Useful for training or evaluation.',
    },
    {
      id: crypto.randomUUID(),
      name: 'AI/ML Runbook',
      type: 'documentation',
      source: 'docs',
      relevance: 65,
      summary: 'Documentation for deploying and monitoring models in production.',
      link: '#',
    },
  ]
  const gaps: CapabilityGap[] = [
    {
      id: crypto.randomUUID(),
      title: 'Use-case-specific orchestration service',
      description: 'No single service coordinates the full flow (NLP → business rules → response). A lightweight orchestrator would close this gap.',
      priority: 'high',
      suggestedApproach: 'Add a small service that calls the NLP API, applies business logic, and returns a structured response. Can start as a serverless function.',
    },
    {
      id: crypto.randomUUID(),
      title: 'Evaluation and feedback loop',
      description: 'No pipeline to measure accuracy or collect human feedback for this use case.',
      priority: 'medium',
      suggestedApproach: 'Extend the existing ML ops pipeline with an evaluation job and optional human-in-the-loop review queue.',
    },
  ]
  return {
    useCaseId: id,
    existing,
    gaps,
    scannedAt: new Date().toISOString(),
    summary: `Found ${existing.length} existing capabilities that can support "${useCase.title}". ${gaps.length} gaps identified; you can start building from the gaps view.`,
  }
}

export function getStoredScan(scanId: string): ScanResult | null {
  try {
    const raw = sessionStorage.getItem(`scan:${scanId}`)
    return raw ? (JSON.parse(raw) as ScanResult) : null
  } catch {
    return null
  }
}

export function storeScan(result: ScanResult): void {
  sessionStorage.setItem(`scan:${result.useCaseId}`, JSON.stringify(result))
}
