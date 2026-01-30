import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import styles from './ProfileMenu.module.css'

const THEME_KEY = 'use-case-scanner:theme'
type Theme = 'light' | 'dark' | 'system'

function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // ignore
  }
  return 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  function handleSignOut() {
    setOpen(false)
    logout()
    navigate(ROUTES.LANDING)
  }

  const displayName = user?.name ?? user?.email ?? 'You'

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Profile menu"
      >
        <span className={styles.avatar} aria-hidden>
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden>
          ▼
        </span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.menuLabel}>Account</div>
          <Link
            to={ROUTES.SETTINGS}
            className={`${styles.menuItem} ${styles.menuItemLink}`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile &amp; account
          </Link>

          <div className={styles.divider} aria-hidden />

          <div className={styles.menuLabel}>Preferences</div>
          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>Theme</span>
            <div className={styles.themeToggle} role="group" aria-label="Theme">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.themeOption} ${theme === t ? styles.themeOptionActive : ''}`}
                  onClick={() => setTheme(t)}
                  aria-pressed={theme === t}
                >
                  {t === 'system' ? 'Auto' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <Link
            to={ROUTES.SETTINGS}
            className={`${styles.menuItem} ${styles.menuItemLink}`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Notifications
          </Link>

          <div className={styles.divider} aria-hidden />

          <button
            type="button"
            className={styles.menuItem}
            role="menuitem"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
