import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateBookingInput } from '@/lib/validation'

async function authenticatedUserId() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : null
  return { supabase, userId, error }
}

export async function GET() {
  const { supabase, userId } = await authenticatedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Has d’iniciar sessió.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, user_id, court_id, booking_date, start_time, end_time,
      status, cancelled_at, created_at,
      courts (id, name, sport_type, description, capacity, price_per_hour)
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'No s’han pogut carregar les reserves.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  const { supabase, userId } = await authenticatedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Has d’iniciar sessió.' }, { status: 401 })
  }

  const rawBody = await request.json().catch(() => null)
  const validation = validateBookingInput(rawBody)
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error, details: validation.details },
      { status: 400 },
    )
  }

  const input = validation.data
  const { data, error } = await supabase.rpc('create_booking', {
    p_court_id: input.court_id,
    p_booking_date: input.booking_date,
    p_start_time: input.start_time,
    p_end_time: input.end_time,
  })

  if (error) {
    if (error.code === '23P01' || error.message.toLowerCase().includes('solap')) {
      return NextResponse.json(
        { error: 'Aquesta franja acaba de ser reservada. Escull una altra hora.', code: 'BOOKING_CONFLICT' },
        { status: 409 },
      )
    }
    if (error.code === 'P0001') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'No s’ha pogut crear la reserva.' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
