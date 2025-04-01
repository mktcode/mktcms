function normalizeDate(date: Date | string) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  return date
}

export function formatDate(date: Date | string) {
  date = normalizeDate(date)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  const formattedDate = date.toLocaleDateString('de-DE', options)
  return formattedDate
}

export function formatDateTime(date: Date | string) {
  date = normalizeDate(date)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formattedDate = date.toLocaleDateString('de-DE', options)
  const formattedTime = date.toLocaleTimeString('de-DE', options)
  return `${formattedDate} ${formattedTime}`
}