/**
 * Application constants — single source of truth for routes, storage keys, and config.
 * Keeps integration points explicit and easy to change for enterprise deployment.
 */

export const ROUTES = {
  /** Public landing page (no app shell) */
  LANDING: '/',
  /** Login page */
  LOGIN: '/login',
  /** App home / dashboard */
  HOME: '/dashboard',
  MARKETPLACE: '/marketplace',
  /** Documentation hub — product docs and marketplace item docs */
  DOCS: '/docs',
  DOCUMENTS: '/documents',
  DOCUMENTS_RECOMMENDATIONS: '/documents/recommendations',
  SCAN: '/scan',
  RESULTS: '/results',
  BUILD: '/build',
  SETTINGS: '/settings',
} as const

export const STORAGE_KEYS = {
  FEATURE_FLAGS: 'use-case-scanner:feature-flags',
  SCAN_PREFIX: 'scan:',
  SUGGESTED_USE_CASES: 'suggestedUseCases',
  FAVORITES: 'use-case-scanner:favorites',
  MY_USE_CASES: 'use-case-scanner:my-use-cases',
  CHAT_MESSAGES: 'use-case-scanner:chat-messages',
  AUTH: 'use-case-scanner:auth',
} as const

/** Base URL for scanner API — set via VITE_SCAN_API_URL at build time. Never log or expose secrets. */
export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SCAN_API_URL) || ''

/** Request timeout in ms for all API calls. */
export const API_TIMEOUT_MS = 30_000

/** Enterprise: read-only assurance copy for compliance/audit documentation. */
export const READ_ONLY_MESSAGE = 'Scans are read-only. No data is written to your systems.'
