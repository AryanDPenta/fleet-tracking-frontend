import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveTrip, endTrip } from '../api/tripApi'
import LiveLocationSender from '../components/LiveLocationSender'
import TripStatusButtons from '../components/TripStatusButtons'
import WarningBanner from '../components/WarningBanner'

export default function ActiveTripPage() {
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [ending, setEnding] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    getActiveTrip()
      .then(setTrip)
      .catch(() => setLoadError(true))
  }, [])

  async function handleEndTrip() {
    if (!trip) return
    setEnding(true)
    try {
      await endTrip(trip.id)
      navigate('/driver')
    } finally {
      setEnding(false)
    }
  }

  if (loadError) {
    return (
      <div className="empty-state">
        <p>No trip in progress.</p>
        <button className="btn-primary" onClick={() => navigate('/driver')}>
          Start a trip
        </button>
      </div>
    )
  }

  if (!trip) return null

  return (
    <div>
      <WarningBanner />

      <div className="trip-card">
        <p className="trip-card__route">
          {trip.sourceLocation} → {trip.destinationLocation}
        </p>
        <p className="trip-card__meta">
          Truck {trip.truckRegNumber} · Started {new Date(trip.startTime).toLocaleTimeString()}
        </p>
        <LiveLocationSender tripId={trip.id} />
      </div>

      <TripStatusButtons tripId={trip.id} initialOnBreak={trip.driverStatus === 'RESTING'} />

      <button className="btn-end-trip" onClick={handleEndTrip} disabled={ending}>
        {ending ? 'Ending trip…' : 'End trip'}
      </button>
    </div>
  )
}
