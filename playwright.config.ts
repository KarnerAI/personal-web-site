import { defineConfig, devices } from "@playwright/test";

// Browser smoke tests for the home page, run against the production build
// (no dev-only Edit toggle or dev badge) on its own port so a running
// `npm run dev` on :3000 is left alone.
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // No retries: a flaky check should fail loudly, not pass on a second try.
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Always build and start fresh, so a stale server on :3100 can't pass for this code.
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
