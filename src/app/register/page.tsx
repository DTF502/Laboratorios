'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { createClient } from '@/lib/supabase/client'
import { validateEmail, validatePassword } from '@/lib/validation'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (fullName.trim().length < 2) {
      setError('Introdueix el teu nom complet.')
      return
    }
    if (!validateEmail(email)) {
      setError('Introdueix una adreça de correu vàlida.')
      return
    }
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== passwordConfirmation) {
      setError('Les dues contrasenyes no coincideixen.')
      return
    }

    setLoading(true)
    const origin = window.location.origin
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (signUpError) {
      if (signUpError.code === 'over_email_send_rate_limit') {
        setError('S’ha superat temporalment el límit d’enviament de correus. Torna-ho a provar més tard.')
      } else if (signUpError.message.toLowerCase().includes('already registered')) {
        setError('Ja existeix un compte amb aquest correu.')
      } else {
        setError('No s’ha pogut crear el compte. Torna-ho a provar.')
      }
      return
    }

    if (data.session) {
      router.replace('/')
      router.refresh()
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="mx-auto mt-14 max-w-md text-center">
        <div className="card p-8">
          <span className="text-5xl" aria-hidden="true">📧</span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Confirma el teu correu</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Hem enviat un enllaç de confirmació a <strong>{email}</strong>. Després podràs iniciar sessió.</p>
          <Link href="/login" className="btn-primary mt-6">Anar a iniciar sessió</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Crea el teu compte</h1>
        <p className="mt-2 text-sm text-slate-500">Registra’t gratuïtament i comença a reservar.</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-7 space-y-4 p-6 sm:p-7">
        <div>
          <label htmlFor="full-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Nom complet</label>
          <input id="full-name" type="text" autoComplete="name" className="input" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Correu electrònic</label>
          <input id="register-email" type="email" autoComplete="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Contrasenya</label>
          <input id="register-password" type="password" autoComplete="new-password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" required />
          <p id="password-help" className="mt-1 text-xs text-slate-500">Mínim 8 caràcters, amb una lletra i un número.</p>
        </div>
        <div>
          <label htmlFor="password-confirmation" className="mb-1.5 block text-sm font-semibold text-slate-700">Repeteix la contrasenya</label>
          <input id="password-confirmation" type="password" autoComplete="new-password" className="input" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required />
        </div>
        {error && <Alert type="error">{error}</Alert>}
        <button type="submit" className="btn-primary w-full" disabled={loading || !fullName || !email || !password || !passwordConfirmation}>
          {loading ? <Spinner label="Creant compte..." /> : 'Crear compte'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Ja tens compte? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Inicia sessió</Link>
        </p>
      </form>
    </div>
  )
}
