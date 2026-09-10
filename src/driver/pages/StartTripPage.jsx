import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { startTrip, getActiveTrip } from '../api/tripApi'

export default function StartTripPage() {
  const navigate = useNavigate()
  const [truckId, setTruckId] = useState('')
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If a trip is already running, skip straight to it.
    getActiveTrip()
      .then(() => navigate('/driver/active', { replace: true }))
      .catch(() => {
        /* no active trip - stay on this form */
      })
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await startTrip({
        truckId: Number(truckId),
        sourceLocation: source,
        destinationLocation: destination
      })
      navigate('/driver/active')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not start the trip.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-heading">Start a trip</h1>
      <form className="trip-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Truck ID</span>
          <input
            type="number"
            value={truckId}
            onChange={(e) => setTruckId(e.target.value)}
            placeholder="Given to you by your admin"
            required
          />
        </label>
        <label className="field">
          <span>From</span>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Mumbai" required />
        </label>
        <label className="field">
          <span>To</span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Delhi"
            required
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Starting…' : 'Start trip'}
        </button>
      </form>
    </div>
  )
}
