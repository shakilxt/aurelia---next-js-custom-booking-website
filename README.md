# AURELIA — Luxury Tropical Resort & Retreats

A design-first frontend portfolio project: a fictional island resort in the South Pacific with
accommodation discovery and a simulated booking flow. See [`PROJECT_SPEC.md`](./PROJECT_SPEC.md)
for the full specification.

> **Demonstration only.** AURELIA is fictional. Prices, availability and guest notes are
> illustrative. No reservations, payments or enquiries are created or transmitted.

## Stack

- Next.js 16 (App Router, Turbopack, typed routes) · React 19 · TypeScript 5.9 (strict)
- Tailwind CSS 4 with CSS-first design tokens (`src/app/globals.css`)
- `next/font` (Cormorant Garamond, DM Sans) — self-hosted at build time
- lucide-react icons
- Vitest (unit) · Playwright + axe-core (end-to-end and accessibility)

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Development server                                 |
| `npm run build`     | Production build                                   |
| `npm run start`     | Serve the production build                         |
| `npm run typecheck` | Generate route types and run `tsc --noEmit`        |
| `npm run lint`      | ESLint (`eslint-config-next`)                      |
| `npm run format`    | Prettier (with Tailwind class sorting)             |
| `npm run test`      | Vitest unit tests                                  |
| `npm run test:e2e`  | Playwright suite (builds and serves the app first) |
| `npm run check`     | Typecheck, lint, format check and unit tests       |

Run `npx playwright install chromium` once before the first end-to-end run. To use an existing
Chromium build instead, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome`.

## Project structure

```
src/
  app/          Routes, root layout, global styles and design tokens
  components/   layout/ (header, navigation, footer) · ui/ (primitives) · feature folders
  data/         Typed local mock data and site configuration
  lib/          Pure utilities (metadata, class names, …)
  types/        Domain types
tests/e2e/      Playwright specs
```

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical base URL for metadata. On Vercel the production
domain is detected automatically; locally it falls back to `http://localhost:3000`.

## Scope

Frontend only: local typed mock data, simulated booking behaviour and client-side validation.
There is no payment processing, database, authentication or external booking API.
