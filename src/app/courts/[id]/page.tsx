'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { fetchJson } from '@/lib/api'
import type { Court } from '@/types'
import { SPORT_LABELS } from '@/types'

export default function CourtDetailPage() {
  const params = useParams<{ id: string }>()
  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetchJson<Court>(`/api/courts/${params.id}`, { signal: controller.signal })
      .then(setCourt)
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setCourt(null)
        setError(caught instanceof Error ? caught.message : 'No s’ha pogut carregar la pista.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [params.id])

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Spinner label="Carregant pista..." />
      </div>
    )
  }

  if (error || !court) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-12">
        <Alert type="error">{error ?? 'Pista no trobada.'}</Alert>
        <Link href="/" className="btn-secondary">
          Tornar a les pistes
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-5 inline-flex text-sm font-semibold text-brand-700 hover:underline"
      >
        ← Tornar a les pistes
      </Link>

      <section className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-brand-100">
            {SPORT_LABELS[court.sport_type]}
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">{court.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-50">
                {court.description ?? 'Instal·lació esportiva disponible.'}
              </p>
            </div>

            <span className="whitespace-nowrap text-2xl font-extrabold">
              {Number(court.price_per_hour).toFixed(2)} €
              <span className="text-sm font-medium text-brand-100">/h</span>
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Capacitat</p>
            <p className="mt-1">Fins a {court.capacity} persones</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Horari</p>
            <p className="mt-1">De 08:00 a 22:00</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Durada prevista</p>
            <p className="mt-1">Franges d’una hora</p>
          </div>
        </div>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="text-xl font-bold text-slate-900">Informació de la pista</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          En aquest bloc es pot consultar el catàleg i la informació detallada de cada instal·lació.
          La selecció de disponibilitat i la creació de reserves s’incorporaran en el següent bloc.
        </p>
      </section>
    </div>
  )
}
