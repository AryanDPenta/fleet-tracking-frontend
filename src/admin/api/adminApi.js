import { api } from '../../auth/api'

export function getLiveTrucks() {
  return api.get('/admin/live-trucks').then((r) => r.data)
}

export function getDrivers() {
  return api.get('/admin/drivers').then((r) => r.data)
}

export function getAllTrips() {
  return api.get('/admin/trips').then((r) => r.data)
}

export function createDriver({ name, phone, password }) {
  return api.post('/admin/drivers', { name, phone, password }).then((r) => r.data)
}

export function createTruck({ registrationNumber, model }) {
  return api.post('/admin/trucks', { registrationNumber, model }).then((r) => r.data)
}
