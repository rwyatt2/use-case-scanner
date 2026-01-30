import { useState, useRef, useEffect } from 'react'
import styles from './ChatInput.module.css'

const ACCEPT =
  '.txt,.md,.json,.ts,.tsx,.js,.jsx,.py,.csv,.html,.css,.xml,.yaml,.yml,.sh,.env,.pdf,image/png,image/jpeg,image/webp,image/gif'

type ChatInputProps = {
  onSend: (content: string, options?: { asDocument?: boolean; files?: File[] }) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Describe a use case or paste text for recommendations…',
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if ((!trimmed && files.length === 0) || disabled) return
    const asDocument =
      files.length > 0 ||
      (trimmed.length > 400 &&
        (trimmed.includes('\n') || trimmed.split(/\s+/).length > 50))
    onSend(trimmed || 'Attached files for analysis.', { asDocument, files: files.length > 0 ? files : undefined })
    setValue('')
    setFiles([])
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length) setFiles((prev) => [...prev, ...selected].slice(0, 20))
    e.target.value = ''
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className={styles.fileChip}>
              <span className={styles.fileChipName} title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                className={styles.fileChipRemove}
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.row}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className={styles.hiddenInput}
          onChange={onFileChange}
          aria-label="Attach files"
          tabIndex={-1}
        />
        <button
          type="button"
          className={styles.attachBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach files (code, docs, images)"
          title="Attach code, docs, or images"
        >
          <AttachIcon />
        </button>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message"
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={disabled || (!value.trim() && files.length === 0)}
          aria-label="Send"
        >
          Send
        </button>
      </div>
    </form>
  )
}

function AttachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}
