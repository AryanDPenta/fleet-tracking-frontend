import { api } from '../../auth/api'

export function getAnalyticsSummary() {
  return api.get('/admin/analytics').then((r) => r.data)
}
