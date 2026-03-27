# real-estate-listing

A full-stack real estate property search platform built as a take-home engineering assessment.
Features a NestJS REST API with JWT cookie authentication, role-based field access, and a
Next.js frontend using shadcn/ui.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-18+-brightgreen)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)

## Assessment Requirements Fulfilled

- **Backend API & Frontend GUI**: Fully implements the `/listings` search with keyword and property filters, plus the `/listings/:id` detail endpoint. The Next.js frontend provides a clean, responsive search experience with URL synchronization.
- **Relational DB & Indexing**: Uses PostgreSQL (via Prisma) with dedicated tables for properties and agents. Composite criteria (price, suburb, propertyType, beds, baths, status) are explicitly indexed to support high-performance lookup patterns.
- **Role-aware Behavior**: Implements an `isAdmin` flag securely transmitted via `httpOnly` JWT cookies. The service layer aggressively sanitizes outgoing data, ensuring only authenticated admins receive the sensitive `status` and `internalNotes` fields.
- **Pagination**: Offset-based pagination is implemented natively in the API and wired to the frontend's page controls.
- **Clean Architecture & Testing**: Built with strict separation of concerns (Controllers handle HTTP, Services handle DB logic). The repo includes strong Unit and E2E testing for the backend, paired with UI component testing for the frontend.

## Tech stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Backend    | NestJS 10, TypeScript, Prisma ORM                   |
| Database   | PostgreSQL 15 (Docker)                              |
| Auth       | JWT — httpOnly cookies, access + refresh tokens     |
| Validation | class-validator + class-transformer                 |
| API docs   | @nestjs/swagger (Swagger UI at /api-docs)           |
| Frontend   | Next.js 14 App Router, TypeScript                   |
| UI         | shadcn/ui, Tailwind CSS                             |
| Data fetch | TanStack Query v5                                   |
| Testing    | Jest, @nestjs/testing, Supertest, RTL               |

## Repository structure

```
real-estate-listing/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # JWT auth module
│   │   ├── listings/         # Listings module
│   │   ├── agents/           # Agents module
│   │   ├── prisma/           # PrismaService (global)
│   │   └── common/           # Filters, interceptors, decorators
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── .env.example
├── frontend/                 # Next.js 14 App Router
│   ├── app/
│   │   ├── listings/page.tsx
│   │   ├── listings/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── components/
│   ├── hooks/
│   ├── context/
│   ├── lib/
│   └── .env.example
├── docker-compose.yml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Getting started

### Prerequisites
- Node.js 18+
- Docker + Docker Compose

### 1. Clone the repository
```bash
git clone https://github.com/aarogyaojha/real-estate-listing.git
cd real-estate-listing
```

### 2. Start the database
```bash
docker-compose up -d
```

### 3. Set up the backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# API at http://localhost:3000
# Swagger at http://localhost:3000/api-docs
```

### 4. Set up the frontend
```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
# App at http://localhost:3001
```

## Seeded credentials

| Username    | Password  | Role  |
|-------------|-----------|-------|
| aarogyaojha | Admin@123 | Admin |
| testuser    | User@123  | User  |

Admin users see two extra fields: `status` and `internalNotes`.

## API reference

Full interactive docs: **http://localhost:3000/api-docs**

```bash
# Login — sets httpOnly cookies
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aarogyaojha","password":"Admin@123"}'

# Search listings
curl -b cookies.txt \
  "http://localhost:3000/api/listings?suburb=Kathmandu&price_min=10000000&bedrooms=3"

# Refresh tokens
curl -c cookies.txt -b cookies.txt -X POST http://localhost:3000/api/auth/refresh

# Logout
curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout
```

## Running tests

```bash
cd backend && npm run test
cd backend && npm run test:e2e
cd frontend && npm run test
```

## Design decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system diagrams and design rationale.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © 2025 aarogyaojha

