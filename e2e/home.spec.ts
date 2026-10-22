import { expect, test, type Page } from "@playwright/test";
import { careerRoles } from "@/data/career";
import { ventures } from "@/data/entrepreneurship";

const SECTIONS = ["hero", "career", "entrepreneurship", "beyond-work", "education"];

test("home renders every section with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  // Answer the Google favicon lookups locally so a third-party hiccup cannot fail the check.
  await page.route(/google\.com\/s2\/favicons|gstatic\.com\/faviconV2/, (r) =>
    r.fulfill({ status: 200, contentType: "image/png", path: "public/logos/staples.png" })
  );

  await page.goto("/");
  await expect(page).toHaveTitle("Hussain Alam | Operator turned PM");
  await expect(page.getByRole("heading", { level: 1, name: "Hussain Alam" })).toBeVisible();
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeAttached();
  // Hydrated (the sweep arms on mount), then scroll to the end so lazy images load too.
  await expect(page.locator("#career .tl")).toHaveClass(/tl-anim/);
  await page.locator("#education").scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("/world-land.svg is served as an SVG image in the map's 800x400 frame", async ({ request }) => {
  const res = await request.get("/world-land.svg");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/svg+xml");
  expect((await res.text()).startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"')).toBe(true);
});

// Value: protects=the hero portrait is the page's only image preload, at high
//   priority, and below-the-fold logos and the map wait their turn; fails_when=the
//   portrait loses its preload or priority, or an eager image gets auto-preloaded
//   ahead of it (as ten logos did before 451544b); why_new=no test reads the head;
//   seam=none; no_claim=actual load timing (network-dependent)
test("the hero portrait is the only image fetched ahead of the page", async ({ page }) => {
  await page.goto("/");
  const preloads = page.locator('head link[rel="preload"][as="image"]');
  await expect(preloads).toHaveCount(1);
  await expect(preloads).toHaveAttribute("href", "/logos/profile-image-nyc.webp");
  await expect(preloads).toHaveAttribute("fetchpriority", "high");
});

test("nav highlight follows the section in view and clears on the hero", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const career = nav.getByRole("link", { name: "Career", exact: true });

  await career.click();
  await expect(career).toHaveAttribute("aria-current", "true");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(nav.locator('[aria-current="true"]')).toHaveCount(0);
});

test("phone menu jumps to a section and closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  // Radix labels the drawer by its "Menu" title.
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("link", { name: "Entrepreneurship", exact: true }).click();

  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#entrepreneurship$/);
  // The jump really lands: the section sits just under the 60px sticky header.
  const section = page.locator("#entrepreneurship");
  await expect(section).toBeInViewport();
  await expect
    .poll(() => section.evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeGreaterThanOrEqual(60);
  await expect
    .poll(() => section.evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThan(120);
  // Keyboard focus follows the jump, so the next Tab continues inside the section.
  await expect(section).toBeFocused();

  // Closing without picking a section (Escape) returns focus to the menu button.
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

// Added by the /ship test coverage audit, 2026-10-21.
// Value: protects=the career sweep never leaves a chapter hidden: cards and years end
//   visible after the sweep, and at once when keyboard focus arrives first;
//   fails_when=the sweep's end state, its IntersectionObserver trigger or its
//   interaction interrupt breaks, or the CSS hides cards some other way;
//   why_new=unit tests run with motion off (jsdom has no layout or animation);
//   seam=none; no_claim=the sweep's look or timing, the phone fade-up, reduced motion
test("career timeline sweep ends with every chapter visible", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const timeline = page.getByRole("group", { name: "Career timeline" });
  const card = (i: number) => timeline.getByRole("button", { name: careerRoles[i].tagline });
  const year = (i: number) =>
    timeline.getByRole("button", { name: `${careerRoles[i].company}, ${careerRoles[i].yearsLabel}`, exact: true });
  const last = careerRoles.length - 1;
  // Last chapter first: it is the last one a running sweep reveals, so a deadline
  // on it cannot be met by a sweep that was not interrupted.
  const expectAllVisible = async (timeout?: number) => {
    for (const i of [...careerRoles.keys()].reverse()) {
      await expect(card(i)).toHaveCSS("opacity", "1", { timeout });
      await expect(year(i)).not.toHaveCSS("color", "rgba(0, 0, 0, 0)", { timeout });
    }
  };
  // Below the fold, the sweep waits with the cards hidden until Career scrolls in.
  const loadArmed = async (p: Page) => {
    await p.goto("/");
    await expect(card(last)).toHaveCSS("opacity", "0");
  };

  // A keyboard user who reaches the timeline first ends the sweep at once. The
  // last card would not start showing until about 1.3s into a running sweep.
  await loadArmed(page);
  await card(0).focus();
  await expectAllVisible(1_000);

  // Everyone else watches it run, and it settles with every chapter showing.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await loadArmed(page);
  await timeline.scrollIntoViewIfNeeded();
  await expectAllVisible();
});

// Added by the /ship test coverage audit, 2026-10-21.
// Value: protects=on phones each career card fades in as it is scrolled to, a tap ends
//   the fade with every card showing, and with reduced motion no card is ever hidden
//   (phone or desktop); fails_when=the phone observer, queue, interrupt or end state
//   breaks, or the reduced-motion check is dropped; why_new=the sweep test above runs
//   desktop with motion on only; seam=none; no_claim=the fade's look or timing
test("phone career cards fade in, and reduced motion never hides a chapter", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  // The fade runs on each phone card's wrapper, so opacity is read there.
  const item = (i: number) => page.locator(`#career .mi[data-i="${i}"]`);
  const last = careerRoles.length - 1;
  const expectAllVisible = async () => {
    for (const i of [...careerRoles.keys()].reverse()) await expect(item(i)).toHaveCSS("opacity", "1");
  };
  const loadArmed = async () => {
    await page.goto("/");
    await expect(item(last)).toHaveCSS("opacity", "0");
  };

  // Scrolling down shows each card as it arrives.
  await loadArmed();
  for (const i of careerRoles.keys()) {
    await item(i).scrollIntoViewIfNeeded();
    await expect(item(i)).toHaveCSS("opacity", "1");
  }

  // A tap anywhere in the list ends the fade, cards still below the fold included.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await loadArmed();
  await page.locator('[aria-controls="career-md0"]').dispatchEvent("pointerdown");
  await expectAllVisible();

  // Reduced motion: nothing waits to be revealed, on phones or on the desktop timeline.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Hydration sync point away from Career: open and close a venture story.
  await page.locator("#entrepreneurship").getByRole("button", { name: ventures[0].name }).click();
  await page.keyboard.press("Escape");
  await expectAllVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const timeline = page.getByRole("group", { name: "Career timeline" });
  for (const r of careerRoles) {
    await expect(timeline.getByRole("button", { name: r.tagline })).toHaveCSS("opacity", "1");
  }
});

// Added by the /ship test coverage audit, 2026-10-21 (regression check against main).
// Value: protects=Escape over a venture story closes only the story; the open career
//   chapter stays open (on main the chapter only heard keys from inside the timeline),
//   and a later Escape closes it without pulling focus into Career;
//   fails_when=CareerTimeline's document Escape handler acts after the dialog is gone;
//   why_new=jsdom dispatches keys from script, so a unit test cannot see the real
//   listener order; seam=none; no_claim=the phone menu and hobby dialogs (one story)
test("Escape over a story closes only the story, not the open career chapter", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const [role] = careerRoles;
  const chapter = page.locator("#career-dp");
  await page.getByRole("button", { name: `${role.company}, ${role.yearsLabel}`, exact: true }).click();
  await expect(chapter).toBeVisible();

  const story = page.locator("#entrepreneurship").getByRole("button", { name: ventures[0].name });
  await story.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(chapter).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(chapter).toBeVisible();
  await expect(story).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(chapter).toBeHidden();
  await expect(story).toBeFocused();
});
