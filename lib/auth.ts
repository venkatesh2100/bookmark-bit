import { createServerSupabaseClient } from './supabase/supabase'
import { redirect } from 'next/navigation'

export async function getAuthUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  return user
}
