'use client'
import { useState } from 'react'

export default function BookmarkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title }),
      })
      if (res.ok) {
        setUrl('')
        setTitle('')
      }
    } catch (error) {
      console.error('Failed to add bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md border-gray-300"
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-2 border -md border-gray-300"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2  text-gray-700 border border-gray-300  rounded shadow-md disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </form>
  )
}
