# Contributing

Thank you for your interest in contributing to real-estate-listing.

## Development setup

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/real-estate-listing.git
   cd real-estate-listing
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/aarogyaojha/real-estate-listing.git
   ```
4. Follow the "Getting started" steps in README.md to start the database, run migrations, seed, and start both servers.

## Branching strategy

| Branch pattern         | Purpose                              |
|------------------------|--------------------------------------|
| `main`                 | Stable, deployable code only         |
| `feat/<short-name>`    | New features                         |
| `fix/<short-name>`     | Bug fixes                            |
| `chore/<short-name>`   | Tooling, deps, config changes        |
| `docs/<short-name>`    | Documentation only                   |
| `test/<short-name>`    | Adding or fixing tests               |

Always branch off `main`:
```bash
git checkout main
git pull upstream main
git checkout -b feat/my-feature
```

## Commit message convention

This project uses [Conventional Commits](https://www.conventionalcommits.org).

Format:
```
<type>(<optional scope>): <short description>
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`

Examples:
```
feat(auth): add refresh token rotation with DB persistence
fix(listings): correct price range filter for Decimal columns
test(auth): add integration test for logout cookie clearing
```

Rules:
- Subject line sentence case, no period
- Keep subject under 72 characters

## Code style

- TypeScript strict mode — no `any` types
- ESLint + Prettier enforced — run `npm run lint` before committing
- NestJS: thin controllers, all business logic in services
- Next.js: all API calls in `lib/api.ts`, no fetch calls inside components
- Use shadcn/ui components — no raw HTML `<input>` or `<button>` elements

## Pull request process

1. Make sure all tests pass:
   ```bash
   cd backend && npm run test && npm run test:e2e
   cd frontend && npm run test
   ```
2. Make sure lint passes with zero errors
3. Push your branch and open a PR against `main`
4. At least one review is required before merging
5. Squash-merge into `main`

## License

[MIT](./LICENSE) © 2025 aarogyaojha
