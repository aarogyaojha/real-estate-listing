# Frontend — Next.js Application

Highly interactive property search interface for the real-estate broker's platform.

## Features

- Dynamic Search Interface: Filter by price, layout, property type, and keyword.
- URL Parameter Sync: Search states are synchronized to the URL for easy sharing.
- Market Analysis: Property detail pages include historical price tracking.
- Client Engagement: Integrated agent review system and lead enquiry forms.
- Administration: Full dashboard for authorized personnel to manage agents and properties.

## Architecture

| Layer | System |
|-------|--------|
| Framework | Next.js 14 |
| UI | shadcn/ui |
| State | TanStack Query |
| Animation | Framer Motion |
| Components | Client/Server Rendering |

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The application runs on `http://localhost:3001`.

## Local Testing

```bash
npm run test
```
