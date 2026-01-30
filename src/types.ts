/** Represents an AI use case the user wants to support */
export interface UseCase {
  id: string
  title: string
  description: string
  createdAt: string
  status: 'draft' | 'scanning' | 'complete' | 'building'
}

/** Something that already exists and can support the use case */
export interface ExistingCapability {
  id: string
  name: string
  type: 'api' | 'service' | 'documentation' | 'dataset' | 'model' | 'integration'
  source: string
  relevance: number
  summary: string
  link?: string
}

/** A gap — capability that doesn't exist and is needed */
export interface CapabilityGap {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  suggestedApproach?: string
}

/** Full result of scanning for a use case */
export interface ScanResult {
  useCaseId: string
  existing: ExistingCapability[]
  gaps: CapabilityGap[]
  scannedAt: string
  summary: string
}

/** Connected system for enterprise integration (placeholder for real connectors) */
export interface ConnectedSystem {
  id: string
  type: 'api' | 'docs' | 'repo' | 'data_catalog'
  name: string
  endpoint?: string
  status: 'connected' | 'pending' | 'error'
}

/** Document added by user for AI to analyze */
export interface DocumentInput {
  id: string
  name: string
  type: 'file' | 'pasted'
  content: string
  addedAt: string
}

/** Use case suggested by AI after reading documents */
export interface SuggestedUseCase {
  id: string
  title: string
  description: string
  confidence?: number
  sourceHint?: string
}
