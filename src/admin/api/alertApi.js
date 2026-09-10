import { api } from '../../auth/api'

export function getAdminAlerts() {
  return api.get('/alerts/admin').then((r) => r.data)
}

export function sendAlertToDriver(driverId, message) {
  return api.post('/alerts/send', { driverId, message }).then((r) => r.data)
}

export function acknowledgeAlert(alertId) {
  return api.post(`/alerts/${alertId}/ack`)
}
