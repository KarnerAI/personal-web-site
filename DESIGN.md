---
# gstack: design-md-format=spec
name: Hussain Alam
description: Light, crisp product-software polish in KarnerBlu blues; a quiet page that lets an operator-turned-PM's results do the talking.
colors:
  primary: "#0A6EAA"          # Karner deep blue (from the KarnerBlu logo): buttons, links, active and pinned states, the timeline fill
  primary-hover: "#085A8C"
  on-primary: "#FFFFFF"
  sky: "#00AEEF"              # Karner sky blue: glows, gradient stops, live dots; never small text
  peach: "#FFB37A"            # warm partner to sky in background washes and the stat-card top edge
  signal: "#E63B1E"           # vermillion: exactly one small touch per page (the Active status dot)
  text: "#0F1E3D"             # ink navy
  text-secondary: "#3D4760"   # slate: body copy, bios, hooks
  text-muted: "#6B7280"       # mono labels, meta, cites
  border: "#E5E7EB"
  border-subtle: "#EEF0F3"
  page: "#FBFBFA"
  surface: "#FFFFFF"
  surface-sunken: "#F4F7FA"   # icon tiles, contact-row icons
  tag: "#F5F7F9"
  status-shipped: "#0A6EAA"
  status-experimental: "#F5A05E"
  status-active: "#E63B1E"
typography:
  display:
    fontFamily: Geist
    fontWeight: 600
    fontSize: clamp(48px, 6.4vw, 84px)
    letterSpacing: -0.05em
    lineHeight: 1
  heading:
    fontFamily: Geist
    fontWeight: 600
    fontSize: clamp(34px, 4.6vw, 52px)
    letterSpacing: -0.045em
    lineHeight: 1.04
  quote:
    fontFamily: Geist
    fontWeight: 600
    fontSize: clamp(22px, 2.4vw, 34px)
    letterSpacing: -0.025em
    lineHeight: 1.22
  title:
    fontFamily: Geist
    fontWeight: 600
    fontSize: clamp(21px, 1.6vw, 24px)
    letterSpacing: -0.03em
    lineHeight: 1.2
  body-lg:
    fontFamily: Geist
    fontWeight: 400
    fontSize: 19px
    lineHeight: 1.55
  body:
    fontFamily: Geist
    fontWeight: 400
    fontSize: 15px
    lineHeight: 1.55
  label:
    fontFamily: Geist Mono
    fontWeight: 500
    fontSize: 11px
    letterSpacing: 0.1em
  stat:
    fontFamily: Geist Mono
    fontWeight: 400
    fontSize: 44px
    letterSpacing: -0.04em
    fontFeature: tnum
  mono:
    fontFamily: Geist Mono
    fontWeight: 400
    fontSize: 12px
    fontFeature: tnum
rounded:
  xs: 4px       # section chips
  sm: 6px       # tags
  md: 8px       # nav links, small icon tiles
  lg: 10px      # buttons
  xl: 12px      # timeline cards, detail panel, stat cards, icon frames
  2xl: 16px     # venture cards, hobby tiles, contact ticket
  3xl: 20px     # portrait frame, dialogs
  full: 9999px  # info strip, status pills
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 112px
  gutter: 32px
  gutter-phone: 16px
  content-max: 1120px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  section-chip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
  venture-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.2xl}"
  tag:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
  status-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
  nav-link:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
  timeline-segment-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
---

# Hussain Alam

## Overview

**Creative North Star:** a light, precise "product software" page in KarnerBlu blues, because the site is itself evidence of the job Hussain is applying for: an operator turned PM who finds the right problems and ships useful products.

**Product context:** single-page personal site for a PM job search. Primary readers are recruiters and hiring managers doing a 90-second skim; secondary readers are investors and co-founders who want depth. Sections in order: Hero, Einstein bridge, Career, Things I've started, Beyond Work, Education, Footer.

**Mode per surface:** Persuade (hero, bridge), Read (career detail panel, venture stories, hobby stories), Experience (the career timeline's one animation).

**Source of truth for visuals:** `design-variants/2026-10-20-fullpage-productui-v7.html` (theme B, v7), approved 2026-10-20. Build from it; this file records the rules behind it.

**Reference sites:** Product School (productschool.com) for the gradient washes, mono chips and table rows; Hussain's own Behance references (in the untracked `design-themes/` folder) informed the blue + warm-accent pairing.

**Key characteristics (first five seconds):**
- Calm off-white page, crisp hairlines, one blue that clearly owns the page.
- The name is the biggest thing on screen; everything else steps down cleanly.
- Real artifacts instead of decoration: real logos, a real product screenshot, real numbers.
- One moment of motion: the career timeline filling in.

**The three guardrails (agreed at lock-in, 2026-10-20).** B is the closest of the shortlisted themes to the generic "modern software company" look, so these are hard rules:
1. **Lead with the numbers.** The proof ($14M revenue, 10× ARR, 7% → 1% error rate, +30% efficiency, 6,500 masks) is set as standout stat treatments wherever it appears, never buried in body copy. Placement is decided per section during the build (Hussain declined putting results on the timeline cards themselves).
2. **One KarnerBlu signature detail.** Both logo blues work together (deep #0A6EAA + sky #00AEEF), plus one sparing use of the logo's hexagon motif. One place, not a pattern.
3. **Restraint on effects.** The faint grid, sky-to-peach washes and glows stay light and few. If an effect is noticeable before the content, it is too strong.

## Colors

**Strategy:** Committed. Karner deep blue owns interaction and emphasis; sky and peach only appear inside washes, gradients and glows; neutrals are cool grays derived from the ink navy. Vermillion survives from the old Tokyo Transit palette as a single signal (the Active status), which keeps a thread to the original brand without competing with the blue.

**Light or dark:** light only. Recruiters read this on laptops in daylight; there is no dark mode in v1.

Interaction and emphasis use `primary` (links, buttons, pinned timeline segment, focus rings in sky). Body text is `text-secondary`, never pure black. `text-muted` is for mono labels and meta only, and is the floor for contrast (about 4.6:1 on the page). White text sits only on `primary` or darker (5.5:1). Sky never carries text.

## Typography

**Faces:** Geist (display, headings, body) and Geist Mono (labels, years, meta, stats). Loaded with `next/font/google` (both ship as variable fonts, weights 100 to 900); self-hosted by Next, no layout shift. They replace the old Instrument Serif + Inter pair.

**Accepted tradeoff:** Geist is one of the most common faces in modern software UI, which the design-consultation guidance flags as an overused display voice. Hussain chose theme B as built; the product-software register is the point. The distinctiveness has to come from content and the guardrails, not the typeface.

**Scale:** display (hero name) > heading (section titles) > quote (bridge) > title (card names) > body-lg (bio, bridge paragraph) > body > label. Levels differ by size, not just weight. Display stays under 6rem. Mono labels are uppercase with wide tracking; years and metrics always use tabular numerals.

## Layout

- Content max width 1120px with 32px gutters (16px on phones). Sections breathe at 112px vertical padding; the bridge band is tighter and leads straight into Career.
- Breakpoints follow the mockup: four-across ventures and the horizontal career timeline at 1024px and up; 2×2 ventures and a stacked timeline on tablets; single column on phones (under 640px).
- Hero: info strip ("Operator turned PM · Based in New York"), name, bio, contact ticket (LinkedIn, Email, GitHub with one-color icons) and a framed square portrait on the right.
- Career: four equal segments, cards above (1, 3) and below (2, 4) joined by stems; cards size to their content; the detail panel opens under the timeline.
- Things I've started: four equal cards in one row on desktop; real covers only (photo, wordmark, product screenshot, app-style icon), never a repeated name or an initials glyph.

## Elevation & Depth

Depth comes from offset, soft-blur shadows and hairline borders, never zero-offset glow halos. Four levels: resting cards (1px, very soft), raised cards and panels (soft 8 to 24px blur), hover lift (stronger, plus a 2 to 3px upward move), and dialogs (largest, over a translucent slate scrim with a light blur). The one sanctioned glow is the sky ring used for focus and the pinned timeline card.

## Shapes

Radius grows with the size of the thing: 4px chips, 6px tags, 8px nav links, 10px buttons, 12px cards and panels, 16px venture cards and tiles, 20px portrait frame and dialogs, full pills for the info strip and status. Nested elements use a smaller radius than their container. Logos always sit inside a white tile with `object-fit: contain` and padding; nothing is cropped.

## Components

- **Section chip:** solid blue mono label. Optional; see open decisions.
- **Button (primary):** solid `primary`, white text, 10px radius, darkens to `primary-hover` on hover, 1px press on active, sky focus ring. One primary per view ("Get in touch").
- **Contact ticket:** rows of one-color icon + handle + arrow, each a full-width link with a 44px minimum target; the accessible name carries the label ("LinkedIn: /in/hussainalam").
- **Timeline:** white segmented track; segments are buttons; the pinned segment fills `primary` with white years; stems end in small nodes. Keyboard: arrows move between chapters, Escape closes the detail panel.
- **Detail panel:** logo frame, role, mono meta chips, why-I-was-there pull quote, hero bullet, sub-bullets, roles table with right-aligned mono dates; a Clients row for KarnerBlu (Unilever, Staples).
- **Venture card:** 150px cover, status pill (Shipped blue, Experimental amber, Active vermillion), title, hook, mono tags, "Read story" aligned to the card bottom. Opens a dialog with Problem / Built / Outcome / Lesson.
- **Stat card:** white card with a 3px blue-to-sky-to-peach top edge and a mono stat number.
- **States:** every interactive element has hover, focus-visible (sky ring), active, and a text fallback when an image fails. Dialogs trap focus, close on Escape, × and backdrop click, and return focus to the trigger.

## Do's and Don'ts

- Do keep exactly one blue doing the interaction work; sky and peach only in washes and gradients.
- Do show real artifacts (logos, screenshots, photos) and real numbers; mark placeholders honestly until real photos arrive.
- Do let cards size to their content; never stretch a card to match a taller neighbor.
- Do write copy with no em-dashes or en-dashes, and no repeated facts (each fact appears once). The one exception: an en-dash inside a date or number range ("2012 – 2018", "50–100") is fine.
- Do respect `prefers-reduced-motion`: the static design is the final state of every animation.
- Don't add a second animated "moment"; the timeline is the only one.
- Don't use gradient-with-initials covers, emoji as UI, or icons in colored circles above headings.
- Don't let the grid, washes or glows get stronger than they are in v7.
- Don't introduce a third typeface or a second accent color.

## Motion

- **Approach:** intentional. Hovers, presses and dialog open/close are quick and functional.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out.
- **Duration:** micro 100ms, short 150 to 250ms (hovers, presses), medium 250 to 400ms (dialogs, card fade-ups).
- **The one authored moment:** when Career scrolls 30% into view, a Karner-blue fill sweeps the timeline one segment at a time (about 1.2s) with a small glowing sky dot at its leading edge; each chapter's stem draws and its card fades up 8px as its segment completes; the fill then fades, leaving the resting track. Runs once. Clicking during it finishes it instantly. Without JavaScript or with reduced motion, nothing is hidden and nothing moves.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-16 | Tokyo Transit palette (navy, vermillion, off-white) | Vermillion differentiated from navy/black PM portfolios. Superseded below; vermillion survives as the single signal color. |
| 2026-10-15 | Site judged generic / vibe-coded; 4 editorial mockups rejected | Repeating section skeleton, card grids everywhere, emoji, gradient placeholders, Notion-template hero. |
| 2026-10-20 | Hero theme sampler, 7 full-site themes, shortlist A / B / D | Picked by seeing the whole site per theme, built from Hussain's own references. |
| 2026-10-20 | Theme B locked: light product UI in Karner blue (v7) | Reads most senior and most "PM"; Karner blue is his own brand color, a reason rather than a default. |
| 2026-10-20 | Three guardrails adopted | B sits closest to the generic SaaS look; numbers, one KarnerBlu detail and restraint keep it his. |
| 2026-10-20 | Hero: name once, strip "Operator turned PM · Based in New York", no clock, icon contact rows with GitHub | Removed repetition; kept the PM keyword recruiters scan for. |
| 2026-10-20 | Einstein quote moved to a bridge band before Career, set small | It is the thesis for the career story, not a hero element; must not compete with headings. |
| 2026-10-20 | Ventures four across; real covers; career cards fit their content; KarnerBlu clients row | Equal billing, no repeated names, no stretched white space, recognizable proof. |
| 2026-10-21 | Hero name in solid `text` (ink), not v7's navy-to-gray gradient | Emphasis by size and weight (guardrail 3); gradient text is a generic-site tell. |
| 2026-10-21 | Desktop `zoom: 0.9` removed | The build must match v7 at true size; old sections look larger only until rebuilt. |
