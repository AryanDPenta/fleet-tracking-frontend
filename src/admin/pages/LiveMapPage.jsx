import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getLiveTrucks } from '../api/adminApi'
import { subscribeTopic } from '../../common/websocket/socketClient'
import { useAuth } from '../../auth/AuthContext'
import { timeAgo } from '../../common/utils/dateUtils'

const DEFAULT_CENTER = [22.9734, 78.6569] // roughly the centre of India
const DEFAULT_ZOOM = 5

const truckIcon = L.divIcon({
  className: 'truck-marker',
  html: '<span></span>',
  iconSize: [16, 16]
})

export default function LiveMapPage() {
  const { user } = useAuth()
  // Keyed by tripId so a new ping updates the existing marker instead of adding one.
  const [trucks, setTrucks] = useState({})

  useEffect(() => {
    let unsub = () => {}

    getLiveTrucks().then((list) => {
      const byTrip = {}
      list.forEach((t) => {
        if (t.latitude != null) byTrip[t.tripId] = t
      })
      setTrucks(byTrip)
    })

    subscribeTopic(`/topic/company/${user.id}/locations`, (dto) => {
      setTrucks((prev) => ({ ...prev, [dto.tripId]: dto }))
    }).then((fn) => {
      unsub = fn
    })

    return () => unsub()
  }, [user.id])

  const truckList = Object.values(trucks)

  return (
    <div className="map-layout">
      <div className="map-canvas">
        <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitToTrucks trucks={truckList} />
          {truckList.map((t) => (
            <Marker key={t.tripId} position={[t.latitude, t.longitude]} icon={truckIcon}>
              <Popup>
                <strong>{t.truckRegNumber}</strong>
                <br />
                {t.driverName} · {t.driverStatus}
                <br />
                Updated {timeAgo(t.lastUpdated)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <aside className="map-rail">
        <p className="map-rail__heading">On the road ({truckList.length})</p>
        {truckList.length === 0 && <p style={{ fontSize: 13, color: 'var(--graphite-400)' }}>No active trips.</p>}
        {truckList.map((t) => (
          <div className="truck-tile" key={t.tripId}>
            <div className="truck-tile__reg">{t.truckRegNumber}</div>
            <div className="truck-tile__driver">
              {t.driverName} · {t.driverStatus.replace('_', ' ')}
            </div>
            <div className="truck-tile__updated">Updated {timeAgo(t.lastUpdated)}</div>
          </div>
        ))}
      </aside>
    </div>
  )
}

// Keeps the map framed around whatever trucks are currently active.
function FitToTrucks({ trucks }) {
  const map = useMap()
  const hasFitOnce = useRef(false)

  useEffect(() => {
    if (trucks.length === 0 || hasFitOnce.current) return
    const bounds = L.latLngBounds(trucks.map((t) => [t.latitude, t.longitude]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
    hasFitOnce.current = true
  }, [trucks, map])

  return null
}
