import { useEffect, useState } from 'react'
import { getMyAlerts, acknowledgeAlert } from '../api/alertApi'
import { subscribeTopic } from '../../common/websocket/socketClient'
import { useAuth } from '../../auth/AuthContext'
import { timeAgo } from '../../common/utils/dateUtils'

// Shows unacknowledged alerts meant for this driver: admin messages, and
// warnings about stopping too long or missing yesterday's drive-time threshold.
export default function WarningBanner() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    let unsub = () => {}

    getMyAlerts().then((data) => setAlerts(data.filter((a) => !a.acknowledged)))

    subscribeTopic(`/topic/driver/${user.id}/alerts`, (alert) => {
      setAlerts((prev) => [alert, ...prev])
    }).then((fn) => {
      unsub = fn
    })

    return () => unsub()
  }, [user.id])

  async function dismiss(alertId) {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    try {
      await acknowledgeAlert(alertId)
    } catch {
      // Non-critical if the ack call fails - it'll still show as unread admin-side.
    }
  }

  if (alerts.length === 0) return null

  return (
    <div className="warning-stack">
      {alerts.map((alert) => (
        <div key={alert.id} className={`warning-card warning-card--${alert.alertType.toLowerCase()}`}>
          <div className="warning-card__body">
            <span className="warning-card__type">{formatType(alert.alertType)}</span>
            <p>{alert.message}</p>
            <span className="warning-card__time">{timeAgo(alert.createdAt)}</span>
          </div>
          <button className="warning-card__dismiss" onClick={() => dismiss(alert.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

function formatType(type) {
  switch (type) {
    case 'THRESHOLD_BREACH':
      return 'Driving time warning'
    case 'ADMIN_MESSAGE':
      return 'Message from admin'
    default:
      return type.replaceAll('_', ' ')
  }
}
