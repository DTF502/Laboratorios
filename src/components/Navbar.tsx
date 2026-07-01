'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => setMenuOpen(false), [pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navegació principal"
      >
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-brand-700">
          <span aria-hidden="true">🏟️</span> SportBook
        </Link>

        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 sm:hidden"
          aria-expanded={menuOpen}
          aria-label="Obrir menú"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <div
          className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-16 flex-col gap-3 border-b border-slate-200 bg-white p-4 shadow-sm sm:static sm:flex sm:flex-row sm:items-center sm:border-0 sm:p-0 sm:shadow-none`}
        >
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-brand-700">
            Pistes
          </Link>

          {loading ? (
            <span className="h-9 w-28 animate-pulse rounded-xl bg-slate-100" aria-label="Carregant sessió" />
          ) : user ? (
            <button type="button" onClick={handleLogout} className="btn-primary">
              Tancar sessió
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Iniciar sessió
              </Link>
              <Link href="/register" className="btn-primary">
                Crear compte
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
