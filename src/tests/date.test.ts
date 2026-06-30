import { describe, expect, it } from 'vitest'
import {
  addDaysISO,
  endTimeForSlot,
  isDateWithinBookingWindow,
  isPastSlot,
  isValidISODate,
  toLocalISODate,
} from '@/lib/date'

describe('date helpers', () => {
  const now = new Date(2026, 5, 28, 10, 30, 0)

  it('formats local dates without UTC shifts', () => {
    expect(toLocalISODate(now)).toBe('2026-06-28')
  })

  it('validates real calendar dates', () => {
    expect(isValidISODate('2026-02-28')).toBe(true)
    expect(isValidISODate('2026-02-30')).toBe(false)
    expect(isValidISODate('28/06/2026')).toBe(false)
  })

  it('accepts only dates in the booking window', () => {
    expect(isDateWithinBookingWindow('2026-06-28', now)).toBe(true)
    expect(isDateWithinBookingWindow(addDaysISO(60, now), now)).toBe(true)
    expect(isDateWithinBookingWindow('2026-06-27', now)).toBe(false)
    expect(isDateWithinBookingWindow(addDaysISO(61, now), now)).toBe(false)
  })

  it('calculates one-hour slots', () => {
    expect(endTimeForSlot('08:00')).toBe('09:00')
    expect(endTimeForSlot('21:00')).toBe('22:00')
  })

  it('marks already-started slots as unavailable', () => {
    expect(isPastSlot('2026-06-28', '10:00', now)).toBe(true)
    expect(isPastSlot('2026-06-28', '11:00', now)).toBe(false)
    expect(isPastSlot('2026-06-29', '08:00', now)).toBe(false)
  })
})
