import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { runScan, storeScan } from '@/services/scan'
import { addMyUseCase } from '@/lib/myUseCases'
import { ApiError } from '@/lib/api'
import styles from './NewUseCase.module.css'

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.message === 'Request timed out') return 'Request timed out. Check your connection and try again.'
    if (err.status === 502 || err.status === 503) return 'Service temporarily unavailable. Please try again.'
    if (err.status === 401) return 'Authentication required. Configure your API or auth.'
  }
  return err instanceof Error ? err.message : 'Scan failed. Please try again.'
}

type LocationState = { suggestedTitle?: string; suggestedDescription?: string }

export function NewUseCase() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState
  const [title, setTitle] = useState(state.suggestedTitle ?? '')
  const [description, setDescription] = useState(state.suggestedDescription ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (state.suggestedTitle) setTitle(state.suggestedTitle)
    if (state.suggestedDescription) setDescription(state.suggestedDescription)
  }, [state.suggestedTitle, state.suggestedDescription])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }
    setLoading(true)
    try {
      const result = await runScan({ title: title.trim(), description: description.trim() })
      storeScan(result)
      addMyUseCase(result.useCaseId, title.trim(), description.trim())
      navigate(`${ROUTES.RESULTS}/${result.useCaseId}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>New use case scan</h1>
      <p className={styles.subtitle}>
        Describe the AI use case you want to support. We’ll scan your connected systems for existing capabilities and identify gaps.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Use case title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Customer intent classification from chat"
            className={styles.input}
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want the AI to do, inputs/outputs, and any constraints..."
            className={styles.textarea}
            rows={5}
            disabled={loading}
          />
        </label>
        {error && (
          <div className={styles.errorBlock} role="alert">
            <p className={styles.error}>{error}</p>
            <button type="button" onClick={() => setError(null)} className={styles.dismissError}>
              Dismiss
            </button>
          </div>
        )}
        <button type="submit" className={styles.submit} disabled={loading} aria-busy={loading}>
          {loading ? 'Scanning…' : 'Run scan'}
        </button>
      </form>
    </div>
  )
}
