import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Guards a subtree to a single role. Logged-out users go to /login;
// logged-in users with the wrong role get bounced to their own home.
export default function RoleBasedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/driver'} replace />
  }
  return children
}
