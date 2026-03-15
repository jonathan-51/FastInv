# FastInv

A fast, offline-first invoicing tool built for tradespeople. Create jobs, track billables, generate invoices, and export to PDF - no account required.

Live Demo: https://fast-inv.vercel.app

## Features

- **Job Management** — Create and organise jobs with client details
- **Billable Tracking** — Add materials, labour, and other costs with per-category markup
- **Invoice Generation** — Standard (summary) or Itemized (detailed breakdown) formats
- **PDF Export** — Download professional A4 invoices as PDF
- **Client-side Storage** — Client-side data persistence using localStorage
- **Cloud Backup** (optional) — Sync business details via Supabase account

## Tech Stack

- Next.js + React + TypeScript
- Tailwind + CSS 
- Supabase (optional cloud sync)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

### Optional: Cloud Backup

To enable Supabase cloud sync, create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
