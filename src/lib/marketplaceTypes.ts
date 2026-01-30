import type { MarketplaceProductType } from '@/types'

export interface MarketplaceTypeConfig {
  label: string
  icon: string
  /** Short description for tooltip/aria */
  description: string
}

export const MARKETPLACE_TYPE_CONFIG: Record<MarketplaceProductType, MarketplaceTypeConfig> = {
  api: {
    label: 'API',
    icon: '↗',
    description: 'REST or other API',
  },
  application: {
    label: 'Application',
    icon: '▣',
    description: 'Deployed application or app',
  },
  capability: {
    label: 'Capability',
    icon: '◇',
    description: 'Platform capability or feature',
  },
  database: {
    label: 'Database',
    icon: '▤',
    description: 'Database or data store',
  },
  dataset: {
    label: 'Dataset',
    icon: '▦',
    description: 'Dataset or data asset',
  },
  documentation: {
    label: 'Documentation',
    icon: '▥',
    description: 'Docs, runbook, or guide',
  },
  integration: {
    label: 'Integration',
    icon: '⚌',
    description: 'Integration or connector',
  },
  model: {
    label: 'Model',
    icon: '⬡',
    description: 'ML or AI model',
  },
  repo: {
    label: 'Repository',
    icon: '⌂',
    description: 'Code repository',
  },
  service: {
    label: 'Service',
    icon: '⬢',
    description: 'Microservice or backend service',
  },
}

export function getTypeConfig(type: string): MarketplaceTypeConfig {
  const t = type as MarketplaceProductType
  return MARKETPLACE_TYPE_CONFIG[t] ?? {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    icon: '•',
    description: type,
  }
}
