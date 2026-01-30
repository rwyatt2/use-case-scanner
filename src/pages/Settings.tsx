import { useState } from 'react'
import { useFeatureFlags } from '@/context/FeatureFlags'
import type { ConnectedSystem } from '@/types'
import styles from './Settings.module.css'

const defaultSystems: ConnectedSystem[] = [
  { id: '1', type: 'api', name: 'API catalog', status: 'pending' },
  { id: '2', type: 'docs', name: 'Internal docs', status: 'pending' },
  { id: '3', type: 'repo', name: 'Code repos', status: 'pending' },
  { id: '4', type: 'data_catalog', name: 'Data catalog', status: 'pending' },
]

export function Settings() {
  const { flags, setFlag } = useFeatureFlags()
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_SCAN_API_URL || '')
  const [systems] = useState<ConnectedSystem[]>(defaultSystems)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>
        Configure integration with your infrastructure. Scans are read-only; no writes to your systems.
      </p>

      <section className={styles.section}>
        <h2>Feature flags</h2>
        <p className={styles.hint}>
          Toggle mock data and demo behavior. When off, the app uses your configured API only.
        </p>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={flags.useMockMarketplace}
            onChange={(e) => setFlag('useMockMarketplace', e.target.checked)}
            className={styles.checkbox}
          />
          <span>Use mock marketplace data</span>
        </label>
        <p className={styles.note}>
          When on, the Marketplace shows mock APIs, repos, apps, databases, etc. When off, Marketplace shows only data from your catalog API (or empty).
        </p>
      </section>

      <section className={styles.section}>
        <h2>Scan API</h2>
        <p className={styles.hint}>
          Point to your Use Case Scanner backend (or leave empty for demo mode with mock results).
        </p>
        <label className={styles.label}>
          API base URL
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://your-scanner-api.example.com"
            className={styles.input}
          />
        </label>
        <p className={styles.note}>
          In production, set <code>VITE_SCAN_API_URL</code> at build time so the app uses your API by default.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Connected systems</h2>
        <p className={styles.hint}>
          Configure where the AI should look for existing capabilities (APIs, docs, repos, data catalogs).
          These are placeholders — connect your real connectors in your backend.
        </p>
        <ul className={styles.systemList}>
          {systems.map((sys) => (
            <li key={sys.id} className={styles.systemItem}>
              <span className={styles.systemName}>{sys.name}</span>
              <span className={styles.systemType}>{sys.type.replace('_', ' ')}</span>
              <span className={styles.systemStatus} data-status={sys.status}>
                {sys.status}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Backend integration: add connectors that crawl your API catalog, docs, repos, and data catalog,
          then return structured capabilities to the scan API.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Enterprise</h2>
        <ul className={styles.bullets}>
          <li><strong>Auth:</strong> Use your existing SSO or API keys; configure in your deployment.</li>
          <li><strong>Data:</strong> Scans are read-only; no data is written to your systems.</li>
          <li><strong>Audit:</strong> Export scan results and logs from your backend for compliance.</li>
        </ul>
      </section>
    </div>
  )
}
