import { useMemo, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFeatureFlags } from '@/context/FeatureFlags'
import { useFavorites } from '@/context/FavoritesContext'
import { useSetBreadcrumbs } from '@/context/BreadcrumbContext'
import { getMarketplaceProduct } from '@/services/marketplace'
import { getTypeConfig } from '@/lib/marketplaceTypes'
import type { MarketplaceProduct } from '@/types'
import { ROUTES } from '@/constants'
import styles from './MarketplaceDetail.module.css'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function MarketplaceDetail() {
  const { id } = useParams<{ id: string }>()
  const { flags } = useFeatureFlags()
  const { isFavorite, toggleFavorite } = useFavorites()
  const useMock = flags.useMockMarketplace

  const [product, setProduct] = useState<MarketplaceProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('No product ID')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getMarketplaceProduct(useMock, id)
      .then((p) => {
        if (!cancelled) setProduct(p ?? null)
        if (!cancelled && !p) setError('Product not found')
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product')
          setProduct(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, useMock])

  const breadcrumbs = useMemo(
    () =>
      product
        ? [
            { label: 'Dashboard', path: ROUTES.HOME },
            { label: 'Marketplace', path: ROUTES.MARKETPLACE },
            { label: product.name, path: `/marketplace/${product.id}` },
          ]
        : [],
    [product]
  )
  useSetBreadcrumbs(breadcrumbs)

  if (loading) {
    return (
      <div className={styles.page}>
        <Link to={ROUTES.MARKETPLACE} className={styles.back}>
          ← Marketplace
        </Link>
        <p className={styles.body} aria-busy="true">
          Loading…
        </p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Link to={ROUTES.MARKETPLACE} className={styles.back}>
          ← Marketplace
        </Link>
        <div className={styles.error}>
          <h2 className={styles.errorTitle}>Product not found</h2>
          <p>{error ?? 'This item may have been removed or the link is invalid.'}</p>
          <Link to={ROUTES.MARKETPLACE} className={styles.errorLink}>
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to={ROUTES.MARKETPLACE} className={styles.back}>
        ← Marketplace
      </Link>

      <header className={styles.hero}>
        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${styles.badgeType}`}
            data-type={product.type}
            title={getTypeConfig(product.type).description}
          >
            <span className={styles.badgeTypeIcon} aria-hidden>{getTypeConfig(product.type).icon}</span>
            {getTypeConfig(product.type).label}
          </span>
          <span className={`${styles.badge} ${styles.badgeScope}`} data-scope={product.scope}>
            {product.scope === 'mine' ? 'Mine' : 'Organization'}
          </span>
          {product.status && (
            <span className={`${styles.badge} ${styles.badgeStatus}`} data-status={product.status}>
              {product.status}
            </span>
          )}
        </div>
        <p className={styles.heroTypeDesc}>
          {getTypeConfig(product.type).description}
        </p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{product.name}</h1>
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className={isFavorite(product.id) ? `${styles.favBtn} ${styles.favBtnActive}` : styles.favBtn}
            aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(product.id) ? '★' : '☆'}
          </button>
        </div>
        <p className={styles.lead}>{product.description}</p>
      </header>

      {(product.longDescription ?? product.description) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.body}>
            {product.longDescription ?? product.description}
          </p>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Details</h2>
        <div className={styles.metaGrid}>
          {product.owner && (
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>Owner</p>
              <p className={styles.metaValue}>{product.owner}</p>
            </div>
          )}
          {product.version && (
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>Version</p>
              <p className={styles.metaValue}>v{product.version}</p>
            </div>
          )}
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Created</p>
            <p className={styles.metaValue}>{formatDate(product.createdAt)}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Updated</p>
            <p className={styles.metaValue}>{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </section>

      {product.tags.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tags</h2>
          <div className={styles.tags}>
            {product.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <Link to={`/marketplace/${product.id}/docs`} className={styles.btnPrimary}>
          View documentation →
        </Link>
        {product.link && (
          <a href={product.link} className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
            Open resource
          </a>
        )}
        {product.documentationUrl && (
          <a
            href={product.documentationUrl}
            className={styles.btnSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            External docs
          </a>
        )}
        <Link to={ROUTES.HOME} className={styles.btnSecondary}>
          Use in Dashboard
        </Link>
      </div>
    </div>
  )
}
