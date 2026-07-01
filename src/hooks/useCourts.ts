'use client'

import { useEffect, useState } from 'react'
import { fetchJson } from '@/lib/api'
import type { Court, SportType } from '@/types'

export function useCourts(sportFilter: SportType | '' = '') {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const query = sportFilter ? `?sport=${encodeURIComponent(sportFilter)}` : ''

    fetchJson<Court[]>(`/api/courts${query}`, { signal: controller.signal })
      .then(setCourts)
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setCourts([])
        setError(caught instanceof Error ? caught.message : 'No s’han pogut carregar les pistes.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [sportFilter])

  return { courts, loading, error }
}
