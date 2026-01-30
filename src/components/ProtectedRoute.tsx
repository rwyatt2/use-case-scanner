import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuth } from '@/context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

/**
 * Wraps app routes that require authentication. Redirects to login with return URL if not signed in.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirect}`} replace state={{ from: location }} />
  }

  return <>{children}</>
}
