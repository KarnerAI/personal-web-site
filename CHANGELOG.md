# Changelog

All notable changes to hussainalam.com are documented here. This site follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions and a
4-digit version scheme (`MAJOR.MINOR.PATCH.MICRO`) tracked in `VERSION`.

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
