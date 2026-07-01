import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SPORT_TYPES, type SportType } from '@/types'

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get('sport')
  if (sport && !SPORT_TYPES.includes(sport as SportType)) {
    return NextResponse.json({ error: 'El tipus d’esport no és vàlid.' }, { status: 400 })
  }

  const supabase = await createClient()
  let query = supabase
    .from('courts')
    .select('id, name, sport_type, description, capacity, price_per_hour')
    .order('sport_type')
    .order('name')

  if (sport) query = query.eq('sport_type', sport)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: 'No s’han pogut carregar les pistes.' }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
