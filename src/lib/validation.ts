import { CLOSING_HOUR, OPENING_HOUR, TIME_SLOTS } from '@/lib/constants'
import {
  endTimeForSlot,
  isDateWithinBookingWindow,
  isValidHourSlot,
  normalizeTime,
} from '@/lib/date'

export interface BookingInput {
  court_id: number
  booking_date: string
  start_time: string
  end_time: string
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: Record<string, string> }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parsePositiveInteger(value: unknown): number | null {
  const numberValue = typeof value === 'number' ? value : Number(value)
  return Number.isSafeInteger(numberValue) && numberValue > 0 ? numberValue : null
}

export function validateBookingInput(value: unknown, now = new Date()): ValidationResult<BookingInput> {
  if (!isRecord(value)) {
    return { ok: false, error: 'El cos de la petició no és vàlid.' }
  }

  const courtId = parsePositiveInteger(value.court_id)
  const bookingDate = typeof value.booking_date === 'string' ? value.booking_date : ''
  const startTime = typeof value.start_time === 'string' ? normalizeTime(value.start_time) : ''
  const endTime = typeof value.end_time === 'string' ? normalizeTime(value.end_time) : ''
  const details: Record<string, string> = {}

  if (!courtId) details.court_id = 'La pista ha de ser un identificador enter positiu.'
  if (!isDateWithinBookingWindow(bookingDate, now)) {
    details.booking_date = 'La data ha d’estar entre avui i els pròxims 60 dies.'
  }
  if (!isValidHourSlot(startTime) || !TIME_SLOTS.includes(startTime)) {
    details.start_time = `L’hora inicial ha de ser una franja entre les ${OPENING_HOUR}:00 i les ${CLOSING_HOUR - 1}:00.`
  }
  if (!isValidHourSlot(endTime) || endTime !== endTimeForSlot(startTime)) {
    details.end_time = 'La reserva ha de durar exactament una hora.'
  }

  if (Object.keys(details).length > 0 || !courtId) {
    return { ok: false, error: 'Hi ha camps invàlids.', details }
  }

  return {
    ok: true,
    data: {
      court_id: courtId,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
    },
  }
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'La contrasenya ha de tenir com a mínim 8 caràcters.'
  if (!/[A-Za-zÀ-ÿ]/.test(password) || !/\d/.test(password)) {
    return 'La contrasenya ha d’incloure almenys una lletra i un número.'
  }
  return null
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
