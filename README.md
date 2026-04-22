# Personal Website — Hussain Alam

Single-page Next.js site built as a professional showcase for Hussain Alam's job search and investor/co-founder conversations. See PRD for full context and scope.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind CSS
- Framer Motion (animations)
- Radix UI (accessible primitives)
- React Hook Form + Zod (forms + validation)
- Resend (contact form delivery)
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

Locked to **Tokyo Transit** — cool off-white background, deep ink navy text, vermillion signal-red accent. Reference: Muji / Japanese wayfinding / Tokyo subway. All tokens live as CSS variables in `src/app/globals.css`.

| Token | Hex | Purpose |
|---|---|---|
| `--background` | `#FAFAF7` | Page background |
| `--foreground` | `#0F1E3D` | Primary text |
| `--muted` | `#4B5670` | Secondary text (darkened from `#5F6B85` in v0.1.1.0 for WCAG AA) |
| `--accent` | `#E63B1E` | CTAs, highlights |
| `--surface` | `#FFFFFF` | Cards, elevated surfaces |
| `--border` | `#D9DDE3` | Hairlines |

## Deploy

```bash
# Push to GitHub, then import the repo at vercel.com/new
# Add env vars (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL) in Vercel project settings.
```
