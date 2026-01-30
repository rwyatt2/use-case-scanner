import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { runScan, storeScan } from '@/services/scan'
import styles from './NewUseCase.module.css'

export function NewUseCase() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      navigate(`/results/${result.useCaseId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed. Please try again.')
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
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Scanning…' : 'Run scan'}
        </button>
      </form>
    </div>
  )
}
