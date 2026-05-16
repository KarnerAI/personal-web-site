# Design Variants Convention

## Where variants live

All design variants for a section component go in a `variants/` subfolder inside that section's directory:

```
src/components/sections/
  beyondwork/
    map-variants/       ← existing (travel map variants)
    variants/           ← new convention for other beyondwork variants
  {section}/
    variants/
      {ComponentVariantName}.tsx
```

For already-established variant folders (e.g. `map-variants/`), keep the existing folder name — don't rename or reorganize.

## Rules

1. **Never delete a variant file.** Variants are a permanent historical record. If a variant is retired, leave the file in place — it can always be revived.
2. **Name variants descriptively.** Use `{Component}{StyleOrApproach}.tsx` — e.g. `ReadingShelf.tsx`, `ReadingTimeline.tsx`, `ListeningGrid.tsx`.
3. **One variant = one file.** Don't fold multiple layouts into a single file behind a flag.
4. **Keep variants self-contained.** A variant file should render standalone without requiring edits to shared files. Shared helpers go in the parent folder, not inside `variants/`.

## HTML variants (design mockups)

Standalone HTML variants — the kind produced by `/design-shotgun`, `/design-html`, or any design exploration that outputs a self-contained `.html` file — all go in **one flat folder** at the project root:

```
design-variants/
  2026-04-23-reading-shelf.html
  2026-04-23-reading-timeline.html
  2026-04-23-listening-grid.html
  ...
```

Rules for HTML variants:

1. **One folder, flat.** Never create subfolders per variant or per run. Every HTML variant lives directly inside `design-variants/`.
2. **Never delete.** Same as TSX variants — HTML variants are a permanent historical record.
3. **Name with date + descriptor.** Format: `{YYYY-MM-DD}-{section}-{style}.html` — e.g. `2026-04-23-beyondwork-reading-shelf.html`. The date prefix keeps historical runs grouped chronologically when sorted.
4. **Self-contained.** HTML variants must inline all CSS/JS/assets (or use CDN links). Don't reference local project files — they need to render standalone forever.

## Example (TSX variants)

```
src/components/sections/beyondwork/
  BeyondWork.tsx
  TravelMap.tsx
  map-variants/
    TravelMapAtlas.tsx
    TravelMapGeo.tsx
    TravelMapJournal.tsx
    ...
  variants/
    ReadingShelf.tsx       ← bookshelf layout
    ReadingTimeline.tsx    ← chronological reading log
    ListeningGrid.tsx      ← album-grid listening layout
```
