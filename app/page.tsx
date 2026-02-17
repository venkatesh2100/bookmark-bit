import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export default async function Home() {
  const user = await getAuthUser()
  console.log('user data from Supbase base check:',user)
  redirect(user ? '/dashboard' : '/auth/login')
}
