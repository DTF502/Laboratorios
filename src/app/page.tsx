import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center py-12">
      <div className="max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
          Reserva instal·lacions esportives
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Benvingut a SportBook
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Una plataforma per consultar instal·lacions esportives i gestionar les
          teves reserves de manera ràpida i senzilla.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary px-6 py-3">
            Crear compte
          </Link>
          <Link href="/login" className="btn-secondary px-6 py-3">
            Iniciar sessió
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          <article className="card p-5">
            <span className="text-2xl" aria-hidden="true">🔐</span>
            <h2 className="mt-3 font-bold text-slate-900">Accés segur</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Registre i inici de sessió gestionats amb Supabase Auth.
            </p>
          </article>
          <article className="card p-5">
            <span className="text-2xl" aria-hidden="true">📱</span>
            <h2 className="mt-3 font-bold text-slate-900">Disseny adaptable</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Interfície preparada per a ordinador, tauleta i mòbil.
            </p>
          </article>
          <article className="card p-5">
            <span className="text-2xl" aria-hidden="true">⚡</span>
            <h2 className="mt-3 font-bold text-slate-900">Sessió persistent</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              La sessió es conserva i es renova de forma automàtica.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
