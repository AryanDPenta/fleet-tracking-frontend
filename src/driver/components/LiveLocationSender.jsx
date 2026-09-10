import { useEffect, useRef, useState } from 'react'
import { sendPing } from '../api/locationApi'

const PING_INTERVAL_MS = 15000

// Watches the browser's geolocation and pushes a ping to the backend on an
// interval (not on every raw position event - that fires far too often and
// would flood both the API and the admin's live map).
export default function LiveLocationSender({ tripId }) {
  const [status, setStatus] = useState('locating') // locating | live | error
  const [errorMsg, setErrorMsg] = useState('')
  const lastPositionRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMsg('This browser does not support location sharing.')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        lastPositionRef.current = pos
        setStatus('live')
      },
      (err) => {
        setStatus('error')
        setErrorMsg(err.message || 'Could not get your location.')
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    )

    const intervalId = setInterval(() => {
      const pos = lastPositionRef.current
      if (!pos) return
      const speedKmh = pos.coords.speed != null ? pos.coords.speed * 3.6 : null
      sendPing(tripId, pos.coords.latitude, pos.coords.longitude, speedKmh).catch(() => {
        // A missed ping isn't fatal - the next interval tick will try again.
      })
    }, PING_INTERVAL_MS)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearInterval(intervalId)
    }
  }, [tripId])

  return (
    <div className={`gps-pill gps-pill--${status}`}>
      <span className="gps-dot" />
      {status === 'locating' && 'Finding your location…'}
      {status === 'live' && 'Sharing live location'}
      {status === 'error' && errorMsg}
    </div>
  )
}
