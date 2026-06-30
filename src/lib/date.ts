import { BOOKING_DURATION_MINUTES, MAX_ADVANCE_DAYS } from '@/lib/constants'

export function toLocalISODate(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysISO(days: number, from = new Date()): string {
  const result = new Date(from)
  result.setHours(12, 0, 0, 0)
  result.setDate(result.getDate() + days)
  return toLocalISODate(result)
}

export function maxBookingDateISO(from = new Date()): string {
  return addDaysISO(MAX_ADVANCE_DAYS, from)
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function isDateWithinBookingWindow(value: string, now = new Date()): boolean {
  if (!isValidISODate(value)) return false
  return value >= toLocalISODate(now) && value <= maxBookingDateISO(now)
}

export function normalizeTime(value: string): string {
  return value.slice(0, 5)
}

export function isValidHourSlot(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number)
  const total = hour * 60 + minute + minutes
  const nextHour = Math.floor(total / 60)
  const nextMinute = total % 60
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`
}

export function endTimeForSlot(startTime: string): string {
  return addMinutesToTime(startTime, BOOKING_DURATION_MINUTES)
}

export function isPastSlot(date: string, time: string, now = new Date()): boolean {
  if (date !== toLocalISODate(now)) return date < toLocalISODate(now)
  const [hour, minute] = time.split(':').map(Number)
  const slotDate = new Date(now)
  slotDate.setHours(hour, minute, 0, 0)
  return slotDate.getTime() <= now.getTime()
}

export function formatDateCatalan(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('ca-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function bookingStartTimestamp(bookingDate: string, startTime: string): number {
  return new Date(`${bookingDate}T${normalizeTime(startTime)}:00`).getTime()
}
