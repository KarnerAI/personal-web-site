# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence. Without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Commands

| What | Command | Notes |
|------|---------|-------|
| Unit tests | `npm test` | Vitest 3 + React Testing Library in jsdom. `npm run test:watch` re-runs on save. |
| Browser smoke tests | `npm run test:e2e` | Playwright 1.62 (Chromium). Builds the production bundle and serves it on port 3100, so a running `npm run dev` on 3000 is untouched. |

CI (`.github/workflows/test.yml`) runs lint and both suites on every push (any branch, so a pull request shows the checks on its head commit) and on manual dispatch.

## Layers

- **Unit** (`src/**/*.test.tsx`, next to the component): client-component behavior that does not need real layout. Clicks, keyboard, dialogs, focus return, scrollspy state. Examples: `Header.test.tsx`, `CareerTimeline.test.tsx`.
- **Smoke / E2E** (`e2e/*.spec.ts`): the real page in a real browser. Page loads with every section and no console errors, scrolling and anchors, phone layout. Use this for anything that depends on CSS, layout, IntersectionObserver timing or async server components.

Vitest renders every current section, server components included (`src/app/page.test.tsx` renders the whole page). It cannot render `async` server components; cover those with Playwright.

## Conventions

- Name unit tests `<Component>.test.tsx` beside the component; E2E specs go in `e2e/`.
- Query by role and accessible name (`getByRole("button", { name: ... })`), the way a screen reader user finds things. Avoid class names except to assert a visual variant.
- Read expected copy from `src/data/*` instead of hard-coding it, so content edits don't break tests.
- `vitest.setup.ts` stubs `matchMedia` (no matches: desktop layout, career animation off) and cleans up after each test. Stub `IntersectionObserver` per test when the component needs it (see `Header.test.tsx`).
- jsdom renders both the desktop and phone layouts at once (CSS hides one in the browser). Scope queries to the layout you mean, for example the `career-dp` panel.
- A bug fix gets a regression test that fails on the old code and passes on the fix.
