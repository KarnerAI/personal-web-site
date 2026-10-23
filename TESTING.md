# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence. Without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Commands

| What | Command | Notes |
|------|---------|-------|
| Unit tests | `npm test` | Vitest 3 + React Testing Library in jsdom. `npm run test:watch` re-runs on save. |
| Browser smoke tests | `npm run test:e2e` | Playwright 1.62 (Chromium). Builds the production bundle and serves it on port 3100, so a running `npm run dev` on 3000 is untouched. |

CI (`.github/workflows/test.yml`) has two jobs that run side by side on every push (any branch, so a pull request shows the checks on its head commit) and on manual dispatch:

- `audit` runs `npm audit --omit=dev --audit-level=high` on the packages the site ships. A high or critical advisory fails it.
- `test` runs lint and both suites. It does not wait for `audit`, so a failed audit never hides test results.

A second workflow, `.github/workflows/security-audit.yml`, runs the same audit once a day on `main`, so an advisory published between pushes still shows up. It is scheduled for 13:17 UTC, but GitHub may start it late on busy days, and it only begins once the file is on `main`.

### When the `audit` job fails

1. Open the failed job's log. If it shows a network or registry error instead of a list of vulnerabilities, npm could not reach the advisory service: re-run the job.
2. Otherwise run `npm audit --omit=dev` locally to see which package is affected and which version fixes it.
3. If the affected package is one the site lists in `package.json` (such as `next`), bump it to the fixed version there on its own branch. If it sits underneath another package, first update that parent; if the parent does not accept the fixed version yet, force it with `overrides` in `package.json`. Then check that lint and both suites still pass.
4. If no fixed version exists anywhere yet, the audit stays red until one ships. npm has no way to ignore a single advisory, so add a dated TODOS.md entry naming it, and read the `test` job on its own until then. Do not delete the audit or lower its threshold.

What it does not check: moderate and low advisories, and advisories against the dev and build tools the site lists for itself (Tailwind, the top-level PostCSS, TypeScript, ESLint, Vitest, Playwright). Packages that Next.js installs alongside itself, such as its own copy of PostCSS, are checked. Code Next.js bundles inside its own files only shows up once an advisory names `next`.

Who hears about it: a failed push run shows as a red check on the commit and its pull request. For a failed daily run, GitHub emails the person who last changed the `cron` line in `security-audit.yml` (or whoever last re-enabled the workflow), if their GitHub notification settings allow Actions emails. In a public repository, GitHub turns the daily workflow off after 60 days with no activity; turn it back on from the Actions tab. Only the daily workflow is affected. The push checks in `test.yml` have no schedule and keep running.

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
