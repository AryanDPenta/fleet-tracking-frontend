import axios from 'axios'

// Vite proxies /api -> the Spring Boot backend in dev (see vite.config.js).
// For a separate prod deployment, set VITE_API_BASE_URL and it's used instead.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fleet_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fleet_token')
      localStorage.removeItem('fleet_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
