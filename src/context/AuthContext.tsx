import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { STORAGE_KEYS } from '@/constants'

/** Demo admin credentials — for demo only; replace with real auth in production */
export const DEMO_ADMIN_EMAIL = 'admin@example.com'
export const DEMO_ADMIN_PASSWORD = 'admin123'

export interface AuthUser {
  email: string
  name: string
  role: 'admin' | 'user'
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH)
    if (!raw) return null
    const data = JSON.parse(raw) as AuthUser
    if (data?.email && data?.name && data?.role) return data
  } catch {
    // ignore
  }
  return null
}

function saveUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
    }
  } catch {
    // ignore
  }
}

type AuthContextValue = {
  user: AuthUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  useEffect(() => {
    saveUser(user)
  }, [user])

  const login = useCallback((email: string, password: string) => {
    const e = (email ?? '').trim().toLowerCase()
    const p = (password ?? '').trim()

    // Demo admin login
    if (e === DEMO_ADMIN_EMAIL && p === DEMO_ADMIN_PASSWORD) {
      setUser({
        email: DEMO_ADMIN_EMAIL,
        name: 'Admin (Demo)',
        role: 'admin',
      })
      return { ok: true }
    }

    // Demo: allow any email with password "demo" for a generic user (optional)
    if (p === 'demo' && e.length > 0) {
      setUser({
        email: e,
        name: e.split('@')[0] ?? 'User',
        role: 'user',
      })
      return { ok: true }
    }

    return { ok: false, error: 'Invalid email or password.' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
