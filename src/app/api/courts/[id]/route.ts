import { NextResponse } from 'next/server'
import { parsePositiveInteger } from '@/lib/validation'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const courtId = parsePositiveInteger(id)
  if (!courtId) {
    return NextResponse.json({ error: 'L’identificador de la pista no és vàlid.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courts')
    .select('id, name, sport_type, description, capacity, price_per_hour')
    .eq('id', courtId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'No s’ha pogut carregar la pista.' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Pista no trobada.' }, { status: 404 })
  }

  return NextResponse.json(data)
}
