import { api } from '../../auth/api'

export function getMyAlerts() {
  return api.get('/alerts/driver').then((r) => r.data)
}

export function acknowledgeAlert(alertId) {
  return api.post(`/alerts/${alertId}/ack`)
}

export function getMyDaySummaries() {
  return api.get('/driver/summary').then((r) => r.data)
}
