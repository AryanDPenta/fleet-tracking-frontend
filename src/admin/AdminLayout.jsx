import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './admin.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Live map', end: true },
  { to: '/admin/drivers', label: 'Drivers' },
  { to: '/admin/alerts', label: 'Alerts' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/onboard', label: 'Onboard' }
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__mark">FLEET</div>
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{user.name}</span>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
