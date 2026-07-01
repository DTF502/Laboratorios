import Link from 'next/link'
import type { Court, SportType } from '@/types'
import { SPORT_LABELS } from '@/types'

const SPORT_ICONS: Record<SportType, string> = {
  padel: '🎾',
  tennis: '🥎',
  futbol_sala: '⚽',
  basquet: '🏀',
  natacio: '🏊',
  squash: '🏸',
}

export default function CourtCard({ court }: { court: Court }) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="card group block p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
      aria-label={`Veure els detalls de ${court.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden="true">{SPORT_ICONS[court.sport_type]}</span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {SPORT_LABELS[court.sport_type]}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-brand-700">{court.name}</h2>
      <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">
        {court.description ?? 'Instal·lació esportiva disponible.'}
      </p>
      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-500">Fins a {court.capacity} persones</span>
        <span className="font-bold text-brand-700">{Number(court.price_per_hour).toFixed(2)} €/h</span>
      </div>
    </Link>
  )
}
