import { api } from '../../auth/api'

export function sendPing(tripId, latitude, longitude, speedKmh) {
  return api.post('/locations/ping', { tripId, latitude, longitude, speedKmh })
}
