import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { FeatureFlags as FeatureFlagsType } from '@/types'
import { STORAGE_KEYS } from '@/constants'

const STORAGE_KEY = STORAGE_KEYS.FEATURE_FLAGS

const defaults: FeatureFlagsType = {
  useMockMarketplace: true,
}

function load(): FeatureFlagsType {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FeatureFlagsType>
      return { ...defaults, ...parsed }
    }
  } catch {
    // ignore
  }
  return { ...defaults }
}

function save(flags: FeatureFlagsType) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
  } catch {
    // ignore
  }
}

const FeatureFlagsContext = createContext<{
  flags: FeatureFlagsType
  setFlag: <K extends keyof FeatureFlagsType>(key: K, value: FeatureFlagsType[K]) => void
} | null>(null)

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlagsType>(load)

  useEffect(() => {
    save(flags)
  }, [flags])

  const setFlag = useCallback(<K extends keyof FeatureFlagsType>(key: K, value: FeatureFlagsType[K]) => {
    setFlags((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagsContext)
  if (!ctx) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider')
  return ctx
}
