import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuth, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/context/AuthContext'
import styles from './Login.module.css'

export function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? ROUTES.HOME

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = login(email, password)
    setLoading(false)
    if (result.ok) {
      navigate(redirectTo, { replace: true })
    } else {
      setError(result.error ?? 'Invalid email or password.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to={ROUTES.LANDING} className={styles.logo}>
          <span className={styles.logoIcon}>◇</span>
          Use Case Scanner
        </Link>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Enter your credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </label>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className={styles.submit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className={styles.demoHint}>
          <p className={styles.demoHintTitle}>Demo login</p>
          <p className={styles.demoHintText}>
            Admin: <strong>{DEMO_ADMIN_EMAIL}</strong> / <strong>{DEMO_ADMIN_PASSWORD}</strong>
          </p>
          <p className={styles.demoHintText} style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
            Or any email with password <strong>demo</strong> for a standard user.
          </p>
        </div>

        <Link to={ROUTES.LANDING} className={styles.backLink}>
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
