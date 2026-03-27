# Frontend — Next.js App

Search interface for the real-estate-listing platform.

## Stack

| Package           | Purpose                                      |
|-------------------|----------------------------------------------|
| Next.js 14        | App Router, server + client components       |
| TypeScript        | Type safety throughout                       |
| shadcn/ui         | Component library (Tailwind-based)           |
| Tailwind CSS      | Utility-first styling                        |
| TanStack Query v5 | Server state — caching, refetching           |
| Sonner            | Toast notifications                          |

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev   # http://localhost:3000
```

## Environment variables

| Variable              | Description              | Default                      |
|-----------------------|--------------------------|------------------------------|
| NEXT_PUBLIC_API_URL   | NestJS API base URL      | http://localhost:4000/api    |

## Pages

- `/listings` — Filter and browse property listings with URL-synced filters
- `/listings/[id]` — Full detail with agent info and admin panel (admin only)
- `/login` — Login with toast and redirect
- `/register` — Register with redirect to login

## Running tests

```bash
npm run test        # Jest + React Testing Library
```
