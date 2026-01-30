import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFeatureFlags } from '@/context/FeatureFlags'
import { getMarketplaceProducts } from '@/services/marketplace'
import { getTypeConfig } from '@/lib/marketplaceTypes'
import type { MarketplaceProduct } from '@/types'
import { ROUTES } from '@/constants'
import styles from './Docs.module.css'

function getMarketplaceDocsPath(id: string): string {
  return `/marketplace/${id}/docs`
}

export function Docs() {
  const { flags } = useFeatureFlags()
  const useMock = flags.useMockMarketplace
  const [products, setProducts] = useState<MarketplaceProduct[]>([])

  useEffect(() => {
    let cancelled = false
    getMarketplaceProducts(useMock, {
      scope: 'all',
      types: [],
      search: '',
      sort: 'name-asc',
    })
      .then((list) => {
        if (!cancelled) setProducts(list)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
    return () => {
      cancelled = true
    }
  }, [useMock])

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Documentation</h1>
        <p className={styles.subtitle}>
          Product guides and marketplace item documentation. One place for how things work and how to use them.
        </p>
      </header>

      <div className={styles.grid}>
        <section className={styles.section} aria-labelledby="product-docs-heading">
          <h2 id="product-docs-heading" className={styles.sectionTitle}>
            Product documentation
          </h2>
          <p className={styles.sectionDesc}>
            How to use Use Case Scanner: scans, marketplace, and workflows.
          </p>
          <ul className={styles.docList}>
            <li>
              <Link to={ROUTES.HOME} className={styles.docCard}>
                <span className={styles.docCardTitle}>Getting started</span>
                <span className={styles.docCardDesc}>Dashboard, chat, and your first scan</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.SCAN} className={styles.docCard}>
                <span className={styles.docCardTitle}>Scans</span>
                <span className={styles.docCardDesc}>Describe a use case and run a scan</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.MARKETPLACE} className={styles.docCard}>
                <span className={styles.docCardTitle}>Marketplace</span>
                <span className={styles.docCardDesc}>Discover APIs, services, and capabilities</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.DOCUMENTS} className={styles.docCard}>
                <span className={styles.docCardTitle}>Documents</span>
                <span className={styles.docCardDesc}>Add docs and get AI-recommended use cases</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.SETTINGS} className={styles.docCard}>
                <span className={styles.docCardTitle}>Settings</span>
                <span className={styles.docCardDesc}>Catalog, integrations, and preferences</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="marketplace-docs-heading">
          <h2 id="marketplace-docs-heading" className={styles.sectionTitle}>
            Marketplace item documentation
          </h2>
          <p className={styles.sectionDesc}>
            Technical docs for each API, service, model, and capability in the marketplace.
          </p>
          {products.length === 0 ? (
            <p className={styles.empty}>
              No marketplace items yet. Turn on mock data in Settings or connect your catalog.
            </p>
          ) : (
            <ul className={styles.docList}>
              {products.map((p) => {
                const typeConfig = getTypeConfig(p.type)
                return (
                  <li key={p.id}>
                    <Link to={getMarketplaceDocsPath(p.id)} className={styles.docCard}>
                      <span className={styles.docCardMeta} data-type={p.type}>
                        <span className={styles.docCardIcon} aria-hidden>{typeConfig.icon}</span>
                        {typeConfig.label}
                      </span>
                      <span className={styles.docCardTitle}>{p.name}</span>
                      <span className={styles.docCardDesc}>{p.description}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
