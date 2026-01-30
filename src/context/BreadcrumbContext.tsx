import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const { pathname } = useLocation()

  const setBreadcrumbs = useCallback((next: BreadcrumbItem[]) => {
    setItems(next)
  }, [])

  useEffect(() => {
    setItems([])
  }, [pathname])

  return (
    <BreadcrumbContext.Provider value={{ items, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbContext)
  return ctx
}

export function useSetBreadcrumbs(items: BreadcrumbItem[]) {
  const ctx = useContext(BreadcrumbContext)
  useEffect(() => {
    ctx?.setBreadcrumbs(items)
    return () => ctx?.setBreadcrumbs([])
  }, [ctx, JSON.stringify(items)])
}
