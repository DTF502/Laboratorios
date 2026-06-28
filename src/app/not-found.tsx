import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-6xl" aria-hidden="true">🏟️</p>
      <h1 className="mt-5 text-3xl font-extrabold text-slate-900">Pàgina no trobada</h1>
      <p className="mt-2 text-slate-500">La pàgina que cerques no existeix o ha canviat d’adreça.</p>
      <Link href="/" className="btn-primary mt-6">Tornar a les pistes</Link>
    </div>
  )
}
