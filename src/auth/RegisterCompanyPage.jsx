import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './login.css'

export default function RegisterCompanyPage() {
  const { registerCompany } = useAuth()
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerCompany(companyName, email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create the account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-mark">FLEET</div>
        <h1 className="login-heading">Create your company</h1>
        <p className="login-sub">This sets up the admin account for your fleet.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span>Company name</span>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: 13, color: 'var(--graphite-200)', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--amber-500)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
