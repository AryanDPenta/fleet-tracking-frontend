import { useEffect, useState } from 'react'
import { getDrivers } from '../api/adminApi'
import SendAlertModal from '../components/SendAlertModal'

export default function DriverListPage() {
  const [drivers, setDrivers] = useState([])
  const [messagingDriver, setMessagingDriver] = useState(null)

  useEffect(() => {
    getDrivers().then(setDrivers)
  }, [])

  return (
    <div className="admin-page">
      <h1 className="admin-page__heading">Drivers</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>
                <span className={`status-dot status-dot--${d.status.toLowerCase()}`} />
                {d.status.replace('_', ' ')}
              </td>
              <td>
                <button className="btn-secondary" onClick={() => setMessagingDriver(d)}>
                  Message
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {drivers.length === 0 && <p style={{ color: 'var(--graphite-400)', marginTop: 16 }}>No drivers yet.</p>}

      {messagingDriver && (
        <SendAlertModal driver={messagingDriver} onClose={() => setMessagingDriver(null)} />
      )}
    </div>
  )
}
