# Personal Website — Hussain Alam

Single-page Next.js site built as a professional showcase for Hussain Alam's job search and investor/co-founder conversations. See PRD for full context and scope.

## Stack

- Next.js 14+ (App Router)
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
    sections/     — Hero, CareerTimeline, Entrepreneurship, SideProjects, BeyondWork, Education, Contact
    ui/           — shared primitives (Button, Card, Drawer, Badge)
  data/           — content (career, ventures, side projects, books, etc.)
  lib/            — utils, resend client
  types/          — shared TypeScript types
```

Section order in `src/app/page.tsx` matches PRD §6: Hero → Career → Entrepreneurship → Side Projects → Beyond Work → Education → Contact.

## Swapping color palettes (PRD §7.3)

Three palettes are baked into `src/app/globals.css`. Default is terracotta. To preview the others, add a `data-theme` attribute on `<html>` in `layout.tsx`:

- `data-theme="sage"` — Option B (forest/sage)
- `data-theme="navy"` — Option C (navy + warm gold)
- Omit attribute — Option A (terracotta, default)

## Deploy

```bash
# Push to GitHub, then import the repo at vercel.com/new
# Add env vars (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL) in Vercel project settings.
```
