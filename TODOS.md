# TODOS

Follow-ups tracked by skill/component, priority-ordered (P0 top → P4 bottom),
then the Completed section at the bottom. Source of truth for "what's left
before launch" and "what's acceptable to punt."

## [P0] Redesign build: theme B (light product UI, Karner blue)

Locked 2026-10-20. Visual source of truth:
`design-variants/2026-10-20-fullpage-productui-v7.html`; for Things I've
started and Beyond Work, `design-variants/2026-10-21-fullpage-productui-v8.html`
(v7 plus the real media approved 2026-10-21). Rules and tokens:
`DESIGN.md` (including the three guardrails). Build it section by section into
the real Next.js app, verifying each phase in the browser before the next.
Take wording from `src/data/` and the current section components (e.g. the
CareerTimeline intro line), not from the mockup text: they have fixes
made after v7 (Zoomo is Series-A, KarnerBlu is "co-founded", the
SpreadTheFacts partner is Mass General Brigham, the travel quote is
"Attributed to Saint Augustine").

### Phase 0: Ship what's already on `polish-things-ive-started` (done: PR #7, v0.1.4.0, merged 2026-10-21)
Content pass (no em-dashes, placeholder links), venture covers, routing
rules, the build fix that keeps Tailwind out of `images/` and
`design-themes/`, new logo assets, and every design-variants mockup. Open
the PR with `/ship`, merge, then start a fresh verb-first branch from main
(e.g. `build-theme-b-redesign`, pushed with `-u` before the first commit).

### Phase 1: Foundations (done 2026-10-21, branch `build-theme-b-redesign`)
- Geist + Geist Mono load via `next/font/google` (`--font-geist`,
  `--font-geist-mono`). Inter + Instrument Serif stay until the last old
  section is rebuilt (removed in Phase 8).
- DESIGN.md tokens live in `src/app/globals.css` next to Tokyo Transit
  under non-colliding names (`primary`, `sky`, `peach`, `signal`, `ink`,
  `ink-secondary`, `ink-muted`, `line`, `line-subtle`, `page`, `surface`,
  `sunken`, `tag`, `status-*`; mapping table in the CSS comment), plus one
  class per type token (`.type-display` ... `.type-mono`). Rebuilt sections
  use only these.
- Desktop `zoom: 0.9` removed (Hussain, 2026-10-21): build at v7's true size.
- Page title: "Hussain Alam | Operator turned PM".

### Phase 2: Header + Hero (done 2026-10-21)
- Sticky frosted header: brand left, Career / Entrepreneurship / Beyond Work.
- Board hero: info strip "Operator turned PM · Based in New York" (no repeated
  name, no clock), name, bio ending at "build things on the side.", contact
  ticket with one-color LinkedIn / envelope / GitHub icons + handles
  (GitHub: https://github.com/KarnerAI), framed square portrait.
- Remove the Notion cover photo, round avatar, emoji and the hero quote.
- Fixed the old hero heading skip (one h1, no h3s) and FINDING-017 (contact
  rows are 52px tall). Hero name is solid ink; no entrance animation.

### Phase 3: Einstein bridge band (done 2026-10-21)
Quote (small, 22 to 34px) + "Albert Einstein" + "Out of college, I went where
the work happens: the brewhouse floor of a Fortune 100 company. I've learned
every role since the same way, by doing the job up close before trying to
improve it." Leads straight into Career. (Paragraph rewritten in v0.2.3.1;
the live copy is in `src/components/sections/Bridge.tsx`.)

### Phase 4: Career timeline (done 2026-10-21)
- Four equal segments; cards above (1, 3) and below (2, 4); cards size to
  their content; pinned segment fills Karner blue; detail panel; arrow keys
  and Escape; mobile stack.
- Logos in white tiles with `object-fit: contain`; KarnerBlu uses
  `public/logos/karnerblu-mark.png`.
- KarnerBlu clients row (Unilever, Staples) on the card and in the panel; in
  `src/data/career.ts` drop the location/bullet that repeat the clients.
- The one animation: blue fill sweeps the bar segment by segment, stems
  draw, cards fade up 8px; runs once; static design without JS or with
  reduced motion.

### Phase 5: Things I've started (done 2026-10-21)
Four across at 1024px+ (2×2 tablet, 1 column phone), "Read story" aligned;
covers: EmojiFriends photo, SpreadTheFacts wordmark on black, Navigate.AI
score card (`public/ventures/navigate-ai-score.png`), Spots real screens from
the original app (`public/ventures/spots-app.webp`); restyled story dialog,
whose badge shows `logoSrc` when set (Spots and SpreadTheFacts have logos).
The Spots cover and the two logos come from v8
(`design-variants/2026-10-21-fullpage-productui-v8.html`), added 2026-10-22.

### Phase 6: Beyond Work (v7 built 2026-10-21; v8 hover video and mentor chapters open)
Built as in v7 in `HobbyMosaic.tsx`. The media approved 2026-10-21 (v8) were
added 2026-10-22 as `hero` in `src/data/beyondWork.ts`: `riding-poster.jpg`
(position "50% 12%") and `building-with-ai.webp` ("50% 45%"). The story
dialog's photo carries `hero.alt`; the tile's stays decorative. Still to build
in `HobbyMosaic.tsx`, following v8:
- Riding & driving hover video: `riding-loop.mp4` (14s, 1080x1350 at the
  phone clip's full width, 6 Mbps H.264, about 10.6 MB, muted, no audio)
  plays while a mouse hovers, never on touch or pen or with reduced motion
  (checked on every hover); start on the first real mouse move inside the
  tile (non-zero movement), not on pointerenter, because scrolling under a
  still cursor sends synthetic pointer events; load it once; seek to
  `data-start` (9.4s, the still's frame) only after `loadedmetadata`; the
  still is `riding-poster.jpg` (1080x1350). Both are SDR from the same frames:
  the clip is tagged BT.709 and the still sRGB with the same pixel values, so
  Chrome hands off cleanly. In Safari, check the handoff for a small
  brightness lift; if it lifts, export a re-tagged clip (sRGB transfer) under
  a new name such as `riding-loop-srgb.mp4` for the site, since v8 loads
  `riding-loop.mp4` and DESIGN-VARIANTS.md forbids overwriting it. Seeking
  needs a server with Range support: Vercel and `next dev` have it, and the
  local mockup preview server (`.claude/serve-static.mjs`, untracked) does too.
- Riding & driving crop where the frame is wide: the lead tile at 640-767px
  (2 columns by one 240px row, about 2.5:1) shows the helmet and sky, and the
  720x340 story header (768px and up) cuts the bike off below the handlebars.
  v8 crops the same way; no single focal point fits a 4:5 still there. Needs a
  landscape still or a per-surface focal point.
- Youth mentor story as two stacked chapters (iMentor, then BUILD), each with
  `logo-imentor.png` / `logo-build.png`, a heading and a photo slot. Chapters
  replace `story` for this hobby (the iMentor chapter is today's first story
  paragraph), so `story` becomes optional when `chapters` is set and the
  dialog renders one or the other; decide whether the "If you're
  early-career..." paragraph survives. Photos of the mentees stay out of the
  repo (it is public) until each mentee agrees: Hussain to ask his iMentor
  mentee (photos ready from `images/Hobbies/Youth Mentor/iMentor/IMG_4074.JPG`
  and `IMG_4064.JPG`, stored sideways, rotate 90°) and to find a BUILD photo.
  Until then the tile shows its placeholder.
- Martial arts and Festivals & salsa: folders in `images/Hobbies/` are empty.

### Phase 7: Education + Footer (done 2026-10-21, built as in v7)
Review in v7 first, then build.

### Phase 8: QA and ship
- Done 2026-10-21: Tokyo Transit palette retired (old names are now aliases
  of theme B, kept only for the archived map variants and /design pages);
  Inter + Instrument Serif and the h1/h2 serif rule removed; unused
  components deleted (Contact, SideProjects + its data, EducationLogo,
  HobbyTile, HobbyModal, HobbyPhoto); edit mode on theme B colors; CLAUDE.md
  migration note removed; README palette updated.
- QA done 2026-10-21 (/qa at 1280, 820 and 375; keyboard, dialogs, links,
  console; reduced motion by static read). One bug found and fixed: the
  header highlight never cleared over the hero or Education (Fixed by /qa on
  build-theme-b-redesign, 2026-10-21). Health 99.5 → 100. Then `/ship`.
- Shipped as v0.2.0.0 (2026-10-22) after /ship: tests and CI added, two
  reviews and an adversarial review. Follow-ups are under "From the v0.2.0.0
  ship" below.

### Build rule (Hussain, 2026-10-21)
Implement the remaining sections exactly as in v7; don't stop for design
questions. Decided: section chips stay; numbers stay inside the sentences as
in v7; the one hexagon is the header brand mark; hero name is solid ink.

### Open content items (not design)
- Stale content: "Next up: Turkey, September 2026"; Navigate.AI beta dates
  (April to May 2026); YC Startup School year; hobby stories that are still
  placeholders.

## Accessibility

### [P2] iOS backdrop-filter stack QA on physical device
**Files:** `src/components/layout/Header.tsx:124,172`
**Priority:** P2
**Noticed on:** design-review-4.21.26 (adversarial review finding #12)

Two stacked `backdrop-blur` layers (sticky header + Dialog overlay) can
stutter or render as a solid color on iOS Safari. Browse QA ran at 375×812
but not on a physical iPhone. Verify on device before launch; drop the
sticky header blur to a semi-transparent solid fill if it flickers.

---

## Design

### [P3] Venture cards: clamp `logoInitials` length
**Files:** `src/components/sections/Entrepreneurship.tsx:55-66`,
`src/types/index.ts` (Venture type)
**Priority:** P3
**Noticed on:** design-review-4.21.26 (adversarial review finding #5)

Current ventures use 2–3 character initials (EF, STF, SP, NA) which fit
the 72px glyph inside the 150px cover. No length cap in the type, so a
future 4+ character value would overflow horizontally and be clipped by
`overflow-hidden`. Low-risk right now; worth a `maxLength` on the type or
an auto-fit class before the next venture lands.

---

### [P3] Spots: real app screens in the story
**Files:** `src/data/entrepreneurship.ts` (Spots entry), `src/types/index.ts`
(Venture type), the story dialog
**Priority:** P3
**Noticed on:** plan-eng-review 2026-10-21

The Spots card cover now shows the original app's screens
(`public/ventures/spots-app.webp`) and the story badge shows the logo. What's
left is a screen gallery inside the story. Hussain picked five screens, one
per problem the app solves:
1. Save places you love and want to go: map view + save-to-list picker
2. Discover new ones from friends: newsfeed
3. View all your and friends' spots: map view
4. Collaborate, create lists and trips: list view
5. Collect spots, make memories, explore the world: profile

Sort out three things before building:
- The story copy says Spots was a Sketch/InVision prototype that got shelved;
  the screens are Spots 2.0 (2026). Rewrite Built/Outcome, or label the
  screens with the year.
- Source: the Figma page "Option A: clear utility" isn't in the May redesign
  file (figma.com/design/HDrYuzpaCTKJd9QcDcCEkf), whose map is a placeholder
  grid and whose tab bar has 3 tabs. Find the right file, or use real
  screenshots of the older app instead.
- Build the screen gallery into the Phase 5 restyled dialog, not the current
  one. Screens 1 and 3 are both maps: show the save picker open on 1 and
  friends' pins on 3 so they don't read as duplicates.

**Depends on:** Phase 5 (Things I've started).

---

### [P2] Beyond Work: copy that no longer matches the photos
**Files:** `src/data/beyondWork.ts`, v8 mockup `HOBBIES`
**Priority:** P2
**Noticed on:** hobby media pass 2026-10-21

- Youth mentor says "Mentee just graduated college", but the June 2026
  photos are a high school graduation. Meta says City:
  New York only, while BUILD was in Boston.
- The BUILD chapter text in v8 (Royalty Lip Scrub, pitch night, a 2022
  graduation) stays as written (Hussain, 2026-10-23). Still needed: a photo
  of him with his BUILD student.
- Riding & driving tagline and story are about Colombia; the photo and hover
  clip are from Portugal (Aug 2026). Kept as is for now (2026-10-21); later,
  broaden the copy or swap the clip.

---

## From the v0.2.0.0 ship (2026-10-22)

### [P3] Dev-only audit advisories left after the Next.js bump
**Files:** `package.json` (vitest, @types/node)
**Priority:** P3
None of these ship to the site (`npm audit --omit=dev` is clean), but npm
rates vitest and tinypool critical, braces high and @vitest/mocker moderate.
vitest 4.1.12 clears all three vitest ones: it drops tinypool and still
accepts @types/node 20. (npm suggests vitest 5, which also needs
@types/node 22+ and Node 22.12+.) braces via eslint-config-next's fast-glob
has no fix yet: npm's only offer is a downgrade to eslint-config-next 14, so
wait for an upstream release.

### [P2] Career, venture and hobby story text in the page HTML
**Files:** `src/components/sections/CareerTimeline.tsx`, `Entrepreneurship.tsx`, `HobbyMosaic.tsx`
**Priority:** P2
Achievements and stories render only after a click, so search engines and AI
summarizers never see them. Render every panel on the server, hidden until
opened; keep tenure() hydration-safe.

### [P2] Type-scale classes beat Tailwind utilities
**Files:** `src/app/globals.css` (`.type-*` block), `Bridge.tsx`
**Priority:** P2
The unlayered `.type-*` classes override utilities on the same element (the
bridge paragraph loses its leading and phone size). Wrap them in
`@layer components`, then compare every section against v7.

### [P2] Map pins for keyboard and screen readers
**Files:** `src/components/sections/beyondwork/map-variants/TravelMapThemeBPins.tsx`
**Priority:** P2
Country names show on mouse hover only; the alt text gives a count. Add the
visited country list as text for screen readers and a keyboard/touch path.

### [P3] Smaller follow-ups
**Priority:** P3
- Career timeline assumes exactly four chapters (`CareerTimeline.tsx` DESKTOP_TOP/BOTTOM, stems, CSS repeat(4)).
- One source for the map's countries (pins, tint table and count can drift).
- Self-host the six Google favicon logos (privacy, flake, placeholder icons).
- Design decisions vs DESIGN.md: press states, timeline breakpoint (768 vs 1024px), the two infinite pulse animations, `.sub-label` margin.
- Dead code: `src/lib/utils.ts` (+ clsx, tailwind-merge), `Hobby.gallery`, `Venture.coverEmoji`.
- Coverage tooling (`@vitest/coverage-v8`).

---

## Completed

- **Next.js advisory** · next and eslint-config-next 16.2.4 → 16.4.2, plus non-breaking audit fixes for build tooling; lint, unit, e2e and build pass — **Completed:** v0.2.1.0 (2026-10-22)
- **Orphaned contact API** · deleted with its helpers, Resend and Zod; an e2e check keeps it gone — **Completed:** v0.2.0.0 (2026-10-22)
- **Resend key** · revoked in Resend; neither Vercel project (`hussainalam`, `personal-web-site`) ever had the contact env vars, so the old route could not send mail — **Completed:** 2026-10-22
- **Pre-existing lint: setState-in-effect** · both files moved to useSyncExternalStore — **Completed:** v0.2.0.0 (2026-10-22)
- **Bootstrap a test framework** · Vitest + RTL + Playwright, CI on push — **Completed:** v0.2.0.0 (2026-10-22)
- **Instrument Serif fake-bold** · the serif is retired; Geist ships every weight — **Completed:** v0.2.0.0 (2026-10-22)

- **Hero heading hierarchy** · hero is one h1 with no h3 labels (theme B rebuild) — **Completed:** `build-theme-b-redesign` (2026-10-21)
- **FINDING-017** · Hero contact rows are 52px tap targets (theme B rebuild) — **Completed:** `build-theme-b-redesign` (2026-10-21)
- **FINDING-016** · Desktop `zoom: 0.9` removed (theme B builds at true size) — **Completed:** `build-theme-b-redesign` (2026-10-21)
- **FINDING-009** · `text-wrap: balance` on h1/h2/h3 — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-011** · Darken `--muted` to pass WCAG AA — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-004** · Unify section H2 sizes at 48–60px — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-005** · Nav link tap targets ≥ 44×44 — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-002** · Demote Hero About/Contact H2 → H3 — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-003** · Convert 11px labels from H3 → P — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-006 / 007** · Curly apostrophes + quotes — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-014** · Instrument Serif on H1/H2 — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-010** · EditModeToggle env gate — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-001** · Mobile nav drawer (Radix Dialog) — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-015** · Global `:focus-visible` ring — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-008** · Real venture case studies — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-012** · Initial-as-glyph venture covers — **Completed:** v0.1.1.0 (2026-04-22)
- **FINDING-013** · Status chip promoted top-left, color-coded — **Completed:** v0.1.1.0 (2026-04-22)
- **Adversarial #3** · Radix Dialog missing Description — **Completed:** v0.1.1.0 (2026-04-22)
- **Adversarial #6** · Fix misleading tree-shaking comment — **Completed:** v0.1.1.0 (2026-04-22)
- **Pre-landing review** · `:focus-visible` border-radius override — **Completed:** v0.1.1.0 (2026-04-22)
