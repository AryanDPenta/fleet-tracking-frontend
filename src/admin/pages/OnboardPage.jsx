import { useState } from 'react'
import { createDriver, createTruck } from '../api/adminApi'

export default function OnboardPage() {
  return (
    <div className="admin-page">
      <h1 className="admin-page__heading">Onboard</h1>
      <div className="onboard-grid">
        <AddDriverCard />
        <AddTruckCard />
      </div>
    </div>
  )
}

function AddDriverCard() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const driver = await createDriver({ name, phone, password })
      setResult(driver)
      setName('')
      setPhone('')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add driver.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="onboard-card">
      <h2>Add a driver</h2>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="field">
          <span>Phone (used to sign in)</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="field">
          <span>Temporary password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="login-error">{error}</div>}
        {result && <div className="success-note">Added {result.name}. Share their phone + password with them.</div>}
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? 'Adding…' : 'Add driver'}
        </button>
      </form>
    </div>
  )
}

function AddTruckCard() {
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [model, setModel] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const truck = await createTruck({ registrationNumber, model })
      setResult(truck)
      setRegistrationNumber('')
      setModel('')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add truck.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="onboard-card">
      <h2>Add a truck</h2>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Registration number</span>
          <input
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="MH-04-AB-1234"
            required
          />
        </label>
        <label className="field">
          <span>Model (optional)</span>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Tata 1613" />
        </label>
        {error && <div className="login-error">{error}</div>}
        {result && (
          <div className="success-note">
            Added truck {result.registrationNumber} — its ID is <strong>{result.id}</strong>, share that with the driver.
          </div>
        )}
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? 'Adding…' : 'Add truck'}
        </button>
      </form>
    </div>
  )
}
