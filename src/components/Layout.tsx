import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { BreadcrumbProvider } from '@/context/BreadcrumbContext'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProfileMenu } from '@/components/ProfileMenu'
import { NewUseCasePane } from '@/components/NewUseCasePane'
import styles from './Layout.module.css'

export function Layout() {
  const location = useLocation()
  const [newUseCasePaneOpen, setNewUseCasePaneOpen] = useState(false)
  const isDashboard = location.pathname === ROUTES.HOME

  return (
    <div className={styles.wrapper}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <header className={styles.header}>
        <Link to={ROUTES.LANDING} className={styles.logo}>
          <span className={styles.logoIcon}>◇</span>
          Use Case Scanner
        </Link>
        <nav className={styles.headerNav}>
          <button
            type="button"
            className={styles.newUseCaseBtn}
            onClick={() => setNewUseCasePaneOpen(true)}
            title="Start a new use case — create service, app, or capability"
          >
            New use case
          </button>
          <ProfileMenu />
        </nav>
      </header>
      <BreadcrumbProvider>
        <main
          id="main-content"
          className={`${styles.main} ${isDashboard ? styles.mainFull : styles.mainScroll}`}
          tabIndex={-1}
        >
          {isDashboard ? (
            <Outlet />
          ) : (
            <div className={styles.mainInner}>
              <div className={styles.breadcrumbStrip}>
                <Breadcrumbs />
              </div>
              <Outlet />
            </div>
          )}
        </main>
      </BreadcrumbProvider>
      <NewUseCasePane
        isOpen={newUseCasePaneOpen}
        onClose={() => setNewUseCasePaneOpen(false)}
      />
      <footer className={styles.footer}>
        <span>Ship faster · Avoid duplicate work · One source of truth · Read-only · No lock-in</span>
      </footer>
    </div>
  )
}
