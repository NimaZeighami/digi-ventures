# DigiVentures Contributor Guide

## Repository Map

- `app/` contains the Next.js 14 App Router pages, layouts, and API routes (`(public)`, `(auth)`, `(portal)`, `(admin)`, `api/`).
- `components/` contains reusable React UI components, layouts, forms, and administrative controls.
- `modules/` contains domain business logic (auth, requests, storage, email, news, contact).
- `db/` contains the PostgreSQL schema (Drizzle ORM), migrations, and seeds.
- `lib/` contains utilities, logging, environment validation, and mail client.
- `actions/` contains server actions for transactional workflows.
- `public/` contains static assets (fonts, images, icons, brand vectors).
- `storage/` contains local uploaded pitch decks outside the web root.
- `tests/` contains automated unit and integration tests (Vitest).

## Boundaries & Architecture

- **Next.js 14 App Router + TypeScript + Tailwind CSS** is the unified fullstack platform.
- **PostgreSQL + Drizzle ORM** owns persistence, transactional guarantees, and concurrency control.
- Authentication uses Argon2id password hashing, database-backed opaque session tokens, and secure HTTP-only cookies.
- Server actions and API routes must always validate input with Zod, authenticate the caller, enforce role-based access control (RBAC), and verify tenant ownership.
- File uploads are validated strictly by file size (<= 20 MiB) and binary magic bytes (PDF, PPT, PPTX).

## Verification and Definition of Done

- Run `npm run typecheck` (`tsc --noEmit`) to ensure zero TypeScript errors.
- Run `npm test` (`vitest run`) to verify all automated unit and integration tests pass.
- Run `npm run build` (`next build`) to ensure all routes compile and optimize successfully.
- Code must follow strict RTL and Iranian Rial / Persian typography standards (Yekan Bakh, Gilroy, `#00B140` DigiVentures green).
