# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 Google OAuth authentication (no email/password)
- ➕ Add bookmarks with URL and title
- 🔒 Private bookmarks per user (Row Level Security)
- ⚡ Real-time updates across tabs (Supabase Realtime)
- 🗑️ Delete bookmarks
- 🚀 Deployed on Vercel

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase-schema.sql`
   - Enable Google OAuth in Authentication > Providers
   - Add your Google OAuth credentials
   - Get your project URL and anon key from Settings > API

3. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Deploy on Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase OAuth redirect URL to include your Vercel domain
5. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/callback/    # OAuth callback handler
│   │   └── bookmarks/        # Bookmark API routes
│   ├── auth/login/           # Login page
│   ├── dashboard/            # Main dashboard
│   └── layout.tsx
├── components/
│   ├── BookmarkForm.tsx      # Add bookmark form
│   ├── BookmarkList.tsx      # Real-time bookmark list
│   └── LogoutButton.tsx
├── lib/
│   ├── auth.ts               # Auth utilities
│   ├── supabase/             # Supabase clients
│   └── types.ts              # TypeScript types
└── supabase-schema.sql       # Database schema
```
