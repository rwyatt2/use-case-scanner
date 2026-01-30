import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES, STORAGE_KEYS } from '@/constants'
import { getStoredScan } from '@/services/scan'
import { getMyUseCases } from '@/lib/myUseCases'
import { useChat } from '@/context/ChatContext'
import { useFavorites } from '@/context/FavoritesContext'
import { ChatMessageList } from '@/components/ChatMessageList'
import { ChatInput } from '@/components/ChatInput'
import styles from './Dashboard.module.css'

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function UseCaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  )
}
function RecentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function getRecentScanIds(): string[] {
  const ids: string[] = []
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key?.startsWith(STORAGE_KEYS.SCAN_PREFIX)) {
        const id = key.slice(STORAGE_KEYS.SCAN_PREFIX.length)
        if (id) ids.push(id)
      }
    }
    return ids.slice(-5).reverse()
  } catch {
    return []
  }
}

export function Dashboard() {
  const { messages, sendMessage, clearMessages, isLoading } = useChat()
  const { favorites } = useFavorites()

  const recentIds = useMemo(getRecentScanIds, [])
  const recentScans = useMemo(
    () =>
      recentIds
        .map((id) => {
          const result = getStoredScan(id)
          return result ? { id, summary: result.summary } : null
        })
        .filter(Boolean) as { id: string; summary: string }[],
    [recentIds]
  )

  const myUseCases = useMemo(getMyUseCases, [])

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Quick access">
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarHeaderIcon} aria-hidden>◇</span>
            <span>Quick access</span>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarBlock}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon} aria-hidden><StarIcon /></span>
                Favorites
              </h2>
              {favorites.length > 0 ? (
                <ul className={styles.sidebarList}>
                  {favorites.slice(0, 8).map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/marketplace/${p.id}`}
                        className={styles.sidebarLink}
                        title={p.description}
                      >
                        <span className={styles.sidebarLinkTruncate}>{p.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyBlock}>
                  <p className={styles.emptyText}>Star items in Marketplace</p>
                  <Link to={ROUTES.MARKETPLACE} className={styles.emptyLink}>Go to Marketplace →</Link>
                </div>
              )}
            </div>

            <div className={styles.sidebarBlock}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon} aria-hidden><UseCaseIcon /></span>
                My use cases
              </h2>
              {myUseCases.length > 0 ? (
                <ul className={styles.sidebarList}>
                  {myUseCases.slice(0, 5).map((uc) => (
                    <li key={uc.scanId}>
                      <Link
                        to={`${ROUTES.RESULTS}/${uc.scanId}`}
                        className={styles.sidebarLink}
                        title={uc.description}
                      >
                        <span className={styles.sidebarLinkTruncate}>{uc.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyBlock}>
                  <p className={styles.emptyText}>Scans you run appear here</p>
                  <Link to={ROUTES.SCAN} className={styles.emptyLink}>New scan →</Link>
                </div>
              )}
            </div>

            <div className={styles.sidebarBlock}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon} aria-hidden><RecentIcon /></span>
                Recent scans
              </h2>
              {recentScans.length > 0 ? (
                <ul className={styles.sidebarList}>
                  {recentScans.map(({ id, summary }) => (
                    <li key={id}>
                      <Link
                        to={`${ROUTES.RESULTS}/${id}`}
                        className={styles.sidebarLink}
                        title={summary}
                      >
                        <span className={styles.sidebarLinkTruncate}>
                          {summary.slice(0, 40)}
                          {summary.length > 40 ? '…' : ''}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyBlock}>
                  <p className={styles.emptyText}>No recent scans yet</p>
                  <Link to={ROUTES.SCAN} className={styles.emptyLink}>Run a scan →</Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.sidebarFooter}>
            <Link to={ROUTES.MARKETPLACE} className={styles.sidebarFooterLink}>
              Marketplace
            </Link>
            <Link to={ROUTES.DOCS} className={styles.sidebarFooterLink}>
              Documentation
            </Link>
            <Link to={ROUTES.SETTINGS} className={styles.sidebarFooterLink}>
              Settings
            </Link>
          </div>
        </aside>

        <div className={styles.chatArea}>
          <div className={styles.messagesWrap}>
            {messages.length === 0 ? (
              <div className={styles.welcome}>
                <h1 className={styles.welcomeTitle}>
                  Enterprise AI Use Case Scanner
                </h1>
                <p className={styles.welcomeSubtitle}>
                  Describe a use case and I’ll scan your infrastructure for existing support and gaps.
                  Or paste a long document and I’ll suggest use cases from it.
                </p>
                <p className={styles.welcomeValue}>
                  Ship faster, avoid duplicate work, and keep one source of truth—all from one place.
                </p>
              </div>
            ) : (
              <ChatMessageList messages={messages} isLoading={isLoading} />
            )}
          </div>
          <div className={styles.inputWrap}>
            {messages.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearMessages}
              >
                Clear conversation
              </button>
            )}
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading}
              placeholder="Describe a use case or paste text for recommendations…"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
