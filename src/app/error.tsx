'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-5xl" aria-hidden="true">⚠️</p>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Alguna cosa no ha anat bé</h1>
      <p className="mt-2 text-sm text-slate-500">Torna-ho a provar. Si el problema continua, revisa la connexió i la configuració de Supabase.</p>
      <button type="button" className="btn-primary mt-6" onClick={reset}>Tornar-ho a provar</button>
    </div>
  )
}
