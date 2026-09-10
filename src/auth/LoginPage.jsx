import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './login.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(identifier, password)
      navigate(user.role === 'ADMIN' ? '/admin' : '/driver', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-mark">FLEET</div>
        <h1 className="login-heading">Sign in</h1>
        <p className="login-sub">Drivers use their phone number. Admins use their email.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span>Phone or email</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="9876543210 or ops@yourcompany.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: 13, color: 'var(--graphite-200)', marginTop: 20 }}>
          New company? <Link to="/register-company" style={{ color: 'var(--amber-500)' }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}
