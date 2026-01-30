import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { SuggestedUseCase } from '@/types'
import { ROUTES, STORAGE_KEYS } from '@/constants'
import { runScan, storeScan } from '@/services/scan'
import styles from './RecommendedUseCases.module.css'

function getStoredSuggestions(): SuggestedUseCase[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.SUGGESTED_USE_CASES)
    return raw ? (JSON.parse(raw) as SuggestedUseCase[]) : []
  } catch {
    return []
  }
}

export function RecommendedUseCases() {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<SuggestedUseCase[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSuggestions(getStoredSuggestions())
  }, [])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    if (selected.size === suggestions.length) setSelected(new Set())
    else setSelected(new Set(suggestions.map((s) => s.id)))
  }

  async function scanSelected() {
    const ids = Array.from(selected)
    if (ids.length === 0) {
      setError('Select at least one use case to scan.')
      return
    }
    setError(null)
    setScanning(true)
    try {
      // Scan the first selected use case; user can scan others from here after
      const id = ids[0]
      const useCase = suggestions.find((s) => s.id === id)
      if (!useCase) return
      const result = await runScan({ title: useCase.title, description: useCase.description })
      storeScan(result)
      navigate(`${ROUTES.RESULTS}/${result.useCaseId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed. Try again.')
    } finally {
      setScanning(false)
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>No recommendations found. Add documents first.</p>
        <Link to={ROUTES.DOCUMENTS} className={styles.link}>
          Add documents
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Recommended use cases</h1>
      <p className={styles.subtitle}>
        AI read your documents and suggested these use cases. Select the ones you want to scan, or try again with different documents.
      </p>

      <div className={styles.toolbar}>
        <button type="button" onClick={selectAll} className={styles.selectAll}>
          {selected.size === suggestions.length ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <ul className={styles.list}>
        {suggestions.map((s) => (
          <li key={s.id} className={styles.card}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={selected.has(s.id)}
                onChange={() => toggle(s.id)}
                className={styles.checkbox}
                disabled={scanning}
              />
              <span className={styles.cardTitle}>{s.title}</span>
            </label>
            <p className={styles.description}>{s.description}</p>
            {(s.confidence != null || s.sourceHint) && (
              <p className={styles.meta}>
                {s.confidence != null && (
                  <span className={styles.confidence}>{s.confidence}% match</span>
                )}
                {s.sourceHint && <span className={styles.hint}>{s.sourceHint}</span>}
              </p>
            )}
          </li>
        ))}
      </ul>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={scanSelected}
          className={styles.scanBtn}
          disabled={scanning || selected.size === 0}
        >
          {scanning ? 'Scanning…' : `Scan selected (${selected.size})`}
        </button>
        <Link to={ROUTES.DOCUMENTS} className={styles.tryAgain}>
          Try again with different documents
        </Link>
      </div>
    </div>
  )
}
