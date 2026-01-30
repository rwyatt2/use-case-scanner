import { useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { getStoredScan } from '@/services/scan'
import type { CapabilityGap } from '@/types'
import styles from './BuildCapability.module.css'

/** Extension point: call your ticketing/spec API or open external tool */
function exportSpec(gap: CapabilityGap) {
  const spec = {
    title: gap.title,
    description: gap.description,
    priority: gap.priority,
    suggestedApproach: gap.suggestedApproach,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `capability-spec-${gap.id.slice(0, 8)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function BuildCapability() {
  const { gapId } = useParams<{ gapId: string }>()
  const location = useLocation()
  const scanId = (location.state as { scanId?: string } | null)?.scanId
  const result = scanId ? getStoredScan(scanId) : null
  const gap = result?.gaps.find((g) => g.id === gapId)
  const [exported, setExported] = useState(false)

  if (!gap) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Gap not found. Start from a scan result.</p>
        <Link to="/" className={styles.link}>Dashboard</Link>
      </div>
    )
  }

  function handleExport() {
    exportSpec(gap!)
    setExported(true)
  }

  return (
    <div className={styles.page}>
      <Link to={scanId ? `${ROUTES.RESULTS}/${scanId}` : ROUTES.HOME} className={styles.back}>
        ← Back to results
      </Link>

      <header className={styles.header}>
        <span className={styles.priority} data-priority={gap.priority}>
          {gap.priority} priority
        </span>
        <h1 className={styles.title}>{gap.title}</h1>
        <p className={styles.description}>{gap.description}</p>
      </header>

      {gap.suggestedApproach && (
        <section className={styles.section}>
          <h2>Suggested approach</h2>
          <p>{gap.suggestedApproach}</p>
        </section>
      )}

      <section className={styles.actions}>
        <h2>Start building</h2>
        <p className={styles.actionsDesc}>
          Export a spec for your team, or integrate with your ticketing/CI (configure in Settings).
        </p>
        <div className={styles.buttons}>
          <button type="button" onClick={handleExport} className={styles.btnPrimary}>
            {exported ? 'Spec exported' : 'Export spec (JSON)'}
          </button>
          <a
            href="#"
            className={styles.btnSecondary}
            onClick={(e) => {
              e.preventDefault()
              // Extension point: open Jira, Linear, GitHub Issue, etc.
              alert('Configure your ticketing system in Settings to create a ticket from here.')
            }}
          >
            Create ticket (configure in Settings)
          </a>
        </div>
      </section>

      <p className={styles.footer}>
        <Link to={ROUTES.SETTINGS}>Settings</Link> — Connect APIs, docs, repos, and ticketing for full integration.
      </p>
    </div>
  )
}
