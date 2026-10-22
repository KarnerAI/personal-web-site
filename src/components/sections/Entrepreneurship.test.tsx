import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ventures } from "@/data/entrepreneurship";
import { Entrepreneurship } from "./Entrepreneurship";

const card = (name: string) => screen.getByRole("button", { name: (n) => n.includes(name) });
const bySlug = (slug: string) => ventures.find((v) => v.slug === slug)!;

describe("Entrepreneurship", () => {
  it("renders one card per venture", () => {
    render(<Entrepreneurship />);
    for (const v of ventures) expect(card(v.name).getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("opens the full story and hands focus back on close", async () => {
    const user = userEvent.setup();
    render(<Entrepreneurship />);
    const v = ventures[1];
    const trigger = card(v.name);

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: v.name });
    expect(within(dialog).getByRole("heading", { name: v.name })).toBeTruthy();
    expect(within(dialog).getAllByRole("term").map((t) => t.textContent)).toEqual([
      "Problem",
      "Built",
      "Outcome",
      "Lesson",
    ]);
    expect(dialog.textContent).toContain(v.caseStudy.problem);

    await user.click(within(dialog).getByRole("button", { name: "Close story" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  // Added by the /ship test coverage audit, 2026-10-21.
  // Value: protects=a story links out only when its venture has a URL, in a new tab
  //   with rel noreferrer, named by the data's label or "Visit"; fails_when=the URL
  //   guard, target/rel or the "Visit" default is dropped; why_new=the test above
  //   checks the case study only; seam=none; no_claim=the "#" placeholder guard (no
  //   venture uses it) and the external sites (unit only)
  it.each([
    { slug: "emojifriends", link: bySlug("emojifriends").externalLabel }, // its own label
    { slug: "navigate-ai", link: "Visit" }, // a URL with no label: the default
    { slug: "spots", link: undefined }, // no URL: no link
  ])("links the $slug story out only when it has a URL", async ({ slug, link }) => {
    const user = userEvent.setup();
    const v = bySlug(slug);
    render(<Entrepreneurship />);
    await user.click(card(v.name));
    const dialog = screen.getByRole("dialog");

    if (!link) {
      // Not even an href-less anchor showing "Visit".
      expect(dialog.querySelector("a")).toBeNull();
      return;
    }
    const a = within(dialog).getByRole("link", { name: link });
    expect(a.getAttribute("href")).toBe(v.externalUrl);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noreferrer");
  });
});
