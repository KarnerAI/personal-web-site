# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence. Without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Commands

| What | Command | Notes |
|------|---------|-------|
| Unit tests | `npm test` | Vitest 3 + React Testing Library in jsdom. `npm run test:watch` re-runs on save. |
| Browser smoke tests | `npm run test:e2e` | Playwright 1.62 (Chromium). Builds the production bundle and serves it on port 3100, so a running `npm run dev` on 3000 is untouched. |

CI (`.github/workflows/test.yml`) has two jobs that run side by side on every push (any branch, so a pull request shows the checks on its head commit) and on manual dispatch:

- `audit` runs `npm audit --omit=dev --audit-level=high` on the packages the site ships. A high or critical advisory fails it. It also runs on its own every day at 13:17 UTC on `main`, so an advisory published between pushes still shows up.
- `test` runs lint and both suites. It does not wait for `audit`, so a failed audit never hides test results. It is skipped on the daily run.

### When the `audit` job fails

1. Run `npm audit --omit=dev` locally to see which package is affected and whether a fixed version exists.
2. If one exists, update that package (`npm update <package>`, or bump it in `package.json`) on its own branch, then check that lint and both suites still pass.
3. If no fix exists yet, pin a safe version of the vulnerable sub-dependency with `overrides` in `package.json`. If even that is not possible, add a dated TODOS.md entry and wait for the fix. Do not delete the step or lower its threshold.

What it does not check: moderate and low advisories, and advisories against dev and build tools (Tailwind, PostCSS, TypeScript, ESLint, Vitest, Playwright), which never reach visitors. Packages Next.js bundles inside itself only show up once an advisory names `next`.

Who hears about it: a failed push run shows as a red check on the commit and its pull request. For a failed daily run, GitHub emails only the person who last changed the `cron` line in the workflow, if their GitHub notification settings allow Actions emails. GitHub also pauses daily runs after 60 days with no activity in the repository; re-enable them from the Actions tab.

### When a build stops with `SecurityFatalError`

Next.js 16.4 checks for security advisories against itself when an AI agent runs `next build` or `next dev` (`experimental.agentUpgrade`, default `security`, kept on purpose). If one applies, the command exits 1 with `SecurityFatalError` and a `next upgrade --agent=security` suggestion. That is not a test failure. Re-run the same command within 5 minutes of starting the failed one (the window opens when the build begins, not when it fails) to let it through once, then plan the Next.js upgrade on its own branch. `npm run test:e2e` builds first, so it can stop this way too. Vercel deploys are not agent runs and are not blocked.

## Layers

- **Unit** (`src/**/*.test.{ts,tsx}`, next to the code under test): client-component behavior that does not need real layout. Clicks, keyboard, dialogs, focus return, scrollspy state. Examples: `Header.test.tsx`, `CareerTimeline.test.tsx`.
- **Smoke / E2E** (`e2e/*.spec.ts`): the real page in a real browser. Page loads with every section and no console errors, scrolling and anchors, phone layout. Use this for anything that depends on CSS, layout, IntersectionObserver timing or async server components.

Vitest renders every current section, server components included (`src/app/page.test.tsx` renders the whole page). It cannot render `async` server components; cover those with Playwright.

## Conventions

- Name unit tests `<Component>.test.tsx` beside the component; E2E specs go in `e2e/`.
- Query by role and accessible name (`getByRole("button", { name: ... })`), the way a screen reader user finds things. Avoid class names except to assert a visual variant.
- Read expected copy from `src/data/*` instead of hard-coding it, so content edits don't break tests.
- `vitest.setup.ts` stubs `matchMedia` (no matches: desktop layout, career animation off) and cleans up after each test. Stub `IntersectionObserver` per test when the component needs it (see `Header.test.tsx`).
- jsdom renders both the desktop and phone layouts at once (CSS hides one in the browser). Scope queries to the layout you mean, for example the `career-dp` panel.
- A bug fix gets a regression test that fails on the old code and passes on the fix.
