# Backend — NestJS API

The core REST engine for the real-estate-listing platform.

## Architecture

| Layer | Implementation |
|-------|----------------|
| Framework | NestJS 11 |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Auth | @nestjs/jwt |
| Validator | class-validator |

## Local Development

Ensure the database is running via `docker-compose up -d` then:

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

## API Documentation

Interactive Swagger documentation is active at: `http://localhost:3000/api-docs`.

## Key Logic

- Role-Based Field Access: Sensitivity-aware serialization ensuring `internalNotes` are only sent to authenticated administrators.
- Asset Lifecycle: Listing price changes are automatically tracked via the `ListingPriceHistory` table.
- Discovery: Integrated property similarity recommendations based on location and type.

## Testing

```bash
npm run test
npm run test:e2e
```
