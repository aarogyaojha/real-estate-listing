# Architecture

This document describes the system design, module layout, data flow, and key technical decisions.

## High-level overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│  Next.js 14 (App Router) + shadcn/ui + TanStack Query   │
│  Cookies: access_token (httpOnly), refresh_token        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP + httpOnly cookies
                     ▼
┌─────────────────────────────────────────────────────────┐
│               NestJS API  :4000                         │
│                                                         │
│  ┌──────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │  Auth    │  │  Listings  │  │     Agents         │  │
│  │  Module  │  │  Module    │  │     Module         │  │
│  └────┬─────┘  └─────┬──────┘  └────────┬───────────┘  │
│       │              │                  │               │
│       └──────────────▼──────────────────┘               │
│                 PrismaService (global)                   │
└────────────────────┬────────────────────────────────────┘
                     │ TCP :5432
                     ▼
┌─────────────────────────────────────────────────────────┐
│         PostgreSQL 15  (Docker container)               │
│   Tables: users, refresh_tokens, agents, listings       │
└─────────────────────────────────────────────────────────┘
```

## Auth flow

### Login
```
Client          AuthController      AuthService         DB
  │── POST /login ──▶│                   │               │
  │                  │── validateUser ──▶│               │
  │                  │                   │── find user ─▶│
  │                  │                   │── bcrypt.compare()
  │                  │                   │── signJWT (access 15m)
  │                  │                   │── signJWT (refresh 7d)
  │                  │                   │── save refresh token ─▶│
  │◀─ Set-Cookie ────│◀── tokens ────────│               │
```

### Token refresh (rotation)
```
Client          AuthController      AuthService         DB
  │── POST /refresh ▶│                   │               │
  │  (refresh_token cookie)              │               │
  │                  │── JwtRefreshGuard │               │
  │                  │── refreshTokens ─▶│               │
  │                  │                   │── find + validate token ─▶│
  │                  │                   │── delete old row ─────────▶│
  │                  │                   │── save new row ───────────▶│
  │◀─ Set-Cookie ────│◀── new tokens ────│               │
```

## NestJS module map

```
AppModule
├── PrismaModule      (global, exports PrismaService)
├── AuthModule
│   ├── JwtStrategy           (reads access_token cookie)
│   ├── JwtRefreshStrategy    (reads refresh_token cookie)
│   ├── JwtAuthGuard          (required — 401 if missing)
│   ├── OptionalJwtGuard      (public — attaches user or null)
│   ├── AuthController        (register, login, refresh, logout, me)
│   └── AuthService           (validateUser, issueTokens, revokeToken)
├── ListingsModule
│   ├── ListingsController    (GET /listings, GET /listings/:id)
│   └── ListingsService       (search, findOne, sanitize, buildWhere)
└── AgentsModule
    ├── AgentsController      (GET /agents, GET /agents/:id)
    └── AgentsService         (findAll, findOne with listings)
```

## Key design decisions

1. **NestJS over Express** — Enforces module/controller/service/provider separation by framework convention.

2. **httpOnly cookies over Authorization header** — Access tokens in httpOnly cookies are not accessible to JavaScript, preventing XSS-based token theft.

3. **Refresh token rotation with DB persistence** — Each refresh generates a new refresh token and deletes the old one. Storing tokens in the DB allows server-side revocation.

4. **Prisma over TypeORM** — Prisma's generated client is fully typed from the schema, making field-level access safe at compile time.

5. **OptionalJwtGuard pattern** — A single route uses `OptionalJwtGuard` which attaches `req.user` when a valid token is present but never rejects unauthenticated callers.

6. **Index strategy** — Indexes on `price` (range queries), `suburb` (equality + ILIKE), `propertyType`, `bedrooms`, `bathrooms` (common filter combinations), and `agentId` (JOIN lookups).
