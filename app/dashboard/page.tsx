import { requireAuth } from '@/lib/auth'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import LogoutButton from '@/components/LogoutButton'

export default async function Dashboard() {
  await requireAuth()

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <LogoutButton />
      </div>
      <BookmarkForm />
      <BookmarkList />
    </div>
  )
}

