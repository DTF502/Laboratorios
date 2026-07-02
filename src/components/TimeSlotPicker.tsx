'use client'

import { TIME_SLOTS } from '@/lib/constants'

interface Props {
  bookedSlots: string[]
  unavailableSlots: string[]
  selected: string | null
  onSelect: (time: string) => void
}

export default function TimeSlotPicker({ bookedSlots, unavailableSlots, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7" role="group" aria-label="Franges horàries">
      {TIME_SLOTS.map((slot) => {
        const isBooked = bookedSlots.includes(slot)
        const isUnavailable = unavailableSlots.includes(slot)
        const disabled = isBooked || isUnavailable
        const isSelected = selected === slot
        const label = isBooked ? `${slot}, ocupada` : isUnavailable ? `${slot}, no disponible` : `${slot}, disponible`

        return (
          <button
            key={slot}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            aria-label={label}
            title={isBooked ? 'Franja ocupada' : isUnavailable ? 'La franja ja ha començat' : 'Franja disponible'}
            onClick={() => onSelect(slot)}
            className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition ${
              disabled
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 line-through'
                : isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700'
            }`}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}
