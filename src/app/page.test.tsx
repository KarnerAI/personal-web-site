import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { worldLandSvg } from "@/components/sections/beyondwork/map-variants/themeBLand";
import { hobbies, travel } from "@/data/beyondWork";
import { careerRoles } from "@/data/career";
import { certifications, degree } from "@/data/education";
import { ventures } from "@/data/entrepreneurship";
import Home from "./page";

// The whole page in one render: a crash or a dropped section anywhere shows up here.
const renderHome = () =>
  render(
    <EditModeProvider>
      <Home />
    </EditModeProvider>
  );

const section = (id: string) => document.getElementById(id)!;

describe("Home page", () => {
  // Extended by the /ship test coverage audit, 2026-10-21 (the console.error check).
  // Value: protects=the page renders with no React warnings (duplicate list keys,
  //   invalid DOM nesting); fails_when=a list reuses a key (as the map's land paths
  //   did before 6705dda) or markup nests a block inside a <p>;
  //   why_new=production smoke (e2e) runs React's prod build, which drops these
  //   warnings; seam=none; no_claim=closed dialogs and the career panel are not
  //   rendered here (jsdom, unit only)
  it("renders the sections in order, with a single h1", () => {
    const errors = vi.spyOn(console, "error");
    const { container } = renderHome();
    expect(
      [...container.querySelectorAll("main section")].map((s) => s.id || s.getAttribute("aria-label"))
    ).toEqual(["hero", "On experience", "career", "entrepreneurship", "beyond-work", "education"]);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Hussain Alam"]);
    const warnings = errors.mock.calls.map((args) => String(args[0]));
    errors.mockRestore();
    expect(warnings).toEqual([]);
  });

  it("links the hero contact rows to LinkedIn, email and GitHub", () => {
    renderHome();
    const hrefs = within(section("hero"))
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "https://www.linkedin.com/in/hussainalam",
        "mailto:hussain@karnerblu.com",
        "https://github.com/KarnerAI",
      ])
    );
    for (const a of within(section("hero")).getAllByRole("link")) {
      if (a.getAttribute("href")?.startsWith("http")) expect(a.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("shows every chapter, venture, hobby and credential from the data files", () => {
    renderHome();
    for (const r of careerRoles) expect(section("career").textContent).toContain(r.company);
    for (const v of ventures) expect(section("entrepreneurship").textContent).toContain(v.name);
    for (const h of hobbies) expect(section("beyond-work").textContent).toContain(h.label);
    expect(section("education").textContent).toContain(degree.school);
    for (const c of certifications) expect(section("education").textContent).toContain(c.name);
  });

  // Extended by the /ship test coverage audit, 2026-10-21 (the tint check).
  // Value: protects=every visited country code is tinted on the theme B map;
  //   fails_when=a code is added to the travel data without its ISO numeric id
  //   (e.g. Turkey, "next up"), or ids lose leading zeros (Brazil 076, Bangladesh
  //   050); why_new=the pin count above comes from countryCoords, not the tint;
  //   seam=none; no_claim=tint color and pin placement (class only; unit)
  it("plots one map pin per visited country and tints each one", () => {
    renderHome();
    expect(section("beyond-work").querySelectorAll("svg title")).toHaveLength(travel.countryCount);
    // The land is a separate file under the pins; "v" is the visited tint, one shape per country.
    expect(section("beyond-work").querySelector('img[src="/world-land.svg"]')).not.toBeNull();
    expect(worldLandSvg().match(/<path class="v"/g)).toHaveLength(new Set(travel.visitedCountryCodes).size);
  });

  // Added by the /ship test coverage audit, 2026-10-21.
  // Value: protects=a logo, client logo or venture cover that fails to load leaves its
  //   text showing (initials, badge, venture name) and no broken image; fails_when=an
  //   onError fallback is dropped, or a cover stops naming the venture once its image
  //   is gone; why_new=no test fires an image error; seam=none; no_claim=story marks
  //   and hobby story photos (dialogs stay closed here; see Entrepreneurship.test.tsx
  //   and HobbyMosaic.test.tsx) and the pre-hydration catch (jsdom loads no images;
  //   unit only)
  it("shows each logo's or cover's text when its image fails to load", () => {
    renderHome();
    const main = screen.getByRole("main");
    const images = [...main.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) fireEvent.error(img);

    // A failed image is removed, or hidden with its slot (client logos).
    expect([...main.querySelectorAll("img")].filter((img) => !img.closest("[hidden]"))).toEqual([]);
    for (const v of ventures) {
      const card = within(section("entrepreneurship")).getByRole("button", { name: (n) => n.includes(v.name) });
      // The cover now names the venture too, above the name in the card body.
      expect(within(card).getAllByText(v.name)).toHaveLength(2);
    }
  });

  it("closes with the footer year", () => {
    renderHome();
    expect(screen.getByRole("contentinfo").textContent).toContain(String(new Date().getFullYear()));
  });
});
