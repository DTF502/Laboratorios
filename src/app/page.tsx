'use client'

import { useState } from 'react'
import CourtCard from '@/components/CourtCard'
import Alert from '@/components/ui/Alert'
import { useCourts } from '@/hooks/useCourts'
import type { SportType } from '@/types'
import { SPORT_LABELS, SPORT_TYPES } from '@/types'

const FILTERS: Array<{ value: SportType | ''; label: string }> = [
  { value: '', label: 'Totes' },
  ...SPORT_TYPES.map((value) => ({ value, label: SPORT_LABELS[value] })),
]

export default function HomePage() {
  const [sport, setSport] = useState<SportType | ''>('')
  const { courts, loading, error } = useCourts(sport)

  return (
    <div>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">Reserva esportiva en línia</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Troba pista. Tria hora. Juga.</h1>
        <p className="mt-3 max-w-2xl text-brand-50">Explora les instal·lacions esportives disponibles i consulta tota la informació de cada pista.</p>
      </section>

      <section className="mt-9" aria-labelledby="courts-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="courts-title" className="text-2xl font-bold text-slate-900">Pistes disponibles</h2>
            <p className="mt-1 text-sm text-slate-500">Filtra per esport i entra a una pista per consultar-ne els detalls.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar per esport">
            {FILTERS.map((filter) => (
              <button
                key={filter.value || 'all'}
                type="button"
                aria-pressed={sport === filter.value}
                onClick={() => setSport(filter.value)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  sport === filter.value
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mt-5"><Alert type="error">{error}</Alert></div>}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="card h-52 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : courts.length === 0 ? (
          <div className="card mt-6 p-10 text-center text-slate-500">No hi ha pistes disponibles per a aquest filtre.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => <CourtCard key={court.id} court={court} />)}
          </div>
        )}
      </section>
    </div>
  )
}
