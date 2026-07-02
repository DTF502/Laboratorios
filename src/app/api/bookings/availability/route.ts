import { NextRequest, NextResponse } from 'next/server'
import { isDateWithinBookingWindow } from '@/lib/date'
import { createClient } from '@/lib/supabase/server'
import { parsePositiveInteger } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const courtId = parsePositiveInteger(request.nextUrl.searchParams.get('court_id'))
  const date = request.nextUrl.searchParams.get('date') ?? ''

  if (!courtId || !isDateWithinBookingWindow(date)) {
    return NextResponse.json(
      { error: 'La pista o la data indicades no són vàlides.' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_court_availability', {
    p_court_id: courtId,
    p_date: date,
  })

  if (error) {
    return NextResponse.json({ error: 'No s’ha pogut consultar la disponibilitat.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [], {
    headers: { 'Cache-Control': 'no-store' },
  })
}
