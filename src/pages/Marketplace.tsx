import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFeatureFlags } from '@/context/FeatureFlags'
import { useFavorites } from '@/context/FavoritesContext'
import { getMarketplaceProducts, MARKETPLACE_PRODUCT_TYPES, type MarketplaceFilters, type MarketplaceSort } from '@/services/marketplace'
import { getTypeConfig } from '@/lib/marketplaceTypes'
import type { MarketplaceProduct, MarketplaceScope } from '@/types'
import { Skeleton } from '@/components/Skeleton'
import styles from './Marketplace.module.css'

const SCOPE_OPTIONS: { value: MarketplaceScope | 'all'; label: string }[] = [
  { value: 'mine', label: 'Mine' },
  { value: 'organization', label: 'Organization' },
  { value: 'all', label: 'All' },
]

const SORT_OPTIONS: { value: MarketplaceSort; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'type', label: 'Type' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

export function Marketplace() {
  const { flags } = useFeatureFlags()
  const { isFavorite, toggleFavorite } = useFavorites()
  const useMock = flags.useMockMarketplace

  const [filters, setFilters] = useState<MarketplaceFilters>({
    scope: 'mine',
    types: [],
    search: '',
    sort: 'name-asc',
  })
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getMarketplaceProducts(useMock, filters)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load marketplace')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [useMock, filters.scope, filters.types.join(','), filters.search, filters.sort])

  const toggleType = (type: MarketplaceProduct['type']) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))
  }

  const hasActiveFilters = useMemo(
    () => filters.types.length > 0 || filters.search.trim().length > 0,
    [filters.types.length, filters.search]
  )

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      types: [],
      search: '',
    }))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Marketplace</h1>
        <p className={styles.subtitle}>
          APIs, capabilities, repos, applications, databases, and more. Default: <strong>Mine</strong> first; switch to Organization or All.
        </p>
      </header>

      {/* Scope: Mine | Organization | All */}
      <section className={styles.scopeSection}>
        <span className={styles.filterLabel}>Scope</span>
        <div className={styles.scopeTabs}>
          {SCOPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={filters.scope === value ? styles.scopeActive : styles.scopeTab}
              onClick={() => setFilters((prev) => ({ ...prev, scope: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className={styles.searchSection}>
        <input
          type="search"
          placeholder="Search by name, description, or tags..."
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className={styles.searchInput}
        />
      </section>

      {/* Type filter + Sort */}
      <section className={styles.toolbar}>
        <div className={styles.typeFilter}>
          <span className={styles.filterLabel}>Type</span>
          <div className={styles.typeChips}>
            {MARKETPLACE_PRODUCT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={filters.types.includes(type) ? styles.chipActive : styles.chip}
                onClick={() => toggleType(type)}
              >
                {getTypeConfig(type).icon} {getTypeConfig(type).label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sortRow}>
          <label className={styles.sortLabel}>
            Sort
            <select
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as MarketplaceSort }))}
              className={styles.sortSelect}
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className={styles.clearBtn}>
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      {!useMock && (
        <p className={styles.banner}>
          Mock marketplace is off. Connect your catalog in Settings or turn on “Use mock marketplace data” to see products.
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.skeletonGrid} aria-busy="true" aria-live="polite">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton height={14} className={styles.skeletonLine} />
              <Skeleton height={12} width="60%" className={styles.skeletonLine} />
              <Skeleton height={40} className={styles.skeletonBlock} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className={styles.empty}>
          No products match. Try changing scope, search, or type filters.
        </p>
      ) : (
        <>
          <p className={styles.count}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <ul className={styles.grid}>
            {products.map((p) => {
              const typeConfig = getTypeConfig(p.type)
              return (
              <li key={p.id} className={styles.card} data-type={p.type}>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.cardType}
                    data-type={p.type}
                    title={typeConfig.description}
                    aria-label={`Type: ${typeConfig.label} — ${typeConfig.description}`}
                  >
                    <span className={styles.cardTypeIcon} aria-hidden>{typeConfig.icon}</span>
                    <span>{typeConfig.label}</span>
                  </span>
                  <div className={styles.cardHeaderRight}>
                    <span className={styles.cardScope} data-scope={p.scope}>
                      {p.scope === 'mine' ? 'Mine' : 'Organization'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(p)
                      }}
                      className={isFavorite(p.id) ? `${styles.favBtn} ${styles.favBtnActive}` : styles.favBtn}
                      aria-label={isFavorite(p.id) ? 'Remove from favorites' : 'Add to favorites'}
                      title={isFavorite(p.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite(p.id) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
                <Link to={`/marketplace/${p.id}`} className={styles.cardLinkWrap}>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <p className={styles.cardDesc}>{p.description}</p>
                  {p.tags.length > 0 && (
                    <div className={styles.tags}>
                      {p.tags.map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.version ?? p.owner) && (
                    <p className={styles.meta}>
                      {p.version && <span>v{p.version}</span>}
                      {p.owner && <span>{p.owner}</span>}
                    </p>
                  )}
                  <span className={styles.cardLink}>View details →</span>
                </Link>
              </li>
            )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
