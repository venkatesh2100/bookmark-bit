'use client'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 border  rounded-md  shadow-sm text-sm border-gray-300 text-gray-600 hover:text-gray-900"
    >
      Logout
    </button>
  )
}
