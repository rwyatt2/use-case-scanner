import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { runScan, storeScan } from '@/services/scan'
import { addMyUseCase } from '@/lib/myUseCases'
import { ApiError } from '@/lib/api'
import styles from './NewUseCasePane.module.css'

const STEPS = ['Describe', 'Scan', 'Create'] as const
const CAPABILITY_TYPES = ['service', 'app', 'capability', 'api'] as const

function exportSpecFromForm(name: string, type: string, description: string) {
  const spec = {
    name,
    type,
    description,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `capability-spec-${name.replace(/\s+/g, '-').toLowerCase().slice(0, 24)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  return err instanceof Error ? err.message : 'Something went wrong.'
}

type NewUseCasePaneProps = {
  isOpen: boolean
  onClose: () => void
  /** Prefill from chat or elsewhere */
  initialTitle?: string
  initialDescription?: string
}

export function NewUseCasePane({
  isOpen,
  onClose,
  initialTitle = '',
  initialDescription = '',
}: NewUseCasePaneProps) {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [scanId, setScanId] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [createName, setCreateName] = useState('')
  const [createType, setCreateType] = useState<string>(CAPABILITY_TYPES[0])
  const [createDesc, setCreateDesc] = useState('')
  const [exported, setExported] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialTitle) setTitle(initialTitle)
      if (initialDescription) setDescription(initialDescription)
    }
  }, [isOpen, initialTitle, initialDescription])

  function reset() {
    setStep(0)
    setTitle(initialTitle)
    setDescription(initialDescription)
    setScanId(null)
    setScanning(false)
    setScanError(null)
    setCreateName('')
    setCreateType(CAPABILITY_TYPES[0])
    setCreateDesc('')
    setExported(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleRunScan() {
    if (!title.trim()) return
    setScanning(true)
    setScanError(null)
    try {
      const result = await runScan({
        title: title.trim(),
        description: description.trim() || title.trim(),
      })
      storeScan(result)
      addMyUseCase(result.useCaseId, title.trim(), description.trim() || title.trim())
      setScanId(result.useCaseId)
    } catch (err) {
      setScanError(getErrorMessage(err))
    } finally {
      setScanning(false)
    }
  }

  function handleExportSpec() {
    exportSpecFromForm(
      createName.trim() || title.trim(),
      createType,
      createDesc.trim() || description.trim()
    )
    setExported(true)
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleClose}
        aria-hidden
      />
      <aside
        className={`${styles.pane} ${isOpen ? styles.paneOpen : ''}`}
        aria-label="New use case — create service, app, or capability"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>New use case</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close pane"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.progress}>
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`${styles.progressDot} ${i <= step ? styles.progressDotActive : ''}`}
                aria-hidden
              />
            ))}
          </div>

          {/* Step 1: Describe */}
          <section className={`${styles.step} ${step === 0 ? styles.stepActive : ''}`}>
            <p className={styles.stepTitle}>Step 1 — Describe</p>
            <label className={styles.label}>
              Use case title
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Customer intent classification"
              />
            </label>
            <label className={styles.label}>
              Description
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What you want the AI to do, inputs/outputs, constraints..."
              />
            </label>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setStep(1)}
                disabled={!title.trim()}
              >
                Next
              </button>
            </div>
          </section>

          {/* Step 2: Scan (optional) */}
          <section className={`${styles.step} ${step === 1 ? styles.stepActive : ''}`}>
            <p className={styles.stepTitle}>Step 2 — Scan (optional)</p>
            <p className={styles.summary}>
              Scan your infrastructure to see what already supports this use case and what’s missing.
            </p>
            {scanError && <p className={styles.error} role="alert">{scanError}</p>}
            {scanId && (
              <p className={styles.success}>
                Scan complete.{' '}
                <Link to={`${ROUTES.RESULTS}/${scanId}`} onClick={handleClose}>
                  View results →
                </Link>
              </p>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleRunScan}
                disabled={scanning || !title.trim()}
              >
                {scanning ? 'Scanning…' : 'Run scan'}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => setStep(2)}>
                Skip → Create
              </button>
            </div>
          </section>

          {/* Step 3: Create capability */}
          <section className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
            <p className={styles.stepTitle}>Step 3 — Create</p>
            <p className={styles.summary}>
              Define the new service, app, or capability to support your use case. Export a spec or create a ticket.
            </p>
            <label className={styles.label}>
              Name
              <input
                type="text"
                className={styles.input}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder={title.trim() || 'My capability'}
              />
            </label>
            <label className={styles.label}>
              Type
              <select
                className={styles.select}
                value={createType}
                onChange={(e) => setCreateType(e.target.value)}
              >
                {CAPABILITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Description
              <textarea
                className={styles.textarea}
                value={createDesc}
                onChange={(e) => setCreateDesc(e.target.value)}
                placeholder={description.trim() || 'What this capability does...'}
              />
            </label>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleExportSpec}
              >
                {exported ? 'Spec exported' : 'Export spec (JSON)'}
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={(e) => {
                  e.preventDefault()
                  alert('Configure your ticketing system in Settings to create a ticket from here.')
                }}
              >
                Create ticket
              </button>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
