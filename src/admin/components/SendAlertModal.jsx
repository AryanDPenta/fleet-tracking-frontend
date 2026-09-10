import { useState } from 'react'
import { sendAlertToDriver } from '../api/alertApi'

export default function SendAlertModal({ driver, onClose }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!message.trim()) return
    setSending(true)
    setError('')
    try {
      await sendAlertToDriver(driver.id, message.trim())
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send the message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Message {driver.name}</h2>
        <label className="field">
          <span>Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="e.g. Please take the next rest stop, you're behind schedule."
            style={{
              background: 'var(--concrete-100)',
              border: '1px solid var(--concrete-300)',
              borderRadius: 'var(--radius-sm)',
              padding: '11px 12px',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
