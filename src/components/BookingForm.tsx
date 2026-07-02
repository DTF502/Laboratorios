'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import TimeSlotPicker from '@/components/TimeSlotPicker'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { fetchJson } from '@/lib/api'
import { TIME_SLOTS } from '@/lib/constants'
import { endTimeForSlot, isPastSlot, maxBookingDateISO, normalizeTime, toLocalISODate } from '@/lib/date'
import type { AvailabilitySlot, Booking, Court } from '@/types'

interface Props {
  court: Court
  onBooked?: () => void
}

export default function BookingForm({ court, onBooked }: Props) {
  const [date, setDate] = useState(toLocalISODate())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const refreshAvailability = useCallback(async () => {
    setLoadingAvailability(true)
    try {
      const query = new URLSearchParams({ court_id: String(court.id), date })
      setAvailability(await fetchJson<AvailabilitySlot[]>(`/api/bookings/availability?${query}`, { cache: 'no-store' }))
    } catch (caught) {
      setAvailability([])
      setMessage({ type: 'error', text: caught instanceof Error ? caught.message : 'No s’ha pogut consultar la disponibilitat.' })
    } finally {
      setLoadingAvailability(false)
    }
  }, [court.id, date])

  useEffect(() => {
    setSelectedTime(null)
    void refreshAvailability()
  }, [refreshAvailability])

  const bookedSlots = useMemo(
    () => availability.map((slot) => normalizeTime(slot.start_time)),
    [availability],
  )
  const unavailableSlots = useMemo(
    () => TIME_SLOTS.filter((slot) => isPastSlot(date, slot)),
    [date],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTime) {
      setMessage({ type: 'error', text: 'Selecciona una franja horària.' })
      return
    }

    setSubmitting(true)
    setMessage(null)
    try {
      await fetchJson<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          court_id: court.id,
          booking_date: date,
          start_time: selectedTime,
          end_time: endTimeForSlot(selectedTime),
        }),
      })
      setSelectedTime(null)
      setMessage({ type: 'success', text: 'Reserva creada correctament. Ja apareix a “Les meves reserves”.' })
      await refreshAvailability()
      onBooked?.()
    } catch (caught) {
      setMessage({ type: 'error', text: caught instanceof Error ? caught.message : 'No s’ha pogut crear la reserva.' })
      await refreshAvailability()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="booking-title">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="booking-title" className="text-xl font-bold text-slate-900">Reserva aquesta pista</h2>
          <p className="text-sm text-slate-500">Les reserves duren una hora i es poden fer amb 60 dies d’antelació.</p>
        </div>
        <span className="mt-2 text-sm font-semibold text-brand-700 sm:mt-0">{Number(court.price_per_hour).toFixed(2)} € per reserva</span>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="max-w-xs">
          <label htmlFor="booking-date" className="mb-1.5 block text-sm font-semibold text-slate-700">Data</label>
          <input
            id="booking-date"
            type="date"
            className="input"
            min={toLocalISODate()}
            max={maxBookingDateISO()}
            value={date}
            onChange={(event) => { setDate(event.target.value); setMessage(null) }}
            required
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700">Hora d’inici</span>
            <div className="flex gap-3 text-xs text-slate-500" aria-hidden="true">
              <span>Disponible</span><span className="line-through">Ocupada</span>
            </div>
          </div>
          {loadingAvailability ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
              <Spinner label="Consultant disponibilitat..." />
            </div>
          ) : (
            <TimeSlotPicker
              bookedSlots={bookedSlots}
              unavailableSlots={unavailableSlots}
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          )}
        </div>

        {selectedTime && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Resum de la reserva</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              <dt>Pista</dt><dd className="text-right font-medium">{court.name}</dd>
              <dt>Data</dt><dd className="text-right font-medium">{date}</dd>
              <dt>Hora</dt><dd className="text-right font-medium">{selectedTime}–{endTimeForSlot(selectedTime)}</dd>
              <dt>Preu</dt><dd className="text-right font-bold text-brand-700">{Number(court.price_per_hour).toFixed(2)} €</dd>
            </dl>
          </div>
        )}

        {message && <Alert type={message.type}>{message.text}</Alert>}

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting || loadingAvailability || !selectedTime}>
          {submitting ? <Spinner label="Confirmant reserva..." /> : 'Confirmar reserva'}
        </button>
      </form>
    </section>
  )
}
