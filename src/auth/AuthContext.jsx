import { createContext, useContext, useState, useCallback } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('fleet_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback(async (identifier, password) => {
    const { data } = await api.post('/auth/login', { identifier, password })
    const nextUser = { id: data.userId, role: data.role, name: data.name }
    localStorage.setItem('fleet_token', data.token)
    localStorage.setItem('fleet_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }, [])

  const registerCompany = useCallback(async (companyName, email, password) => {
    const { data } = await api.post('/auth/register-company', { companyName, email, password })
    const nextUser = { id: data.userId, role: data.role, name: data.name }
    localStorage.setItem('fleet_token', data.token)
    localStorage.setItem('fleet_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fleet_token')
    localStorage.removeItem('fleet_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, registerCompany, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
