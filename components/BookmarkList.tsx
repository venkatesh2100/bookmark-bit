"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

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

      await fetchBookmarks(true)

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
            console.log(' Realtime event received:', payload.eventType, payload)

            // Check if this event is for the current user
            const newRecord = payload.new as { user_id?: string } | null
            const oldRecord = payload.old as { user_id?: string } | null
            const recordUserId = newRecord?.user_id || oldRecord?.user_id
            if (recordUserId !== user.id) {
              console.log('⏭Event is for different user, ignoring')
              return
            }

            if (payload.eventType === 'DELETE') {
              fetchBookmarks(false)
            } else if (payload.eventType === 'INSERT') {
              fetchBookmarks(false)
            } else if (payload.eventType === 'UPDATE') {
              fetchBookmarks(false)
            }
          }
        )
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bookmark?")) return;

    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (res.ok) {

        setTimeout(() => {
          console.log(" Real-time update timeout, updating UI directly");
          setBookmarks((prev) => prev.filter((b) => b.id !== id));
        }, 1000);
      } else {
        const res = await fetch("/api/bookmarks");
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data);
        }
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  if (loading) return <div className="text-center flex items-center w-full  justify-center">Loading...</div>;

  if (bookmarks.length === 0) {
    return (
      <div className="text-gray-500">No bookmarks yet. Add one above!</div>
    );
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="flex items-center justify-between p-3 shadow-md border border-gray-300 rounded-md"
        >
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
  );
}
