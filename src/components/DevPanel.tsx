import { useState, useEffect, useCallback } from 'react'
import { useFeatureFlags } from '@/context/FeatureFlags'
import type { FeatureFlags as FeatureFlagsType } from '@/types'
import styles from './DevPanel.module.css'

const HOTKEY = { key: 'd', ctrl: true, shift: true }

/** Human-readable labels for feature flags. Add new flags here for a friendly name. */
const FLAG_LABELS: Partial<Record<keyof FeatureFlagsType, string>> = {
  useMockMarketplace: 'Use mock marketplace data',
}

function getFlagLabel(key: keyof FeatureFlagsType): string {
  return FLAG_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

function getTheme(): 'light' | 'dark' {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? 'light' : 'dark'
}

export function DevPanel() {
  const { flags, setFlag } = useFeatureFlags()
  const [open, setOpen] = useState(false)
  const [theme, setThemeState] = useState<'light' | 'dark'>(getTheme)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === HOTKEY.key &&
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey
      ) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    },
    []
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!open) return
    setThemeState(getTheme())
  }, [open])

  const setTheme = (value: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', value)
    setThemeState(value)
  }

  if (!open) return null

  const flagEntries = Object.entries(flags) as [keyof FeatureFlagsType, FeatureFlagsType[keyof FeatureFlagsType]][]

  return (
    <div className={styles.backdrop} onClick={() => setOpen(false)} role="dialog" aria-label="Dev panel">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Dev panel</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={styles.close}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className={styles.hint}>
          <strong>Hotkey:</strong> <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> (Mac: <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>) — same key to open/close
        </p>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Theme</h3>
          <div className={styles.themeRow}>
            <button
              type="button"
              className={theme === 'light' ? styles.themeActive : styles.themeBtn}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={theme === 'dark' ? styles.themeActive : styles.themeBtn}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Feature flags</h3>
          <ul className={styles.list}>
            {flagEntries.map(([key, value]) => (
              <li key={key} className={styles.row}>
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => setFlag(key, e.target.checked as FeatureFlagsType[typeof key])}
                    className={styles.checkbox}
                  />
                  <span>{getFlagLabel(key)}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Add new flags in <code>src/types.ts</code> (FeatureFlags) and defaults in <code>src/context/FeatureFlags.tsx</code> — they appear here automatically.</p>
        </section>
      </div>
    </div>
  )
}
