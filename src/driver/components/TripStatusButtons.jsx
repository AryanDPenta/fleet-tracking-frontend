import { useState } from 'react'
import { reportStatusEvent } from '../api/tripApi'

const BREAK_OPTIONS = [
  { type: 'BREAKFAST', label: 'Breakfast' },
  { type: 'LUNCH', label: 'Lunch' },
  { type: 'DINNER', label: 'Dinner' }
]

// Lets a driver declare what they're doing while stopped. This is what tells
// the backend "this stop is a declared break" rather than an unexplained idle.
//
// initialOnBreak comes from the trip's current driverStatus (backend-persisted,
// see DriverStatusController) rather than always starting false - otherwise
// switching tabs and coming back (which remounts this component) would reset
// the UI to "not on break" even though the driver never actually resumed.
export default function TripStatusButtons({ tripId, initialOnBreak = false, onReported }) {
  const [onBreak, setOnBreak] = useState(initialOnBreak)
  const [sending, setSending] = useState(null)

  async function report(type) {
    setSending(type)
    try {
      await reportStatusEvent(tripId, type)
      // Only RESUMED means "back to driving" - BREAKFAST/LUNCH/DINNER and
      // MANUAL_STOP are all break states and should all show the resume button.
      setOnBreak(type !== 'RESUMED')
      onReported?.(type)
    } finally {
      setSending(null)
    }
  }

  if (onBreak) {
    return (
      <div className="status-buttons">
        <p className="status-buttons__hint">You're marked as on a break.</p>
        <button
          className="btn-status btn-status--resume"
          onClick={() => report('RESUMED')}
          disabled={sending === 'RESUMED'}
        >
          {sending === 'RESUMED' ? 'Resuming…' : "I'm back, resume trip"}
        </button>
      </div>
    )
  }

  return (
    <div className="status-buttons">
      <p className="status-buttons__hint">Stopping for a break? Let the admin know.</p>
      <div className="status-buttons__grid">
        {BREAK_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            className="btn-status"
            onClick={() => report(opt.type)}
            disabled={sending === opt.type}
          >
            {sending === opt.type ? '…' : opt.label}
          </button>
        ))}
      </div>
      <button
        className="btn-status btn-status--stop"
        onClick={() => report('MANUAL_STOP')}
        disabled={sending === 'MANUAL_STOP'}
      >
        {sending === 'MANUAL_STOP' ? '…' : 'Stopping for another reason'}
      </button>
    </div>
  )
}
