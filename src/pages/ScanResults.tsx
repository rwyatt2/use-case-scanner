import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { getStoredScan } from '@/services/scan'
import styles from './ScanResults.module.css'

const typeLabels: Record<string, string> = {
  api: 'API',
  service: 'Service',
  documentation: 'Docs',
  dataset: 'Dataset',
  model: 'Model',
  integration: 'Integration',
}

const priorityLabels: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function ScanResults() {
  const { scanId } = useParams<{ scanId: string }>()
  const result = scanId ? getStoredScan(scanId) : null

  if (!result) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Scan not found. Run a new scan from the dashboard.</p>
        <Link to="/scan" className={styles.link}>New use case scan</Link>
      </div>
    )
  }

  const date = new Date(result.scannedAt).toLocaleString()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Scan results</h1>
        <p className={styles.summary}>{result.summary}</p>
        <p className={styles.meta}>Scanned at {date}</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.badge}>{result.existing.length}</span>
          Existing capabilities
        </h2>
        <ul className={styles.list}>
          {result.existing.map((cap) => (
            <li key={cap.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.type}>{typeLabels[cap.type] ?? cap.type}</span>
                <span className={styles.relevance}>{cap.relevance}% match</span>
              </div>
              <h3 className={styles.cardTitle}>{cap.name}</h3>
              <p className={styles.cardSummary}>{cap.summary}</p>
              {cap.source && <span className={styles.source}>Source: {cap.source}</span>}
              {cap.link && (
                <a href={cap.link} className={styles.cardLink} target="_blank" rel="noreferrer">
                  View →
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.badgeGap}>{result.gaps.length}</span>
          Gaps — build these
        </h2>
        <ul className={styles.list}>
          {result.gaps.map((gap) => (
            <li key={gap.id} className={styles.gapCard}>
              <div className={styles.gapHeader}>
                <span className={styles.priority} data-priority={gap.priority}>
                  {priorityLabels[gap.priority]}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{gap.title}</h3>
              <p className={styles.cardSummary}>{gap.description}</p>
              {gap.suggestedApproach && (
                <p className={styles.approach}>
                  <strong>Suggested approach:</strong> {gap.suggestedApproach}
                </p>
              )}
              <Link to={`${ROUTES.BUILD}/${gap.id}`} className={styles.buildLink} state={{ scanId: result.useCaseId }}>
                Start building →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
