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
  assets/       Bundled photography
  lib/          Pure domain logic and utilities, with colocated unit tests
  types/        Domain types
tests/e2e/      Playwright specs
```

## Photography

All photographs are free-licence images from [Unsplash](https://unsplash.com/license), bundled
locally in `src/assets/images` so the site never depends on a remote image host at runtime.
`scripts/images.manifest.json` records the source of every file. `npm run images` re-downloads
any missing file and applies one shared colour grade so photos from different photographers sit
together (pass `-- --force` to regenerate everything; behind an HTTP proxy, set
`NODE_USE_ENV_PROXY=1`).

Every image has been checked at full size for logos, watermarks and recognisable brand marks,
because a fictional resort must not borrow a real one's identity. Repeat that check when adding
photos.

## Domain logic

Pure, unit-tested modules in `src/lib`:

- `dates` — calendar dates as `YYYY-MM-DD` strings with UTC arithmetic, so night counts and
  display never shift with time zones or daylight saving. Unit tests run in UTC+14 to catch
  accidental local-time maths.
- `pricing` / `money` — estimates in integer minor units (cents) with explicitly configured fees
  (`src/data/pricing.ts`); totals are always recomputed, never read from the URL.
- `booking` — date, stay-length and capacity rules for a selection.
- `stay-query` / `booking-params` — tolerant parsing and stable serialisation of URL state.
- `validation` — guest-details and enquiry form rules.

## Homepage and search

The homepage is made of server-rendered sections in `src/components/home`. The only client
component is `BookingSearch`.

- Guests and residence type filter `/stays`. Dates don't filter, because there is no
  inventory to check. They are kept in the listing URL and carried to each residence's
  booking panel along with the party size.
- The search selects have `name` attributes and the form has `action="/stays"`. If
  JavaScript hasn't loaded, a native GET still filters the listing.
- Entrance animations use CSS scroll-driven animations (the `reveal` utility). They need no
  JavaScript and are skipped when reduced motion is preferred or the browser lacks support.
- Guest notes are fictional. The section and each note are visibly labelled as demo content.

## Gallery and contact

- The gallery filters by category and opens a lightbox built on the native `<dialog>`, which
  provides focus containment, Escape to close and focus return. Arrow keys and swipes move
  between photos, and the caption is a live region that announces each change.
- `/contact` is a static page. Links from `/experiences` add `?experience=<slug>`, which
  prefills the message on the client. The enquiry form follows the booking form's rules: no
  native submit before hydration, no storage, and an in-page acknowledgement that says nothing
  was sent.

## Booking simulation

`/book` runs in three steps: choose a residence, add dates, guests and guest details, then see
an in-page confirmation.

- Only the stay, dates and guest counts travel in the URL, and edits are mirrored with
  `history.replaceState`. Names, emails and requests stay in component state. They are never
  written to the URL, cookies or storage, and a refresh clears them.
- The submit button stays disabled until hydration, so a pre-JavaScript native submit can't
  put form values into a query string.
- A failed submit focuses an error summary that links to each field. Fields use
  `aria-invalid` and `aria-describedby`.
- The confirmation states that no reservation was made. Its `AUR-DEMO-…` reference is
  generated on submit and labelled as a demo identifier. There are no payment fields.

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical base URL for metadata. On Vercel the production
domain is detected automatically; locally it falls back to `http://localhost:3000`.

## Scope

Frontend only: local typed mock data, simulated booking behaviour and client-side validation.
There is no payment processing, database, authentication or external booking API.
