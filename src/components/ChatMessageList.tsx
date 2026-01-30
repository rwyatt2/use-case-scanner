import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ChatMessage } from '@/types'
import { ROUTES } from '@/constants'
import styles from './ChatMessageList.module.css'

function renderContent(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    return part
  })
}

export function ChatMessageList({
  messages,
  isLoading,
}: {
  messages: ChatMessage[]
  isLoading: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isLoading])

  return (
    <ul className={styles.list} aria-live="polite">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={msg.role === 'user' ? styles.rowUser : styles.rowAssistant}
        >
          <div
            className={`${styles.bubble} ${
              msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant
            }`}
          >
            <p style={{ margin: 0 }}>{renderContent(msg.content)}</p>
            {msg.role === 'assistant' && msg.scanId && (
              <div className={styles.actions}>
                <Link
                  to={`${ROUTES.RESULTS}/${msg.scanId}`}
                  className={styles.actionLink}
                >
                  View scan results →
                </Link>
              </div>
            )}
            {msg.role === 'assistant' && msg.suggestedUseCases && msg.suggestedUseCases.length > 0 && (
              <div className={styles.actions} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                {msg.suggestedUseCases.map((uc) => (
                  <Link
                    key={uc.id}
                    to={ROUTES.SCAN}
                    state={{ suggestedTitle: uc.title, suggestedDescription: uc.description }}
                    className={styles.suggestedCard}
                  >
                    <span className={styles.suggestedCardTitle}>{uc.title}</span>
                    <p className={styles.suggestedCardDesc}>{uc.description}</p>
                  </Link>
                ))}
                <p className={styles.meta}>Click a use case to open the scan form with it prefilled.</p>
              </div>
            )}
          </div>
        </li>
      ))}
      {isLoading && (
        <li className={`${styles.bubble} ${styles.bubbleAssistant}`} aria-busy="true">
          <span aria-hidden>Thinking…</span>
        </li>
      )}
      <div ref={endRef} />
    </ul>
  )
}
