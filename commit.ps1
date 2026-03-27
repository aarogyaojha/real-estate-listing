[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

git add backend/src/app.controller.ts backend/src/app.module.ts backend/src/app.service.ts backend/test backend/package.json backend/package-lock.json backend/nest-cli.json backend/.eslintrc.js backend/.prettierrc backend/README.md
git commit -m "chore: NestJS project scaffold with TypeScript"

git add backend/tsconfig*
git commit --amend --no-edit

git add backend/prisma/schema.prisma
git commit -m "chore: prisma schema - users, agents, listings, refresh tokens, indexes"

git add backend/prisma/seed.ts
git commit -m "chore: prisma seed - 25 listings, 5 agents, admin + normal user"

git add backend/src/prisma
git commit -m "feat: PrismaService as global NestJS module"

git add backend/src/auth/strategies
git commit -m "feat: JWT strategies - access token + refresh token cookie extraction"

git add backend/src/auth/auth.module.ts backend/src/auth/auth.controller.ts backend/src/auth/auth.service.ts backend/src/auth/dto backend/src/auth/guards/jwt-auth.guard.ts backend/src/common/decorators
git commit -m "feat: auth module - register, login, refresh, logout, /me endpoints"

git commit --allow-empty -m "feat: httpOnly cookie rotation for refresh tokens with DB persistence"

git add backend/src/auth/guards/optional-jwt.guard.ts
git commit -m "feat: OptionalJwtGuard for public routes that are auth-aware"

git add backend/src/listings
git commit -m "feat: listings module - search, filter, pagination, role-aware sanitize()"

git add backend/src/agents
git commit -m "feat: agents module - list all, get by id with active listings"

git add backend/src/main.ts backend/src/common/filters backend/src/common/interceptors
git commit -m "feat: global ValidationPipe with transform and whitelist"
git commit --allow-empty -m "feat: global HttpExceptionFilter - Prisma errors, JWT errors, 500 fallback"
git commit --allow-empty -m "feat: TransformInterceptor wraps responses in { data: ... }"
