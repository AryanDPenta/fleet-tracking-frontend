import { api } from '../../auth/api'

export function startTrip({ truckId, sourceLocation, destinationLocation, thresholdMinutesOverride }) {
  return api.post('/trips/start', { truckId, sourceLocation, destinationLocation, thresholdMinutesOverride })
    .then((r) => r.data)
}

export function endTrip(tripId) {
  return api.post(`/trips/${tripId}/end`).then((r) => r.data)
}

export function getActiveTrip() {
  return api.get('/trips/active').then((r) => r.data)
}

export function reportStatusEvent(tripId, eventType, note) {
  return api.post(`/trips/${tripId}/status-event`, { eventType, note }).then((r) => r.data)
}
