import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFeatureFlags } from '@/context/FeatureFlags'
import { useSetBreadcrumbs } from '@/context/BreadcrumbContext'
import { getMarketplaceProduct } from '@/services/marketplace'
import { getTypeConfig } from '@/lib/marketplaceTypes'
import { getDocumentationSections } from '@/content/marketplaceDocs'
import type { MarketplaceProduct } from '@/types'
import type { DocBlock, DocSection } from '@/content/marketplaceDocs'
import { ROUTES } from '@/constants'
import styles from './MarketplaceDocs.module.css'

function Block({ block }: { block: DocBlock }) {
  if (block.type === 'heading') {
    const Tag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3'
    return <Tag className={styles[`h${block.level ?? 2}`]} id={block.text?.toLowerCase().replace(/\s+/g, '-')}>{block.text}</Tag>
  }
  if (block.type === 'paragraph') {
    return <p className={styles.para}>{block.text}</p>
  }
  if (block.type === 'code') {
    return (
      <pre className={styles.pre}>
        <code className={block.language ? styles.code : undefined}>{block.text}</code>
      </pre>
    )
  }
  if (block.type === 'list' && block.items) {
    return (
      <ul className={styles.ul}>
        {block.items.map((item, i) => (
          <li key={i} className={styles.li}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'note') {
    return <div className={styles.note}>{block.text}</div>
  }
  return null
}

function SectionContent({ section }: { section: DocSection }) {
  return (
    <section id={section.id} className={styles.docSection}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      <div className={styles.blocks}>
        {section.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  )
}

export function MarketplaceDocs() {
  const { id } = useParams<{ id: string }>()
  const { flags } = useFeatureFlags()
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

  const sections = product ? getDocumentationSections(product.id, product.type) : []

  const breadcrumbs = useMemo(
    () =>
      product
        ? [
            { label: 'Dashboard', path: ROUTES.HOME },
            { label: 'Marketplace', path: ROUTES.MARKETPLACE },
            { label: product.name, path: `/marketplace/${product.id}` },
            { label: 'Documentation' },
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
      <Link to={`/marketplace/${product.id}`} className={styles.back}>
        ← Back to {product.name}
      </Link>

      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.badge} data-type={product.type} title={getTypeConfig(product.type).description}>
            <span className={styles.badgeIcon} aria-hidden>{getTypeConfig(product.type).icon}</span>
            {getTypeConfig(product.type).label}
          </span>
          <Link to={ROUTES.DOCS} className={styles.allDocsLink}>
            All documentation →
          </Link>
        </div>
        <h1 className={styles.title}>Documentation — {product.name}</h1>
      </header>

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Documentation sections">
          <ul className={styles.navList}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.navLink}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className={styles.main}>
          {sections.map((s) => (
            <SectionContent key={s.id} section={s} />
          ))}
        </main>
      </div>
    </div>
  )
}
