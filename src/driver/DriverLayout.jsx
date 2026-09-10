import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './driver.css'

export default function DriverLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="driver-shell">
      <header className="driver-topbar">
        <span className="driver-topbar__mark">FLEET</span>
        <span className="driver-topbar__name">{user.name}</span>
        <button className="driver-topbar__logout" onClick={logout}>
          Sign out
        </button>
      </header>
      <main className="driver-content">
        <Outlet />
      </main>
      <nav className="driver-tabbar">
        <NavLink to="/driver" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Trip
        </NavLink>
        <NavLink to="/driver/history" className={({ isActive }) => (isActive ? 'active' : '')}>
          History
        </NavLink>
      </nav>
    </div>
  )
}
