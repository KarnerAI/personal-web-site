# Changelog

All notable changes to hussainalam.com are documented here. This site follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions and a
4-digit version scheme (`MAJOR.MINOR.PATCH.MICRO`) tracked in `VERSION`.

## [0.2.3.1] - 2026-10-24

A clearer intro. The headline reads one sentence per line, and the line under
the Einstein quote now says what the brewhouse floor taught.

### Changed
- Hero: the bio says Fortune 500 and shows one sentence per line on wide
  screens. On smaller screens each sentence wraps evenly, with no word left
  alone on its last line.
- Under the Einstein quote: a new paragraph about starting on the brewhouse
  floor at Anheuser-Busch and learning that real knowledge comes from being
  close to the people doing the work, not from dashboards.
- The page description, the career intro line and the first career chapter
  say Fortune 500 too, so every mention matches.

## [0.2.3.0] - 2026-10-23

Real photos for the ventures and hobbies. Spots now shows screens from the
actual app, two story popups show their logos, and two hobby tiles have real
photos instead of placeholders.

### Added
- Spots: a banner of real app screens on its card (friends' names blurred)
  and the Spots logo in its story.
- SpreadTheFacts: its logo in its story.
- Riding & driving: a sharp photo of the ride on its tile and in its story.
- Building with AI: the three design directions for this site, made with AI,
  with the chosen one in front.
- The v8 design mockup with this media, plus the next things to build: a
  riding video that plays when you hover with a mouse, and the Youth mentor
  story told as two chapters.

### Changed
- A hobby's story photo now has a description screen readers can read.
- Photo tiles keep their color wash under the photo while it loads.

## [0.2.2.0] - 2026-10-22

A safety net for security updates. A newly published advisory against a
package the site ships now turns CI red, on the next push and within a day
even if nobody pushes, instead of going unnoticed. Nothing on the page
changes.

### Added
- A security check runs on every push, next to the tests rather than in
  front of them, so a new advisory or an npm outage never hides test
  results. It fails on high or critical advisories against packages the
  site ships, and leaves out most tools used only for development and
  testing.
- The same check runs once a day on its own, in a separate workflow, so a
  quiet stretch can never switch off the regular push checks.

### Changed
- TESTING.md explains what to do when the security check fails: how to
  tell an npm outage from a real advisory, list exactly which advisories
  failed, find the fixed version, and keep watch when no fix exists yet. It
  also covers what the check does not look at and who GitHub emails when
  the daily run fails.

## [0.2.1.0] - 2026-10-22

A security update. The site now runs on Next.js 16.4.2, which closes every
published Next.js advisory against the version it was on, including the
image-resizing and server rendering issues. Nothing on the page changes.

### Fixed
- Next.js 16.2.4 → 16.4.2 (and its lint config to match). This also brings
  patched versions of sharp, which resizes images, and PostCSS.
- Safe, non-breaking updates for several build and test tools that npm
  flagged.

### Changed
- AGENTS.md carries the current Next.js agent instructions, so running the
  dev server no longer edits it unexpectedly.
- TESTING.md explains the new Next.js upgrade check that can stop a build
  run by an AI agent when an advisory applies, and how to get past it.

## [0.2.0.0] - 2026-10-22

The redesign. The whole site is rebuilt in theme B, the light product UI
locked in the v7 mockup: Karner blue, Geist type, a faint grid, and one
signature motion on the career timeline. Every page now has automated tests
behind it.

### Added
- A sticky header with the KarnerBlu hexagon mark. The link for the section
  you are reading lights up, and phones get a slide-in menu.
- A new hero: "Operator turned PM", the bio, a contact card with LinkedIn,
  email and GitHub, a "Get in touch" button, and a new NYC skyline portrait.
- The Einstein quote now has its own band between the hero and the career
  story, followed by a short paragraph on learning each role up close.
- The career timeline: four chapters on a year bar that fills in as you
  scroll to it. Click a chapter or use the arrow keys to open its details;
  Escape closes them. KarnerBlu shows its Unilever and Staples client logos.
  Phones get a stacked list that expands in place.
- Venture cards open the full story (Problem, Built, Outcome, Lesson) in a
  dialog. Navigate.AI's card shows a real score card from the product.
- Beyond Work: a world map with a pin for each of the 16 countries, travel
  stats, and a hobby mosaic where every tile opens its story.
- Education: the degree card and a certifications table with school logos.
- Keyboard friendly: picking a section from the phone menu moves focus to
  that section, and Escape over a story closes just the story.
- Automated tests for the first time: 50 unit tests and 10 browser tests
  covering the header, the career timeline, every dialog, image fallbacks,
  the map and reduced motion. Lint and both suites run on every push.

### Changed
- Page title: "Hussain Alam | Operator turned PM".
- Type is Geist and Geist Mono throughout, and colors come from the theme B
  tokens. The desktop 90% zoom is gone, so the site renders at true size.
- Faster first load: the world map's outlines load as a separate cached
  image instead of filling over half the page, logos are small copies that
  load as you scroll (the AB InBev logo went from 2.4 MB to 20 KB), and the
  hero portrait is fetched first.

### Removed
- The Tokyo Transit palette, the Inter and Instrument Serif fonts, the
  unused contact form, side projects and old hobby tile components, and six
  unused packages.
- The contact email API. No page used it, and anyone could script emails to
  your inbox through it. Visitors reach you through the email link in the
  hero. The Resend and Zod packages went with it.

## [0.1.4.0] - 2026-10-21

Real covers on every venture card, a copy pass that removes the AI-sounding
dashes and fixes a few facts, and the locked design system for the coming
redesign.

### Added
- Real covers on the "Things I've started" cards: the EmojiFriends bead
  photo, the SpreadTheFacts wordmark on black and the Spots logo on dark
  teal. Logos sit centered on a solid band; photos fill the band.
- The EmojiFriends story now links to the Insomniac feature ("Read the
  Insomniac feature ↗") instead of a dead placeholder link.
- `DESIGN.md`: the design system for the redesign (light product UI in
  Karner blue, Geist + Geist Mono, color and type tokens, motion rules and
  three guardrails: lead with numbers, one KarnerBlu detail, restraint on
  effects).
- Standalone HTML mockups under `design-variants/` from the redesign
  exploration: four full-page directions, a hero sampler in seven themes,
  the full site in seven themes, and the shortlist rounds ending with the
  locked theme B (`2026-10-20-fullpage-productui-v7.html`).

### Changed
- Site copy no longer uses em-dashes; sentences use periods, commas and
  parentheses instead. Date ranges keep their en-dash.
- Venture card hooks lead with numbers (EmojiFriends: $6K raised, featured
  on Insomniac; SpreadTheFacts: $5,500 raised, 6,500 masks with Mass
  General Brigham).
- Quote attributions sit on their own line ("Albert Einstein", "Attributed
  to Saint Augustine") instead of trailing after a dash.
- The career summary uses arrows between chapters; screen readers hear
  "then" between them, and copied text stays clean.
- Career facts agree with each other: Zoomo was Series-A, and the
  consultancy was co-founded.
- The YC credential is listed as Startup School, and a certification with
  no known year no longer shows a dash in place of the year.
- Page title uses a pipe: "Hussain Alam | Product Strategist & Builder".

### Fixed
- The site no longer breaks (500 error, garbage CSS) when raw photos,
  videos or saved web pages are dropped into the repo: Tailwind skips
  `images/`, `design-themes/` and `design-variants/`, and the first two are
  gitignored.
- Venture covers load fast: the site uses card-size copies (25 KB and
  7 KB instead of 435 KB and 802 KB), loads them lazily, and works in
  browsers without AVIF support.
- A cover image that fails to load shows the venture's initials on its
  color band instead of a blank band or a broken-image icon.

## [0.1.3.0] - 2026-05-16

Career Timeline redesign with a chapter-tagline card style, a full-width
pull-quote summary, and a new mobile layout. Hero bio + contact polish
ride along.

### Added
- Mobile vertical layout for the Career Timeline. Each chapter renders
  as a stacked card with a year-range chip; horizontal Gantt is desktop-only
  (`md:block`). Fixes a 29px horizontal-scroll bug on 375px viewports.
- `tagline` field on `CareerRole` — short editorial chapter label rendered
  in vermillion uppercase mono inside each card (Operational Excellence,
  Founder Mode, Startup Operator, Turnaround at Scale).
- Four standalone HTML design variants under `design-variants/` for the
  timeline exploration that drove this pass, plus a side-by-side board.

### Changed
- Career section summary swapped from muted body paragraph to a
  full-content-width pull-quote (Inter 18px medium, vermillion left rule).
  Matches the typographic family of the Einstein quote in About so the
  two callout blocks read as the same component family.
- Timeline cards now show company name (anchor) above the tagline
  (chapter label). Removed the redundant role-title subtitle that was
  duplicating the literal job title.
- Career section padding restored to the standard `.section` rhythm
  (was `!pb-0`, creating uneven gaps to the next section).
- Hero bio: "12+ years" → "13+ years"; "start things on the side" →
  "build things on the side".
- WeWork chapter summary rewritten in personal-story voice ("Signed
  three months before WeWork filed for bankruptcy...") to match the
  voice of the other three chapters.
- Touch targets bumped to 44px minimum on the header brand link,
  contact aside links (LinkedIn / Email / Writing), and the "Get in
  touch" CTA for mobile usability.

## [0.1.2.0] - 2026-05-16

Redesign pass on the Beyond Work section and a Career Timeline design
exploration. Introduces a reusable hobby tile system with a modal detail
view, lays down the design-variants archive convention, and captures a
shotgun of timeline mockups for a follow-up pick.

### Added
- Hobby tile system on the Beyond Work section — `HobbyTile`,
  `HobbyPhoto`, and `HobbyModal` components. Tiles open a Radix dialog
  with photo, description, and metadata; keyboard-navigable and
  screen-reader friendly.
- `DESIGN-VARIANTS.md` convention doc — codifies where TSX variants
  (`src/components/sections/{section}/variants/`) and standalone HTML
  mockups (`design-variants/`) live, plus the "never delete a variant"
  rule.
- Career Timeline v2 + v3 mockup shotgun (12 standalone HTML variants
  under `public/mockups/`) plus side-by-side compare pages, so the next
  pass can pick a direction from real layouts instead of from a brief.
- Geo-projection TravelMap variant cleanup pass (`TravelMapGeo.tsx`).

### Changed
- Beyond Work section refactored to use the new hobby tile system.
- Career Timeline component refreshed in line with the upcoming v2/v3
  direction.
- `beyondWork` data model + types extended to feed the tile/modal flow.

## [0.1.1.0] - 2026-04-22

Design-review pass ahead of the 2026-05-03 public launch. Fifteen audit findings
addressed across fourteen bisectable commits, plus two fixes surfaced by a
pre-landing adversarial review.

### Added
- Mobile nav drawer, powered by a Radix Dialog with proper focus trap,
  Escape-to-close, backdrop dismissal, and ≥44×44 tap targets for every link.
  The previous header had no mobile nav at all below the `md` breakpoint.
- Instrument Serif on H1 and H2 display type. Body copy stays on Inter — the
  serif is the editorial counterweight, not a wholesale rebrand.
- Global `:focus-visible` ring using the vermillion accent token so every
  interactive element now has a visible keyboard-focus state out of the box.
- Real venture case studies on EmojiFriends, SpreadTheFacts, Spots, and
  Navigate.AI — sourced from LinkedIn, Notion, Google Drive, and the
  SpreadTheFacts pitch deck. Placeholder copy is gone.
- Initial-as-glyph covers on venture cards (72px serif glyph over gradient)
  replacing emoji-as-icon. Non-breaking fallback keeps `coverEmoji` as the
  last resort.
- Accessible mobile drawer description (`Dialog.Description` / sr-only) so
  Radix stops logging missing-description warnings in dev and screen readers
  get proper context.

### Changed
- Muted text token darkened from `#5f6b85` to `#4b5670` — now clears WCAG AA
  on the cream background (7:1 contrast, AAA for body text).
- Section H2s unified at 4xl/5xl (48–60px) so "Things I've started" no longer
  stands 12px taller than every other section heading.
- Nav link tap targets now meet 44×44 WCAG minimum via vertical padding.
- Hero About/Contact labels demoted from `<h2>` to `<h3>` — the rendered 18px
  size no longer pretends to be a top-level section heading.
- "Hobbies" / "Degree" / "Reading & listening" / "Certifications" labels
  converted from `<h3>` to `<p>` — visual style preserved, semantic noise
  removed.
- Venture status chip promoted from bottom-right utility to top-left card
  identifier, color-coded by state (Active emerald, Shipped blue, Acquired
  vermillion, Paused zinc, Experimental amber). Western eye-path lands there
  first; makes the card scan-readable in a single saccade.
- `text-wrap: balance` applied to H1/H2/H3 so long titles no longer leave
  orphan words on the last line.
- All straight apostrophes and quotes across source copy and data files
  normalized to curly punctuation.
- Pre-existing EditModeToggle now gated behind `NEXT_PUBLIC_EDIT_MODE=1` or
  `NODE_ENV=development` so the pencil never renders on the public site.

### Fixed
- Global `:focus-visible` no longer overrides each element's own
  border-radius. Rounded pills and buttons keep their shape while focused;
  outlines follow the element's native radius in modern browsers.
- Removed a fabricated "Anheuser-Busch" tag on EmojiFriends that slipped in
  during an earlier placeholder pass — replaced with truthful tags sourced
  from the original Kickstarter campaign.

### Metrics
- Design score: **B− → A**
- AI-slop score: **C+ → A−**
- Goodwill score: **45 → 90**
- Page load: **785ms → 708ms** (faster than pre-design-pass baseline)
- Trunk test: desktop 5/6 + mobile 2/6 → **all pass**
