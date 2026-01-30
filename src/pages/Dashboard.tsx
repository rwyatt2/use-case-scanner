import { Link } from 'react-router-dom'
import styles from './Dashboard.module.css'

export function Dashboard() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Enterprise AI Use Case Scanner</h1>
        <p className={styles.subtitle}>
          Add documents for AI to suggest use cases, or describe a use case and scan your infrastructure for existing support.
          If something’s missing, start building it in one click.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/documents" className={styles.cta}>
            Add documents → get recommendations
          </Link>
          <Link to="/scan" className={styles.ctaSecondary}>
            New use case scan
          </Link>
        </div>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <h3>Discover</h3>
          <p>AI scrubs APIs, services, documentation, and data catalogs to find what already supports your use case.</p>
        </div>
        <div className={styles.card}>
          <h3>Gap analysis</h3>
          <p>Clear view of what exists vs. what’s missing, with relevance scores and suggested approaches.</p>
        </div>
        <div className={styles.card}>
          <h3>Build</h3>
          <p>No match? Create specs, tickets, or kick off a build workflow with minimal friction and risk.</p>
        </div>
      </section>

      <section className={styles.enterprise}>
        <h2>Enterprise-ready</h2>
        <ul>
          <li>Read-only scanning — no writes to your systems</li>
          <li>Integrate with existing auth (SSO, API keys)</li>
          <li>Connect your APIs, docs, repos, data catalogs</li>
          <li>Audit trail and export for compliance</li>
        </ul>
      </section>
    </div>
  )
}
