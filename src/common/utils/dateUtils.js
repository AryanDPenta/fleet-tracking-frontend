export function formatTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

export function minutesToHoursLabel(mins) {
  if (mins == null) return '—'
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return `${h}h ${m}m`
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
