import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
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
  it("renders the sections in order, with a single h1", () => {
    const { container } = renderHome();
    expect(
      [...container.querySelectorAll("main section")].map((s) => s.id || s.getAttribute("aria-label"))
    ).toEqual(["hero", "On experience", "career", "entrepreneurship", "beyond-work", "education"]);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Hussain Alam"]);
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

  it("plots one map pin per visited country", () => {
    renderHome();
    expect(section("beyond-work").querySelectorAll("svg title")).toHaveLength(travel.countryCount);
  });

  it("closes with the footer year", () => {
    renderHome();
    expect(screen.getByRole("contentinfo").textContent).toContain(String(new Date().getFullYear()));
  });
});
