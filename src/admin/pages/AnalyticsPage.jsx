import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getAnalyticsSummary } from '../api/analyticsApi'

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getAnalyticsSummary().then(setSummary)
  }, [])

  if (!summary) return <div className="admin-page" />

  const chartData = [
    { name: 'Total trips', value: summary.totalTrips },
    { name: 'Completed', value: summary.completedTrips },
    { name: 'Ongoing', value: summary.ongoingTrips }
  ]

  return (
    <div className="admin-page">
      <h1 className="admin-page__heading">Analytics</h1>

      <div className="stat-grid">
        <StatCard label="Total drivers" value={summary.totalDrivers} />
        <StatCard label="Active trucks" value={summary.totalTrucks} />
        <StatCard label="Ongoing trips" value={summary.ongoingTrips} />
        <StatCard
          label="Avg drive time / day"
          value={`${Math.round(summary.averageDriveMinutesPerDay / 60)}h`}
        />
        <StatCard label="Below threshold today" value={summary.driversBelowThresholdToday} accent="red" />
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--concrete-300)', borderRadius: 4, padding: 20, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--concrete-300)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--amber-500)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-card__value" style={accent === 'red' ? { color: 'var(--signal-red)' } : undefined}>
        {value}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}
