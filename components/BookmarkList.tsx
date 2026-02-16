'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Bookmark } from '@/lib/types'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchBookmarks = async (isInitialLoad = false) => {
      const res = await fetch('/api/bookmarks')
      if (res.ok) {
        const data = await res.json()
        setBookmarks(data)
      } else {
        console.error('Error fetching bookmarks')
      }
      if (isInitialLoad) {
        setLoading(false)
      }
    }

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch initial bookmarks from API
      await fetchBookmarks(true)

      // Set up real-time subscription that triggers refetch on changes
      // Note: We don't use filter for DELETE events as they may not work properly with filters
      channel = supabase
        .channel(`bookmarks-realtime-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
          },
          (payload) => {
            console.log('🔔 Realtime event received:', payload.eventType, payload)
            
            // Check if this event is for the current user
            const newRecord = payload.new as { user_id?: string } | null
            const oldRecord = payload.old as { user_id?: string } | null
            const recordUserId = newRecord?.user_id || oldRecord?.user_id
            if (recordUserId !== user.id) {
              console.log('⏭️ Event is for different user, ignoring')
              return
            }
            
            // Handle DELETE events explicitly
            if (payload.eventType === 'DELETE') {
              console.log('🗑️ Delete event detected for user:', payload.old)
              // For DELETE, refetch immediately (no delay needed)
              fetchBookmarks(false)
            } else if (payload.eventType === 'INSERT') {
              console.log('➕ Insert event detected')
              // For INSERT, refetch immediately
              fetchBookmarks(false)
            } else if (payload.eventType === 'UPDATE') {
              console.log('✏️ Update event detected')
              // For UPDATE, refetch immediately
              fetchBookmarks(false)
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime subscription active')
          }
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bookmark?')) return
    
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        console.log('✅ Delete request successful, waiting for real-time update...')
        
        // Fallback: If real-time doesn't update within 1 second, update UI directly
        setTimeout(() => {
          console.log('⏰ Real-time update timeout, updating UI directly')
          setBookmarks((prev) => prev.filter((b) => b.id !== id))
        }, 5000)
        
        // Note: Real-time subscription should trigger fetchBookmarks which will update state
        // This fallback ensures UI updates even if real-time is delayed
      } else {
        console.error('Failed to delete bookmark')
        // If delete fails, refetch to get current state
        const res = await fetch('/api/bookmarks')
        if (res.ok) {
          const data = await res.json()
          setBookmarks(data)
        }
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  if (bookmarks.length === 0) {
    return <div className="text-gray-500">No bookmarks yet. Add one above!</div>
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id} className="flex items-center justify-between p-3 border rounded">
          <div className="flex-1">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {bookmark.title}
            </a>
            <p className="text-sm text-gray-500">{bookmark.url}</p>
            <p className="text-xs text-gray-400">
              {new Date(bookmark.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

