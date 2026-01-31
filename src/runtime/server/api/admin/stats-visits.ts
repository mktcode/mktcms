import { defineEventHandler } from 'h3'

type VisitDay = {
  date: string
  visits: number
}

const VISITS_LAST_30_DAYS: number[] = [
  12, 14, 11, 18, 22, 19, 17,
  25, 28, 21, 20, 24, 29, 31,
  27, 26, 23, 22, 21, 24, 28,
  30, 33, 29, 27, 26, 24, 22,
  25, 28,
]

function formatIsoDateLocal(date: Date): string {
  // Local date (not UTC) as YYYY-MM-DD
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default defineEventHandler(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: VisitDay[] = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (29 - index))

    return {
      date: formatIsoDateLocal(date),
      visits: VISITS_LAST_30_DAYS[index] ?? 0,
    }
  })

  return {
    rangeDays: 30,
    days,
  }
})
