import { useEffect, useState } from 'react'
import { getMyDaySummaries } from '../api/alertApi'
import { minutesToHoursLabel } from '../../common/utils/dateUtils'

export default function DriverHistoryPage() {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyDaySummaries()
      .then(setSummaries)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="page-heading">Your driving history</h1>

      {loading && <p className="empty-state">Loading…</p>}

      {!loading && summaries.length === 0 && (
        <p className="empty-state">No completed days yet. This fills in after your first full day of trips.</p>
      )}

      <div className="history-list">
        {summaries.map((s) => (
          <div className="history-row" key={s.summaryDate}>
            <div>
              <div className="history-row__date">{new Date(s.summaryDate).toDateString()}</div>
              <div className="history-row__minutes">
                {minutesToHoursLabel(s.totalDriveMinutes)} of {minutesToHoursLabel(s.thresholdMinutes)}
              </div>
            </div>
            <span className={`badge ${s.thresholdMet ? 'badge--met' : 'badge--miss'}`}>
              {s.thresholdMet ? 'Met' : 'Below'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
