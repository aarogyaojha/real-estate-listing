# Real Estate Listing Engine

A production-grade property search and management platform built as a full-stack monorepo. The core engineering challenge: multi-role access where admins, agents, and standard users see different fields on the same listing — without leaking sensitive data across roles.

Solved with field-level sanitization at the API layer, not the frontend. Agents can't see admin-only fields by filtering in the UI — they're stripped before the response leaves the server.

---

## Architecture decisions worth noting

**Field-level sanitization** — role-based field stripping happens in a NestJS interceptor, not in frontend conditionals. A malicious client can't fetch the raw endpoint and inspect fields they shouldn't see.

**Refresh token rotation** — each token refresh issues a new token and invalidates the previous one via HttpOnly cookies. No tokens in localStorage.

**Search persistence** — active filters are encoded in the URL, so users can bookmark searches and share them. TanStack Query handles optimistic updates so the UI stays responsive during filter changes.

**Seeded test data** — `npx prisma db seed` populates realistic property listings, agents, and user accounts so you can explore the full feature set immediately.

---

## Features

- Property search with filters: suburb, price range, bedrooms, property type
- Saved search combinations (named filter sets)
- User favorites — bookmark properties to a personal collection
- Agent rating and review system
- Automated price history tracking per listing
- Mortgage calculator (built into the listing detail view)
- Admin dashboard — manage listings and platform agents
- Full OpenAPI docs at `/api-docs`

---

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL (Dockerized) |
| Auth | JWT (access + refresh) via HttpOnly cookies |
| Frontend | Next.js 15, TypeScript, TanStack Query |
| UI | Tailwind CSS, Shadcn/UI |
| CI/CD | GitHub Actions |

---

## Getting started

**Prerequisites:** Node.js 18+, Docker Desktop

```bash
# 1. Start the database
docker-compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 3. Frontend
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3001`. API docs at `http://localhost:3000/api-docs`.

**Default credentials:**
| Role | Username | Password |
|---|---|---|
| Admin | aarogyaojha | Admin@123 |
| User | testuser | User@123 |

---

## Example API calls

```bash
# Search listings with filters
curl "http://localhost:3000/listings?suburb=Kathmandu&price_max=50000000&bedrooms=3&page=1&limit=10"

# Get a specific listing
curl "http://localhost:3000/listings/8c51a92e-5c4d-44a7-8c43-b1d1f5e8e7f1"

# Authenticate (tokens returned as HttpOnly cookies)
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"aarogyaojha","password":"Admin@123"}' -v
```

---

## License

MIT © Aarogya Ojha
