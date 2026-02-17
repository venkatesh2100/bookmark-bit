import { createServerSupabaseClient } from '@/lib/supabase/supabase'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()
    const { url, title } = await request.json()

    if (!url || !title) {
      return NextResponse.json({ error: 'URL and title required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ url, title, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error:unknown) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
