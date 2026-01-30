import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DocumentInput } from '@/types'
import { ROUTES } from '@/constants'
import { analyzeDocuments, readFileAsText } from '@/services/documents'
import styles from './AddDocuments.module.css'

export function AddDocuments() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<DocumentInput[]>([])
  const [pastedText, setPastedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addPasted() {
    const text = pastedText.trim()
    if (!text) return
    setDocuments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: 'Pasted text',
        type: 'pasted',
        content: text,
        addedAt: new Date().toISOString(),
      },
    ])
    setPastedText('')
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const content = await readFileAsText(file)
        setDocuments((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            type: 'file',
            content,
            addedAt: new Date().toISOString(),
          },
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not read file')
      }
    }
    e.target.value = ''
  }

  function removeDoc(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  async function handleAnalyze() {
    setError(null)
    if (documents.length === 0) {
      setError('Add at least one document (upload files or paste text).')
      return
    }
    setLoading(true)
    try {
      const suggested = await analyzeDocuments(documents)
      sessionStorage.setItem('suggestedUseCases', JSON.stringify(suggested))
      navigate(ROUTES.DOCUMENTS_RECOMMENDATIONS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add documents</h1>
      <p className={styles.subtitle}>
        Upload files or paste text. AI will read them and recommend use cases you can then choose to scan.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upload files</h2>
        <input
          type="file"
          multiple
          accept=".txt,.md,.json,.csv,.html"
          onChange={handleFiles}
          className={styles.fileInput}
          disabled={loading}
        />
        <p className={styles.hint}>Plain text, Markdown, JSON, CSV, or HTML. Max size depends on your backend.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Or paste text</h2>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste document content here..."
          className={styles.textarea}
          rows={4}
          disabled={loading}
        />
        <button type="button" onClick={addPasted} className={styles.addPasted} disabled={loading || !pastedText.trim()}>
          Add pasted text
        </button>
      </section>

      {documents.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Documents added ({documents.length})</h2>
          <ul className={styles.docList}>
            {documents.map((doc) => (
              <li key={doc.id} className={styles.docItem}>
                <span className={styles.docName}>{doc.name}</span>
                <span className={styles.docMeta}>{doc.type} · {doc.content.length} chars</span>
                <button type="button" onClick={() => removeDoc(doc.id)} className={styles.removeBtn} disabled={loading}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleAnalyze}
          className={styles.analyzeBtn}
          disabled={loading || documents.length === 0}
        >
          {loading ? 'Analyzing…' : 'Get use case recommendations'}
        </button>
      </div>
    </div>
  )
}
