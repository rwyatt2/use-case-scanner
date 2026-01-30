import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Catches React errors and shows a fallback UI instead of a blank screen.
 * Enterprise: no stack traces or internal details exposed to end users.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('ErrorBoundary:', error, errorInfo.componentStack)
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className={styles.wrapper} role="alert">
          <div className={styles.card}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
              We couldn’t load this page. Try refreshing or return to the dashboard.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className={styles.primary}
              >
                Try again
              </button>
              <Link to={ROUTES.HOME} className={styles.secondary}>
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
