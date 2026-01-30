import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { MarketplaceProduct } from '@/types'
import { STORAGE_KEYS } from '@/constants'

function load(): MarketplaceProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES)
    return raw ? (JSON.parse(raw) as MarketplaceProduct[]) : []
  } catch {
    return []
  }
}

function save(items: MarketplaceProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(items))
  } catch {
    // ignore
  }
}

const FavoritesContext = createContext<{
  favorites: MarketplaceProduct[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (product: MarketplaceProduct) => void
} | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<MarketplaceProduct[]>(load)

  useEffect(() => {
    save(favorites)
  }, [favorites])

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  )

  const toggleFavorite = useCallback((product: MarketplaceProduct) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === product.id)
      if (exists) return prev.filter((f) => f.id !== product.id)
      return [...prev, product]
    })
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
