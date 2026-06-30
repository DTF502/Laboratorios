export const OPENING_HOUR = 8
export const CLOSING_HOUR = 22
export const BOOKING_DURATION_MINUTES = 60
export const MAX_ADVANCE_DAYS = 60

export const TIME_SLOTS = Array.from(
  { length: CLOSING_HOUR - OPENING_HOUR },
  (_, index) => `${String(OPENING_HOUR + index).padStart(2, '0')}:00`,
)
