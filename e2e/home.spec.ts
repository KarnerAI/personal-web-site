import { expect, test } from "@playwright/test";

const SECTIONS = ["hero", "career", "entrepreneurship", "beyond-work", "education"];

test("home renders every section with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page).toHaveTitle("Hussain Alam | Operator turned PM");
  await expect(page.getByRole("heading", { level: 1, name: "Hussain Alam" })).toBeVisible();
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeAttached();
  expect(errors).toEqual([]);
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
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});
