# Personal Website — Hussain Alam

Single-page Next.js site built as a professional showcase for Hussain Alam's job search and investor/co-founder conversations. See PRD for full context and scope.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind CSS
- Radix UI (accessible dialogs)
- d3-geo + world-atlas (the travel map, rendered at build time)
- Zod + Resend (the contact API route; no form is mounted yet)
- Vitest + Playwright (tests; see TESTING.md)
- Vercel (hosting)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in Resend keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/            — routes, layout, global CSS, /api/contact
  components/
    layout/       — Header, Footer
    sections/     — Hero, CareerTimeline, Entrepreneurship, BeyondWork, Education
    ui/           — shared primitives (Button, Card, Drawer, Badge)
  data/           — content (career, ventures, side projects, books, etc.)
  lib/            — utils, resend client
  types/          — shared TypeScript types
```

Section order in `src/app/page.tsx`: Hero → Career → Entrepreneurship → Beyond Work → Education. Contact lives inside Hero as a right-column sidebar; the separate Contact + Side Projects sections in the original PRD were folded in during the design-review pass (see CHANGELOG v0.1.1.0).

## Color palette

Theme B, a light product UI in Karner blue with Geist + Geist Mono. [DESIGN.md](DESIGN.md) is the source of truth (tokens, type scale, components, guardrails). The tokens live as CSS variables in `src/app/globals.css` and map to Tailwind colors:

| Token | Hex | Purpose |
|---|---|---|
| `--page` | `#FBFBFA` | Page background (with a faint 40px grid) |
| `--ink` | `#0F1E3D` | Headings and primary text |
| `--ink-secondary` | `#3D4760` | Body text |
| `--ink-muted` | `#6B7280` | Mono labels and meta |
| `--primary` | `#0A6EAA` | Links, buttons, the pinned timeline segment, focus rings |
| `--sky` / `--peach` | `#00AEEF` / `#FFB37A` | Washes and glows only |
| `--signal` | `#E63B1E` | One signal: the Active status |
| `--line` | `#E5E7EB` | Hairlines |

The old Tokyo Transit names (`--background`, `--accent`, ...) remain only as aliases so the archived map variants and `/design` pages still render.

## Deploy

```bash
# Push to GitHub, then import the repo at vercel.com/new
# Add env vars (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL) in Vercel project settings.
```
