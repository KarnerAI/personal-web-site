import { expect, test } from "@playwright/test";
import { travel } from "@/data/beyondWork";

// The archived map variants stay reviewable at /design/map-variants
// (DESIGN-VARIANTS.md). Basemap tiles need a Carto key, so only the map
// itself and its pins are checked.
test("archived map variants page mounts the Leaflet map with every pin", async ({ page }) => {
  await page.goto("/design/map-variants");
  await expect(page.locator(".leaflet-container")).toHaveCount(1);
  await expect(page.locator(".travel-map-pin")).toHaveCount(travel.countryCount);
});
