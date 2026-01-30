import type { DocumentInput, SuggestedUseCase } from '@/types'

const API_BASE = import.meta.env.VITE_SCAN_API_URL || ''

/**
 * Extension point: replace with your backend that:
 * - Accepts document content (text from files or pasted)
 * - Uses AI to extract/suggest use cases from the documents
 * - Returns suggested use cases for the user to select and scan
 */
export async function analyzeDocuments(documents: DocumentInput[]): Promise<SuggestedUseCase[]> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents }),
    })
    if (!res.ok) throw new Error('Analysis failed')
    const data = await res.json()
    return data.suggestedUseCases ?? data
  }

  return mockAnalyze(documents)
}

function mockAnalyze(documents: DocumentInput[]): SuggestedUseCase[] {
  const combined = documents.map((d) => d.content).join('\n\n')
  const hasStrategy = /strategy|roadmap|vision|initiative/i.test(combined)
  const hasSupport = /support|ticket|chat|customer/i.test(combined)
  const hasContent = /content|summariz|extract|classif/i.test(combined)

  const suggestions: SuggestedUseCase[] = []

  if (hasStrategy) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: 'AI strategy and initiative tracking',
      description:
        'Identify and track AI initiatives and strategic goals from strategy docs. Surface existing capabilities that support each initiative.',
      confidence: 88,
      sourceHint: 'Mentioned in strategy/roadmap language',
    })
  }

  if (hasSupport) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: 'Customer support intent and routing',
      description:
        'Classify customer intents from support tickets or chat, route to the right team or automation, and suggest responses.',
      confidence: 85,
      sourceHint: 'Support and customer context in documents',
    })
  }

  if (hasContent) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: 'Content summarization and classification',
      description:
        'Summarize long documents, extract key entities, or classify content by topic or type for search and discovery.',
      confidence: 82,
      sourceHint: 'Content and classification language in documents',
    })
  }

  // Default suggestions if nothing matched
  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: crypto.randomUUID(),
        title: 'Document-driven use case (1)',
        description:
          'AI-suggested use case based on your documents. Review and edit the description, then run a scan to find existing support or gaps.',
        confidence: 70,
        sourceHint: 'Inferred from document content',
      },
      {
        id: crypto.randomUUID(),
        title: 'Document-driven use case (2)',
        description:
          'Second suggested use case from your documents. Select which use cases you want to scan.',
        confidence: 65,
        sourceHint: 'Inferred from document content',
      }
    )
  }

  return suggestions
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string) ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file, 'UTF-8')
  })
}
