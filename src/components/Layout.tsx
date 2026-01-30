import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

interface LayoutProps {
  children: React.ReactNode
}

const nav = [
  { path: '/', label: 'Dashboard' },
  { path: '/documents', label: 'Add documents' },
  { path: '/scan', label: 'New scan' },
  { path: '/settings', label: 'Settings' },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◇</span>
          Use Case Scanner
        </Link>
        <nav className={styles.nav}>
          {nav.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={
              (path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(path + '/'))
                ? styles.navActive
                : styles.navLink
            }
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>Enterprise AI Discovery · Read-only scan · Minimal risk</span>
      </footer>
    </div>
  )
}
