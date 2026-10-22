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

### Phase 2: Header + Hero
- Sticky frosted header: brand left, Career / Entrepreneurship / Beyond Work.
- Board hero: info strip "Operator turned PM · Based in New York" (no repeated
  name, no clock), name, bio ending at "build things on the side.", contact
  ticket with one-color LinkedIn / envelope / GitHub icons + handles
  (GitHub: https://github.com/KarnerAI), framed square portrait.
- Remove the Notion cover photo, round avatar, emoji and the hero quote.
- Fixes the P1 hero heading-hierarchy item and FINDING-017 tap targets below.

### Phase 3: Einstein bridge band (new)
Quote (small, 22 to 34px) + "Albert Einstein" + "Out of college, I went where
the work happens: the brewhouse floor of a Fortune 100 company. I've learned
every role since the same way, by doing the job up close before trying to
improve it." Leads straight into Career.

### Phase 4: Career timeline
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

### Phase 5: Things I've started
Four across at 1024px+ (2×2 tablet, 1 column phone), "Read story" aligned;
covers: EmojiFriends photo, SpreadTheFacts wordmark on black, Navigate.AI
score card (`public/ventures/navigate-ai-score.png`), Spots logo on navy
(`public/ventures/spots.png`) until real app screenshots arrive (see the P3
Spots screenshots item); restyled story dialog.

### Phase 6: Beyond Work (not yet reviewed in B)
Review the map, stat cards, fact rows and hobby mosaic in v7 with Hussain
first. Real photos: export web-sized copies from `images/Hobbies/` (Riding &
Driving, Youth Mentor have photos; the other three still need them) into
`public/images/hobbies/`.

### Phase 7: Education + Footer (not yet reviewed in B)
Review in v7 first, then build.

### Phase 8: QA and ship
Delete the Tokyo Transit tokens, Inter + Instrument Serif and the old
h1/h2 serif rule once no section uses them; remove the CLAUDE.md migration
note. Then `/qa` (desktop, tablet, phone, keyboard, reduced motion),
`/design-review` against DESIGN.md, `npm run build` + lint clean, `/ship`.

### Open decisions (ask Hussain during the build)
- Section chips ("• CAREER •") above headings: keep, or let headings stand
  alone.
- Guardrail 1: where the stat treatments go (career detail panel, venture
  cards, a "by the numbers" line). Results on the timeline cards themselves
  were declined.
- Guardrail 2: where the single hexagon motif lives (e.g. timeline nodes).
- Stale content: "Next up: Turkey, September 2026"; Navigate.AI beta dates
  (April to May 2026); YC Startup School year; hobby stories that are still
  placeholders; WeWork tenure label (data counts to April 2026).

## Accessibility

### [P1] Hero heading hierarchy skips h2
**File:** `src/components/sections/Hero.tsx:82,111`
**Priority:** P1
**Noticed on:** design-review-4.21.26 (adversarial review finding #9)

The Hero H1 is followed immediately by the demoted `<h3>` "About" and
`<h3>` "Contact" labels, with no intervening `<h2>`. The next `<h2>` on the
page is the Career section further down. Axe and Lighthouse flag the level
skip as WCAG 1.3.1.

The demotion was intentional (design finding FINDING-002 — the 18px label
shouldn't be styled as a top-level heading). Two acceptable fixes:
(a) Add a visually-hidden `<h2 class="sr-only">Introduction</h2>` above the
Hero sub-grid, or
(b) Keep the markup as-is and add an explicit `aria-level="2"` with
`role="heading"` if h3 should announce as h2.

Decision needed from Hussain before picking a path.

---

### [P1] Pre-existing lint: setState-in-effect (2 files)
**Files:** `src/components/edit-mode/EditModeContext.tsx:53`,
`src/components/sections/beyondwork/map-variants/TravelMapLeaflet.tsx:60`
**Priority:** P1
**Noticed on:** design-review-4.21.26 (ship /lint pass)

Both files were introduced in commit `a8d43f1` and are unrelated to the
design-review branch. React 19's `react-hooks/set-state-in-effect` rule
flags them. Current behavior is correct — the setState calls gate rendering
until mount (hydration guard) and restore persisted state from
localStorage — but the lint rule wants the pattern expressed via `useSyncExternalStore`
or a derived-state approach instead.

Not runtime bugs. Fix before the next feature ships so the lint passes
clean and new findings don't hide behind the two known failures.

---

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

### [P2] Instrument Serif + font-semibold synthesizes fake-bold
**Files:** `src/app/globals.css:55-60`, all section h2s
**Priority:** P2
**Noticed on:** design-review-4.21.26 (adversarial review finding #7)

Section H2s use `font-semibold` (Tailwind → weight 600) but Instrument
Serif ships only at weight 400. The browser synthesizes fake-bold for the
600 glyphs, which can look smeared at large sizes. The third-pass audit
rated the site A on design so the effect isn't catastrophic, but a
post-launch tuning pass should either (a) drop `font-semibold` on section
H2s and let the serif hold weight on its own, or (b) switch to a serif
that ships regular + semibold.

---

### [P2] FINDING-017 — Hero contact links below 44×44 tap target
**File:** `src/components/sections/Hero.tsx` (LinkedIn + Email inline anchors)
**Priority:** P2
**Noticed on:** design-audit-20260422-followup (third-pass design review)

The inline "LinkedIn /in/hussainalam" and "Email hi@…" rows in the Hero
contact sidebar render at 18–20px tall, below the 44×44 WCAG minimum.
One-commit fix: add `min-h-[44px] py-2` to the anchors, or convert to
styled pills like the nav links already use.

---

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

## Testing

### [P2] Bootstrap a test framework
**Files:** project-wide
**Priority:** P2
**Noticed on:** design-review-4.21.26 (ship step 4)

Declined during ship via `.gstack/no-test-bootstrap` to unblock the
design-review landing. Next.js 16 + React 19 + Tailwind v4 project has
no tests. Minimum viable bootstrap: Vitest + React Testing Library +
Playwright for E2E. Delete `.gstack/no-test-bootstrap` and re-run
`/ship` in a fresh branch to trigger the bootstrap flow.

---

## Completed

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
