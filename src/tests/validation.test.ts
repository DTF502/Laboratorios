import { describe, expect, it } from 'vitest'
import { validateBookingInput, validateEmail, validatePassword } from '@/lib/validation'

describe('booking validation', () => {
  const now = new Date(2026, 5, 28, 9, 0, 0)

  it('accepts a valid booking', () => {
    const result = validateBookingInput({
      court_id: 2,
      booking_date: '2026-06-29',
      start_time: '10:00',
      end_time: '11:00',
    }, now)
    expect(result.ok).toBe(true)
  })

  it('rejects past dates, invalid ids and non-hour durations', () => {
    const result = validateBookingInput({
      court_id: -1,
      booking_date: '2026-06-27',
      start_time: '10:30',
      end_time: '12:00',
    }, now)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.details).toHaveProperty('court_id')
      expect(result.details).toHaveProperty('booking_date')
      expect(result.details).toHaveProperty('start_time')
      expect(result.details).toHaveProperty('end_time')
    }
  })
})

describe('credential validation', () => {
  it('validates email format', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('not-an-email')).toBe(false)
  })

  it('requires a reasonably strong password', () => {
    expect(validatePassword('short')).not.toBeNull()
    expect(validatePassword('abcdefgh')).not.toBeNull()
    expect(validatePassword('abc12345')).toBeNull()
  })
})
