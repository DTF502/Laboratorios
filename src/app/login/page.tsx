'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { createClient } from '@/lib/supabase/client'
import { validateEmail } from '@/lib/validation'

function requestedPath(): string {
  if (typeof window === 'undefined') return '/'
  const value = new URLSearchParams(window.location.search).get('next')
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError('Introdueix una adreça de correu vàlida.')
      return
    }

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    setLoading(false)

    if (signInError) {
      setError('El correu o la contrasenya no són correctes, o el compte encara no està confirmat.')
      return
    }

    router.push(requestedPath())
    router.refresh()
  }

  return (
    <div className="mx-auto mt-8 max-w-md sm:mt-14">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Benvingut de nou</h1>
        <p className="mt-2 text-sm text-slate-500">Inicia sessió per reservar i gestionar les teves pistes.</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-7 space-y-5 p-6 sm:p-7">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">Correu electrònic</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nom@exemple.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">Contrasenya</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <Alert type="error">{error}</Alert>}
        <button type="submit" className="btn-primary w-full" disabled={loading || !email || !password}>
          {loading ? <Spinner label="Iniciant sessió..." /> : 'Iniciar sessió'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Encara no tens compte?{' '}
          <Link href="/register" className="font-semibold text-brand-700 hover:underline">Crea’n un</Link>
        </p>
      </form>
    </div>
  )
}
