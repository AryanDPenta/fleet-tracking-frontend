import { useEffect, useState } from 'react'
import { getAdminAlerts, acknowledgeAlert } from '../api/alertApi'
import { subscribeTopic } from '../../common/websocket/socketClient'
import { useAuth } from '../../auth/AuthContext'
import { timeAgo } from '../../common/utils/dateUtils'

const TYPE_LABELS = {
  IDLE_DETECTED: 'Truck idle',
  THRESHOLD_BREACH: 'Below drive-time threshold',
  TRIP_STATUS_UPDATE: 'Trip status',
  ADMIN_MESSAGE: 'Message sent'
}

export default function AlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let unsub = () => {}

    getAdminAlerts().then(setAlerts)

    subscribeTopic(`/topic/company/${user.id}/alerts`, (alert) => {
      setAlerts((prev) => [alert, ...prev])
    }).then((fn) => {
      unsub = fn
    })

    return () => unsub()
  }, [user.id])

  async function dismiss(alertId) {
    // Optimistic update - mark it acknowledged locally right away so it drops
    // out of the default (unacknowledged-only) view without waiting on the network.
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)))
    try {
      await acknowledgeAlert(alertId)
    } catch {
      // Non-critical if this fails - worst case it reappears on next refresh.
    }
  }

  const visibleAlerts = showAll ? alerts : alerts.filter((a) => !a.acknowledged)
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="admin-page">
      <div className="alerts-page__header">
        <h1 className="admin-page__heading">Alerts</h1>
        <button className="btn-secondary" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show unread only' : `Show all${alerts.length ? ` (${alerts.length})` : ''}`}
        </button>
      </div>

      {!showAll && unacknowledgedCount === 0 && alerts.length > 0 && (
        <p className="alerts-page__empty">You're all caught up. {alerts.length} dismissed alert(s) hidden.</p>
      )}

      <div className="alert-list">
        {visibleAlerts.map((a) => (
          <div className={`alert-row alert-row--${a.alertType.toLowerCase()}`} key={a.id}>
            <div style={{ flex: 1 }}>
              <span className="alert-row__type">{TYPE_LABELS[a.alertType] || a.alertType}</span>
              <p className="alert-row__message">{a.message}</p>
            </div>
            <span className="alert-row__time">{timeAgo(a.createdAt)}</span>
            {!a.acknowledged && (
              <button className="alert-row__dismiss" onClick={() => dismiss(a.id)} aria-label="Dismiss">
                ×
              </button>
            )}
          </div>
        ))}
        {alerts.length === 0 && <p style={{ color: 'var(--graphite-400)' }}>No alerts yet.</p>}
      </div>
    </div>
  )
}
