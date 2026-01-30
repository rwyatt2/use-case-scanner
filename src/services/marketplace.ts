import type { MarketplaceProduct, MarketplaceProductType, MarketplaceScope } from '@/types'
import { API_BASE } from '@/constants'
import { apiGet } from '@/lib/api'

export type MarketplaceSort = 'name-asc' | 'name-desc' | 'type' | 'newest' | 'oldest'
export type MarketplaceFilters = {
  scope: MarketplaceScope | 'all'
  types: MarketplaceProductType[]
  search: string
  sort: MarketplaceSort
}

/**
 * Fetch marketplace products. When feature flag useMockMarketplace is on, returns mock data.
 * Otherwise calls backend (or returns empty).
 */
export async function getMarketplaceProducts(
  useMock: boolean,
  filters: MarketplaceFilters
): Promise<MarketplaceProduct[]> {
  if (API_BASE && !useMock) {
    const params: Record<string, string> = { sort: filters.sort }
    if (filters.scope !== 'all') params.scope = filters.scope
    if (filters.types.length) params.types = filters.types.join(',')
    if (filters.search) params.q = filters.search
    const data = await apiGet<MarketplaceProduct[] | { products: MarketplaceProduct[] }>(
      '/marketplace',
      params
    )
    return Array.isArray(data) ? data : (data.products ?? [])
  }

  if (!useMock) return []

  let items = [...MOCK_MARKETPLACE_PRODUCTS]

  if (filters.scope !== 'all') {
    items = items.filter((p) => p.scope === filters.scope)
  }
  if (filters.types.length > 0) {
    items = items.filter((p) => filters.types.includes(p.type))
  }
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  switch (filters.sort) {
    case 'name-asc':
      items.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      items.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'type':
      items.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
      break
    case 'newest':
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'oldest':
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    default:
      break
  }

  return items
}

/**
 * Fetch a single marketplace product by id. When useMock is on, looks up in mock data.
 */
export async function getMarketplaceProduct(
  useMock: boolean,
  id: string
): Promise<MarketplaceProduct | null> {
  if (API_BASE && !useMock) {
    try {
      const data = await apiGet<MarketplaceProduct>(`/marketplace/${encodeURIComponent(id)}`)
      return data ?? null
    } catch {
      return null
    }
  }
  if (!useMock) return null
  const found = MOCK_MARKETPLACE_PRODUCTS.find((p) => p.id === id) ?? null
  return found
}

export const MARKETPLACE_PRODUCT_TYPES: MarketplaceProductType[] = [
  'api',
  'application',
  'capability',
  'database',
  'dataset',
  'documentation',
  'integration',
  'model',
  'repo',
  'service',
]

const MOCK_MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'm1',
    name: 'Customer Events API',
    description: 'REST API for customer lifecycle and event streaming. Used by analytics and ML pipelines.',
    type: 'api',
    scope: 'mine',
    tags: ['rest', 'events', 'analytics'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z',
    owner: 'You',
    version: '2.1',
    link: '#',
    status: 'active',
    longDescription: 'The Customer Events API provides a unified REST interface for publishing and consuming customer lifecycle events (signups, purchases, support interactions, and custom events). It powers analytics dashboards, ML training pipelines, and real-time alerting. Authentication is via API key or OAuth; rate limits apply per key. Events are retained for 90 days by default; contact Data Platform for longer retention.',
    documentationUrl: '#',
  },
  {
    id: 'm2',
    name: 'Intent Classification Model',
    description: 'NLP model for classifying customer support intents. Supports 12 categories.',
    type: 'model',
    scope: 'mine',
    tags: ['nlp', 'classification', 'support'],
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    owner: 'You',
    version: '1.3',
    link: '#',
    status: 'active',
    longDescription: 'Pre-trained transformer-based model for classifying support tickets and chat messages into 12 intent categories (billing, technical, returns, etc.). Serves the Support Ticket Router and can be used via the Inference API. Model card and evaluation metrics are in the repo. Retrained monthly on labeled support data.',
    documentationUrl: '#',
  },
  {
    id: 'm3',
    name: 'use-case-scanner',
    description: 'Enterprise AI Use Case Scanner — discover capabilities and gaps. Vite + React app.',
    type: 'repo',
    scope: 'mine',
    tags: ['react', 'vite', 'typescript'],
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-01-29T16:00:00Z',
    owner: 'You',
    link: '#',
  },
  {
    id: 'm4',
    name: 'Support Ticket Router',
    description: 'Service that routes support tickets to the right team using the intent model.',
    type: 'application',
    scope: 'mine',
    tags: ['routing', 'support', 'automation'],
    createdAt: '2024-09-01T08:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
    owner: 'You',
    version: '1.0',
    link: '#',
  },
  {
    id: 'm5',
    name: 'Data Lake — Customer',
    description: 'Central data lake for customer events, profiles, and interactions. Delta tables.',
    type: 'database',
    scope: 'organization',
    tags: ['data-lake', 'delta', 'customer'],
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    owner: 'Data Platform',
    link: '#',
    status: 'active',
    longDescription: 'Centralized data lake built on Delta Lake for all customer-related data: events (from Customer Events API), profiles, support interactions, and product usage. Access is via SQL (Databricks or Athena) or the Data Catalog. PII is masked by default; request access through Data Platform.',
    documentationUrl: '#',
  },
  {
    id: 'm6',
    name: 'Internal API Gateway',
    description: 'Organization-wide API gateway. Auth, rate limits, and routing for all internal APIs.',
    type: 'api',
    scope: 'organization',
    tags: ['gateway', 'auth', 'internal'],
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2025-01-12T14:00:00Z',
    owner: 'Platform',
    version: '3.2',
    link: '#',
  },
  {
    id: 'm7',
    name: 'ML Ops Pipeline',
    description: 'CI/CD and monitoring for ML models. Training, evaluation, and deployment runbooks.',
    type: 'capability',
    scope: 'organization',
    tags: ['mlops', 'cicd', 'monitoring'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-20T11:00:00Z',
    owner: 'ML Team',
    link: '#',
  },
  {
    id: 'm8',
    name: 'Product Catalog Service',
    description: 'Microservice for product catalog. Search, filters, and recommendations API.',
    type: 'service',
    scope: 'organization',
    tags: ['catalog', 'search', 'recommendations'],
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2025-01-18T08:00:00Z',
    owner: 'Commerce',
    version: '4.0',
    link: '#',
  },
  {
    id: 'm9',
    name: 'AI/ML Runbook',
    description: 'Documentation for deploying and operating ML models in production.',
    type: 'documentation',
    scope: 'organization',
    tags: ['docs', 'ml', 'runbook'],
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2025-01-10T12:00:00Z',
    owner: 'ML Team',
    link: '#',
  },
  {
    id: 'm10',
    name: 'Feedback Events Dataset',
    description: 'Curated dataset of user feedback and ratings for model evaluation.',
    type: 'dataset',
    scope: 'organization',
    tags: ['feedback', 'evaluation', 'training'],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-22T09:00:00Z',
    owner: 'Data Team',
    link: '#',
  },
  {
    id: 'm11',
    name: 'SSO Integration',
    description: 'Organization SSO integration. SAML/OIDC for all internal apps.',
    type: 'integration',
    scope: 'organization',
    tags: ['sso', 'auth', 'saml'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    owner: 'Security',
    version: '2.0',
    link: '#',
  },
  {
    id: 'm12',
    name: 'Recommendation API',
    description: 'Personalized product recommendations. Used by web and mobile.',
    type: 'api',
    scope: 'organization',
    tags: ['recommendations', 'personalization'],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2025-01-25T10:00:00Z',
    owner: 'Commerce',
    version: '1.5',
    link: '#',
  },
]
