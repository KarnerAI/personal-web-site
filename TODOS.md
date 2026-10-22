# TODOS

Follow-ups tracked by skill/component, priority-ordered (P0 top → P4 bottom),
then the Completed section at the bottom. Source of truth for "what's left
before launch" and "what's acceptable to punt."

## [P0] Redesign build: theme B (light product UI, Karner blue)

Locked 2026-10-20. Visual source of truth:
`design-variants/2026-10-20-fullpage-productui-v7.html`. Rules and tokens:
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
improve it." Leads straight into Career.

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
score card (`public/ventures/navigate-ai-score.png`), Spots logo on navy
(`public/ventures/spots.png`) until real app screenshots arrive (see the P3
Spots screenshots item); restyled story dialog.

### Phase 6: Beyond Work (done 2026-10-21, built as in v7)
Review the map, stat cards, fact rows and hobby mosaic in v7 with Hussain
first. Real photos: export web-sized copies from `images/Hobbies/` (Riding &
Driving, Youth Mentor have photos; the other three still need them) into
`public/images/hobbies/`.

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

Spots shows only its logo today. Hussain picked five screens, one per problem
the app solves:
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

## From the v0.2.0.0 ship (2026-10-22)

### [P3] Dev-only audit advisories left after the Next.js bump
**Files:** `package.json` (vitest, @types/node)
**Priority:** P3
None of these ship to the site. vitest 3 (plus its tinypool and
@vitest/mocker) clears with vitest 5, which needs @types/node 22+.
braces via eslint-config-next's fast-glob has no fix yet: npm's only offer
is a downgrade to eslint-config-next 14, so wait for an upstream release.

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

- **Next.js advisory** · next and eslint-config-next 16.2.4 → 16.4.2, plus non-breaking audit fixes for build tooling; lint, unit, e2e and build pass — **Completed:** 2026-10-22
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
