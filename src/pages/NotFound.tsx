import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import styles from './NotFound.module.css'

export function NotFound() {
  const { pathname } = useLocation()
  const looksLikeDocs = pathname.includes('docs') || pathname.includes('documentation')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.code} aria-hidden>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className={styles.actions}>
          {looksLikeDocs && (
            <Link to={ROUTES.DOCS} className={styles.cta}>
              Go to documentation
            </Link>
          )}
          <Link to={ROUTES.HOME} className={looksLikeDocs ? styles.ctaSecondary : styles.cta}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
