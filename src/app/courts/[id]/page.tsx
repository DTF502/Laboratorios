'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BookingForm from '@/components/BookingForm'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { fetchJson } from '@/lib/api'
import type { Court } from '@/types'
import { SPORT_LABELS } from '@/types'

export default function CourtDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetchJson<Court>(`/api/courts/${params.id}`, { signal: controller.signal })
      .then(setCourt)
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setError(caught instanceof Error ? caught.message : 'No s’ha pogut carregar la pista.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [params.id])

  if (loading) {
    return <div className="py-20 text-center text-slate-500"><Spinner label="Carregant pista..." /></div>
  }

  if (error || !court) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-12">
        <Alert type="error">{error ?? 'Pista no trobada.'}</Alert>
        <Link href="/" className="btn-secondary">Tornar a les pistes</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="mb-5 inline-flex text-sm font-semibold text-brand-700 hover:underline">← Tornar a les pistes</Link>

      <section className="card mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-brand-100">{SPORT_LABELS[court.sport_type]}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">{court.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-50">{court.description}</p>
            </div>
            <span className="whitespace-nowrap text-2xl font-extrabold">{Number(court.price_per_hour).toFixed(2)} €<span className="text-sm font-medium text-brand-100">/h</span></span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 p-5 text-sm text-slate-600">
          <span>👥 Capacitat: <strong>{court.capacity}</strong></span>
          <span>🕗 Horari: <strong>08:00–22:00</strong></span>
          <span>⏱️ Durada: <strong>1 hora</strong></span>
        </div>
      </section>

      {authLoading ? (
        <div className="card p-8 text-center text-slate-500"><Spinner label="Comprovant sessió..." /></div>
      ) : user ? (
        <BookingForm court={court} />
      ) : (
        <section className="card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Inicia sessió per reservar</h2>
          <p className="mt-2 text-sm text-slate-500">La disponibilitat és pública, però necessites un compte per confirmar una reserva.</p>
          <button type="button" onClick={() => router.push(`/login?next=/courts/${court.id}`)} className="btn-primary mt-5">Iniciar sessió</button>
        </section>
      )}
    </div>
  )
}
