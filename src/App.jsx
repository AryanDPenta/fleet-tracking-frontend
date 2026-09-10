import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import RoleBasedRoute from './auth/RoleBasedRoute'
import LoginPage from './auth/LoginPage'
import RegisterCompanyPage from './auth/RegisterCompanyPage'

import DriverLayout from './driver/DriverLayout'
import StartTripPage from './driver/pages/StartTripPage'
import ActiveTripPage from './driver/pages/ActiveTripPage'
import DriverHistoryPage from './driver/pages/DriverHistoryPage'

import AdminLayout from './admin/AdminLayout'
import LiveMapPage from './admin/pages/LiveMapPage'
import DriverListPage from './admin/pages/DriverListPage'
import AlertsPage from './admin/pages/AlertsPage'
import AnalyticsPage from './admin/pages/AnalyticsPage'
import OnboardPage from './admin/pages/OnboardPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-company" element={<RegisterCompanyPage />} />

          <Route
            path="/driver"
            element={
              <RoleBasedRoute role="DRIVER">
                <DriverLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<StartTripPage />} />
            <Route path="active" element={<ActiveTripPage />} />
            <Route path="history" element={<DriverHistoryPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RoleBasedRoute role="ADMIN">
                <AdminLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<LiveMapPage />} />
            <Route path="drivers" element={<DriverListPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="onboard" element={<OnboardPage />} />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/driver'} replace />
}
