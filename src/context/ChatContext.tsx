import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import type { ChatMessage } from '@/types'
import { STORAGE_KEYS } from '@/constants'
import { runScan, storeScan } from '@/services/scan'
import { analyzeDocuments, filesToDocumentInputs } from '@/services/documents'
import { addMyUseCase } from '@/lib/myUseCases'
import { ApiError } from '@/lib/api'

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)
    return raw ? (JSON.parse(raw) as ChatMessage[]) : []
  } catch {
    return []
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.message === 'Request timed out')
      return 'Request timed out. Check your connection and try again.'
    if (err.status === 502 || err.status === 503)
      return 'Service temporarily unavailable. Please try again.'
    if (err.status === 401)
      return 'Authentication required. Configure your API or auth.'
  }
  return err instanceof Error ? err.message : 'Something went wrong. Please try again.'
}

/** Heuristic: long text with newlines = pasted document for analysis. */
function looksLikePastedDocument(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length > 400 && (trimmed.includes('\n') || trimmed.split(/\s+/).length > 50)
}

type ChatContextValue = {
  messages: ChatMessage[]
  sendMessage: (content: string, options?: { asDocument?: boolean; files?: File[] }) => Promise<void>
  clearMessages: () => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages)
  const [isLoading, setIsLoading] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  const sendMessage = useCallback(
    async (content: string, options?: { asDocument?: boolean; files?: File[] }) => {
      const trimmed = content.trim()
      const hasFiles = (options?.files?.length ?? 0) > 0
      if (!trimmed && !hasFiles) return

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed || (hasFiles ? `Attached ${options!.files!.length} file(s) for analysis.` : ''),
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const asDocument =
        options?.asDocument ?? hasFiles ?? (looksLikePastedDocument(trimmed) && trimmed.length <= 50_000)

      try {
        if (asDocument) {
          const docs: import('@/types').DocumentInput[] = []
          if (hasFiles && options?.files?.length) {
            const fileDocs = await filesToDocumentInputs(options.files)
            docs.push(...fileDocs)
          }
          if (trimmed && trimmed !== 'Attached files for analysis.') {
            docs.push({
              id: crypto.randomUUID(),
              name: 'Pasted in chat',
              type: 'pasted',
              content: trimmed,
              addedAt: new Date().toISOString(),
            })
          }
          if (docs.length === 0) {
            if (mounted.current) setIsLoading(false)
            return
          }
          const suggested = await analyzeDocuments(docs)
          if (!mounted.current) return
          const assistantMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: suggested.length
              ? `I found **${suggested.length}** use case(s) from your text. You can scan any of them below to see what your infrastructure already supports and what's missing.`
              : "I couldn't extract specific use cases from that text. Try describing a use case in a sentence (e.g. \"Customer intent classification from support chat\") and I'll scan for it.",
            createdAt: new Date().toISOString(),
            suggestedUseCases: suggested.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
            })),
          }
          setMessages((prev) => [...prev, assistantMsg])
          return
        }

        if (!trimmed) {
          if (mounted.current) setIsLoading(false)
          return
        }

        const firstLine = trimmed.split('\n')[0]?.trim() ?? trimmed
        const rest = trimmed.slice(firstLine.length).trim()
        const title = firstLine.slice(0, 120)
        const description = rest || firstLine

        const result = await runScan({ title, description })
        storeScan(result)
        addMyUseCase(result.useCaseId, title, description)

        if (!mounted.current) return
        const summary = result.summary
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: summary,
          createdAt: new Date().toISOString(),
          scanId: result.useCaseId,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (err) {
        if (!mounted.current) return
        const errorContent = getErrorMessage(err)
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Sorry, the scan failed: ${errorContent}`,
          createdAt: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } finally {
        if (mounted.current) setIsLoading(false)
      }
    },
    []
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, clearMessages, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
