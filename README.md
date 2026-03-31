# Real Estate Listing Search Platform

A full-stack property search platform built as an engineering assessment. This project implements a secure NestJS backend with JWT authentication and a sophisticated Next.js frontend with property search and management features.

## Requirements Overview

- Backend API: REST architecture with search, filters, and detailed views.
- Frontend GUI: Next.js search interface with detailed property views.
- Database: PostgreSQL with optimized schema and performance indexing.
- Access Control: Role-based permissions ensuring sensitive data is protected.
- Quality: Standardized pagination, URL search persistence, and comprehensive testing.

## Features

- Secure Authentication: Session management using HttpOnly cookies and token rotation.
- Search Persistence: Save and name common filter combinations for quick access.
- User Favorites: Bookmark properties to a personal collection for later review.
- Feedback System: Integrated agent rating and review platform.
- Market Tools: Automated price history tracking and built-in mortgage calculator.
- Administration: Full dashboard for managing listings and platform agents.

## Stack Selection

| Layer | System |
|-------|-------|
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL (Dockerized) |
| Auth | JWT (Access + Refresh) via Cookies |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| UI | shadcn/ui library |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

You will need **Node.js 18+** and **Docker Desktop** installed.

### 1. Database Initialization

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

The application will be accessible at `http://localhost:3001`.

## Credentials

The following accounts are seeded by default:

- Administrator: `aarogyaojha` / `Admin@123`
- Standard User: `testuser` / `User@123`

## API Usage

The full OpenAPI documentation is available at `http://localhost:3000/api-docs`.

Below are some example API calls to interact with the backend:

**1. Search for Listings (with filters and pagination):**
```bash
curl -X GET "http://localhost:3000/listings?suburb=Kathmandu&price_max=50000000&bedrooms=3&page=1&limit=10"
```

**2. Get a Specific Listing by ID:**
```bash
curl -X GET "http://localhost:3000/listings/8c51a92e-5c4d-44a7-8c43-b1d1f5e8e7f1"
```

**3. Login (Authenticate as an Admin to get access tokens in HttpOnly cookies):**
```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"aarogyaojha","password":"Admin@123"}' \
  -v
```
*(The API will return `Set-Cookie` headers containing `access_token` and `refresh_token`)*

---
[MIT](./LICENSE) © 2026 aarogyaojha
