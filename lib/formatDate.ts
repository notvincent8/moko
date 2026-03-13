const getLang = () => {
  if (navigator.languages !== undefined) {
    return navigator.languages[0]
  }
  return navigator.language || "fr-FR"
}

const getDateBoundaries = () => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)
  return { todayStart, yesterdayStart }
}

export const formatHistoryDate = (date: Date): string => {
  const { todayStart, yesterdayStart } = getDateBoundaries()
  const time = date.toLocaleTimeString(getLang(), { hour: "2-digit", minute: "2-digit" })

  if (date >= todayStart) return time
  if (date >= yesterdayStart) return `Yesterday, ${time}`
  return `${date.toLocaleDateString(getLang(), {
    day: "numeric",
    month: "short",
    year: "2-digit",
  })}, ${time}`
}
