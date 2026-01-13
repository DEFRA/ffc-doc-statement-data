const isWithinWindow = (window) => {
  if (!window) {
    return true
  }
  const now = new Date()
  const [startH, startM] = window.start.split(':').map(Number)
  const [endH, endM] = window.end.split(':').map(Number)
  const start = new Date(now)
  start.setHours(startH, startM, 0, 0)
  const end = new Date(now)
  end.setHours(endH, endM, 0, 0)
  return now >= start && now <= end
}

const isPollDay = (pollDays) => {
  if (!pollDays) {
    return true
  }
  const days = Array.isArray(pollDays) ? pollDays : []
  const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  return days.includes(today)
}

module.exports = {
  isWithinWindow,
  isPollDay
}
