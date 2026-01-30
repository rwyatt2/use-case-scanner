import type { SavedUseCase } from '@/types'
import { STORAGE_KEYS } from '@/constants'

function load(): SavedUseCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MY_USE_CASES)
    return raw ? (JSON.parse(raw) as SavedUseCase[]) : []
  } catch {
    return []
  }
}

function save(items: SavedUseCase[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MY_USE_CASES, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function getMyUseCases(): SavedUseCase[] {
  return load()
}

export function addMyUseCase(scanId: string, title: string, description: string): void {
  const list = load()
  if (list.some((u) => u.scanId === scanId)) return
  list.unshift({
    scanId,
    title,
    description,
    createdAt: new Date().toISOString(),
  })
  save(list.slice(0, 50))
}
