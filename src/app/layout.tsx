import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'SportBook',
    template: '%s · SportBook',
  },
  description: 'Consulta disponibilitat i reserva pistes esportives en línia.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          SportBook · Gestió de reserves esportives
        </footer>
      </body>
    </html>
  )
}
