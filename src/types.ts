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
  /** e.g. text/plain, image/png — helps backend handle binary */
  mimeType?: string
}

/** Use case suggested by AI after reading documents */
export interface SuggestedUseCase {
  id: string
  title: string
  description: string
  confidence?: number
  sourceHint?: string
}

/** Marketplace product type */
export type MarketplaceProductType =
  | 'api'
  | 'capability'
  | 'repo'
  | 'application'
  | 'database'
  | 'service'
  | 'dataset'
  | 'documentation'
  | 'model'
  | 'integration'

/** Ownership scope: mine (user) vs organization */
export type MarketplaceScope = 'mine' | 'organization'

/** A product in the marketplace (API, app, repo, DB, etc.) */
export interface MarketplaceProduct {
  id: string
  name: string
  description: string
  type: MarketplaceProductType
  scope: MarketplaceScope
  tags: string[]
  createdAt: string
  updatedAt: string
  owner?: string
  version?: string
  link?: string
  /** Extended description for detail page */
  longDescription?: string
  /** Link to docs or runbook */
  documentationUrl?: string
  /** e.g. active, deprecated, beta */
  status?: 'active' | 'beta' | 'deprecated' | 'draft'
}

/** Feature flags (e.g. mock data toggles) */
export interface FeatureFlags {
  useMockMarketplace: boolean
}

/** Use case I created or own (saved for dashboard) */
export interface SavedUseCase {
  scanId: string
  title: string
  description: string
  createdAt: string
}

/** Chat message for unified conversation UI */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  /** Assistant-only: link to scan results */
  scanId?: string
  /** Assistant-only: suggested use cases from doc analysis */
  suggestedUseCases?: { id: string; title: string; description: string }[]
}
