export const SPORT_TYPES = ['padel', 'tennis', 'futbol_sala', 'basquet', 'natacio', 'squash'] as const
export type SportType = (typeof SPORT_TYPES)[number]

export const BOOKING_STATUSES = ['active', 'cancelled'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export interface Court {
  id: number
  name: string
  sport_type: SportType
  description: string | null
  capacity: number
  price_per_hour: number
}

export interface Booking {
  id: number
  user_id: string
  court_id: number
  booking_date: string
  start_time: string
  end_time: string
  status: BookingStatus
  cancelled_at: string | null
  created_at: string
  courts?: Court | null
}

export interface AvailabilitySlot {
  booking_date: string
  start_time: string
  end_time: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

export interface ApiErrorBody {
  error: string
  code?: string
  details?: Record<string, string>
}

export const SPORT_LABELS: Record<SportType, string> = {
  padel: 'Pàdel',
  tennis: 'Tennis',
  futbol_sala: 'Futbol sala',
  basquet: 'Bàsquet',
  natacio: 'Natació',
  squash: 'Esquaix',
}
