import type { DocumentInput, SuggestedUseCase } from '@/types'
import { API_BASE } from '@/constants'
import { apiPost } from '@/lib/api'

/**
 * Extension point: replace with your backend that:
 * - Accepts document content (text from files or pasted)
 * - Uses AI to extract/suggest use cases from the documents
 * - Returns suggested use cases for the user to select and scan
 */
export async function analyzeDocuments(documents: DocumentInput[]): Promise<SuggestedUseCase[]> {
  if (API_BASE) {
    const data = await apiPost<{ suggestedUseCases?: SuggestedUseCase[] } | SuggestedUseCase[]>(
      '/documents/analyze',
      { documents }
    )
    return Array.isArray(data) ? data : (data.suggestedUseCases ?? [])
  }
  return mockAnalyze(documents)
}

function mockAnalyze(documents: DocumentInput[]): SuggestedUseCase[] {
  const combined = documents
    .map((d) => (d.content.length > 50_000 ? d.content.slice(0, 50_000) + '…' : d.content))
    .join('\n\n')
  const hasImage = documents.some((d) => d.mimeType?.startsWith('image/'))
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

  if (hasImage && !suggestions.some((s) => s.title.toLowerCase().includes('image'))) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: 'Image-based use case',
      description:
        'Use case inferred from uploaded images. Describe or refine the use case, then run a scan to find existing support.',
      confidence: 75,
      sourceHint: 'Uploaded image(s)',
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

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string) ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const TEXT_EXT = /\.(txt|md|json|ts|tsx|js|jsx|py|csv|html|css|xml|yaml|yml|sh|env)$/i
const IMAGE_MIME = /^image\//

export function isTextFile(file: File): boolean {
  return TEXT_EXT.test(file.name) || file.type.startsWith('text/') || file.type === 'application/json'
}

export function isImageFile(file: File): boolean {
  return IMAGE_MIME.test(file.type)
}

/** Build DocumentInput[] from File[]; text files read as text, images as data URL. */
export async function filesToDocumentInputs(files: File[]): Promise<DocumentInput[]> {
  const out: DocumentInput[] = []
  for (const file of files) {
    const content = isImageFile(file)
      ? await readFileAsDataURL(file)
      : isTextFile(file)
        ? await readFileAsText(file)
        : `[File: ${file.name}]`
    out.push({
      id: crypto.randomUUID(),
      name: file.name,
      type: 'file',
      content,
      addedAt: new Date().toISOString(),
      mimeType: file.type || undefined,
    })
  }
  return out
}
