import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useBreadcrumbs } from '@/context/BreadcrumbContext'
import { ROUTES } from '@/constants'
import styles from './Breadcrumbs.module.css'

const PATH_LABELS: Record<string, string> = {
  [ROUTES.HOME]: 'Dashboard',
  [ROUTES.MARKETPLACE]: 'Marketplace',
  [ROUTES.DOCS]: 'Documentation',
  [ROUTES.DOCUMENTS]: 'Documents',
  [ROUTES.DOCUMENTS_RECOMMENDATIONS]: 'Recommendations',
  [ROUTES.SCAN]: 'New scan',
  [ROUTES.SETTINGS]: 'Settings',
}

function pathnameToDefaultItems(pathname: string): { label: string; path?: string }[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []

  const items: { label: string; path?: string }[] = []

  for (let i = 0; i < segments.length; i++) {
    const path = '/' + segments.slice(0, i + 1).join('/')
    const label = PATH_LABELS[path]
    if (label) {
      items.push({ label, path })
    } else if (segments[i] === 'docs') {
      items.push({ label: 'Documentation', path })
    } else if (segments[0] === 'marketplace' && i === 1) {
      items.push({ label: 'Item', path })
    } else if (segments[0] === 'results' && i === 1) {
      items.push({ label: 'Scan results', path })
    } else if (segments[0] === 'build' && i === 1) {
      items.push({ label: 'Build capability', path })
    } else {
      items.push({ label: segments[i], path })
    }
  }

  if (pathname !== ROUTES.HOME && items.length > 0) {
    return [{ label: 'Dashboard', path: ROUTES.HOME }, ...items]
  }
  return items
}

export function Breadcrumbs() {
  const location = useLocation()
  const ctx = useBreadcrumbs()

  const items = useMemo(() => {
    if (location.pathname === ROUTES.HOME) return []
    if (ctx?.items && ctx.items.length > 0) return ctx.items
    return pathnameToDefaultItems(location.pathname)
  }, [ctx?.items, location.pathname])

  if (items.length === 0) return null

  return (
    <nav className={styles.wrapper} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            {i > 0 && <span className={styles.sep} aria-hidden>/</span>}
            {i < items.length - 1 && item.path ? (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
