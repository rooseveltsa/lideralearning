import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ prospects: [] }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ prospects: [] }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('crm_prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ prospects: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prospects: data ?? [] })
}
