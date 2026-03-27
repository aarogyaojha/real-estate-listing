# Backend — NestJS API

REST API for the real-estate-listing platform.

## Stack

| Package               | Purpose                                  |
|-----------------------|------------------------------------------|
| NestJS 10             | Framework — modules, controllers, guards |
| Prisma                | ORM + migration runner                   |
| PostgreSQL 15         | Relational database (via Docker)         |
| @nestjs/jwt           | JWT signing and verification             |
| @nestjs/passport      | Passport.js integration                  |
| bcrypt                | Password hashing (saltRounds: 12)        |
| class-validator       | DTO validation                           |
| @nestjs/swagger       | OpenAPI / Swagger UI                     |

## Setup

```bash
# From repo root — start Postgres first
docker-compose up -d

cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev   # http://localhost:3000
```

Swagger UI: http://localhost:3000/api-docs

## Environment variables

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| DATABASE_URL          | Prisma connection string             |
| JWT_ACCESS_SECRET     | Secret for access tokens (min 32 ch) |
| JWT_REFRESH_SECRET    | Secret for refresh tokens            |
| ACCESS_TOKEN_EXPIRY   | Access token TTL (default: 15m)      |
| REFRESH_TOKEN_EXPIRY  | Refresh token TTL (default: 7d)      |
| PORT                  | API port (default: 3000)             |

## API endpoints

| Method | Path                   | Auth     | Description                          |
|--------|------------------------|----------|--------------------------------------|
| POST   | /api/auth/register     | Public   | Create account                       |
| POST   | /api/auth/login        | Public   | Login — sets httpOnly cookies        |
| POST   | /api/auth/refresh      | Refresh  | Rotate access + refresh tokens       |
| POST   | /api/auth/logout       | Access   | Revoke token, clear cookies          |
| GET    | /api/auth/me           | Access   | Current user info                    |
| GET    | /api/listings          | Optional | Search + filter listings (paginated) |
| GET    | /api/listings/:id      | Optional | Single listing detail                |
| GET    | /api/agents            | Public   | List all agents                      |
| GET    | /api/agents/:id        | Public   | Agent + their active listings        |

## Running tests

```bash
npm run test        # unit tests
npm run test:e2e    # integration tests
npm run test:cov    # coverage report
```

