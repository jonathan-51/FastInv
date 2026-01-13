# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TradeFlow** is a Next.js 16 full-stack web application for trade business management. It helps tradespeople manage jobs, customers, invoices, materials, and photos using Supabase as the backend.

**Tech Stack:**
- Next.js 16.1.1 (App Router)
- React 19.2.1
- Supabase (PostgreSQL + Auth)
- Tailwind CSS 4.1.18
- Plus Jakarta Sans font

## Development Commands

```bash
# Always assume that the dev server is running.
# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Take screenshots (requires dev server running)
node take-screenshot.js login
node take-screenshot.js jobs
node take-screenshot.js        # defaults to home page
# Screenshots saved to screenshots/ directory with timestamps
```

## Architecture

### Route Groups

The app uses Next.js 13+ route groups to organize authentication and protected routes:

- **`app/(auth)/`** - Unauthenticated routes (login, signup)
  - Uses minimal layout without navigation
  - Server actions in `actions.js` files handle auth operations

- **`app/(dashboard)/`** - Protected routes requiring authentication
  - Includes Navbar, Sidebar, Settings modal, and NewJob modal
  - Layout wraps content with navigation chrome

### Authentication Flow

**Middleware-based protection** (`middleware.js`):
1. All requests pass through middleware
2. Supabase session checked via cookies
3. Unauthenticated users redirected to `/login`
4. Authenticated users on auth pages redirected to `/`

**Supabase Client Pattern** (`lib/supabase.js`):
- `createClient()` - Browser client for 'use client' components
- `createServerSupabaseClient()` - Server client for server actions and server components
- Session stored in HTTP-only cookies via @supabase/ssr

**Server Actions Pattern:**
- Auth operations in `app/(auth)/*/actions.js`
- Database operations in component `actions.js` files
- Marked with 'use server' directive
- Called directly from client components

### State Management

**React Context API** for global UI state:
- `SettingsContext` - Settings modal visibility
- `LocationContext` - Custom location fields
- `StatusContext` - Custom job status options
- `NewJobContext` - New job modal visibility

All contexts are composed in `app/layout.js` and wrap the entire application.

**Local Storage:**
- Jobs data currently stored in browser localStorage (key: 'jobs')
- Transitioning to Supabase database storage (v8.0 migration in progress)

### Component Organization

**Layouts:**
- `app/layout.js` - Root layout with all Context providers
- `app/(dashboard)/layout.js` - Dashboard layout with Navbar + Sidebar

**Shared Components** (`app/components/`):
- Global components like Navbar, Sidebar, Settings, UserStatus
- Each component has paired `.js` and `.css` files

**Domain Components:**
- Job-specific components in `app/(dashboard)/jobs/[id]/components/`
- Tab-based architecture: OverviewTab, MaterialsTab, BillablesTab, InvoiceTab, PhotoTab, NotesTab
- Custom hooks like `useJobs.js`, `useMaterials.js` manage tab state

### Styling System

**CSS Architecture:**
- Global design tokens in `app/globals.css` using CSS variables
- Component-scoped CSS files alongside components
- Tailwind CSS 4.1.18 utility classes
- Hybrid approach: Tailwind for layout, CSS files for component styles

**Design Tokens:**
```css
--background: #F7F3EA        /* Light beige */
--primary: #3B2A22           /* Dark brown */
--surface-primary: #FFFFFF   /* White cards */
--text: #0F172A              /* Dark slate */
```

### Database Schema

**Supabase Tables:**
- `jobs` - Job records with customer info (name, email, phone, address, date, status)
- Linked to authenticated user via `id` field

**Environment Variables** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your_service_key
```

## Important Patterns

### Server vs Client Components

- **Server Components** (default): Use for data fetching, no interactivity
- **Client Components** ('use client'): Required for:
  - React hooks (useState, useEffect, useContext)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)

### Path Aliases

The project uses `@/*` alias pointing to root directory:
```javascript
import { createClient } from '@/lib/supabase'
import Navbar from '@/app/components/Navbar'
```

### Server Action Security

When writing server actions:
1. Always validate user is authenticated via `supabase.auth.getUser()`
2. Associate data with current user's ID
3. Use server-side Supabase client: `createServerSupabaseClient()`
4. Never trust client-provided user IDs

Example pattern:
```javascript
'use server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function createJob(formData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Associate data with user.id
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...formData, user_id: user.id })

  return { data, error }
}
```

## Current State

**Recent Version:** v8.0 - "Connecting DB to Project"
- Active migration from localStorage to Supabase database
- Authentication fully implemented
- Job management features complete
- Materials, photos, invoicing in active development

**Known Patterns:**
- Job data stored in localStorage transitioning to Supabase
- Tab components follow custom hook pattern for state management
- Modal components controlled via Context API
