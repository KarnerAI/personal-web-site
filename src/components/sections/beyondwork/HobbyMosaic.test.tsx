import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { hobbies } from "@/data/beyondWork";
import { HobbyMosaic } from "./HobbyMosaic";

// A hero without its own `position` sits here (documented on HobbyImage.position).
const DEFAULT_POSITION = "50% 25%";

const tile = (label: string) => screen.getByRole("button", { name: (n) => n.startsWith(label) });

describe("HobbyMosaic", () => {
  it("opens a hobby's story and returns focus to its tile on Escape", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic />);
    const h = hobbies[1];
    const trigger = tile(h.label);

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: h.label });
    expect(within(dialog).getByRole("heading", { name: h.label })).toBeTruthy();
    for (const p of h.story) expect(dialog.textContent).toContain(p);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  // Added by the /ship test coverage audit, 2026-10-22.
  // Value: protects=each hobby's dialog pairs its meta labels with their values and,
  //   only for a hobby with an embed, shows the route iframe (src, title) and caption,
  //   loaded only once the dialog opens; fails_when=meta labels and values swap or
  //   drop, the iframe loses its src or title, the caption goes, or the iframe renders
  //   before a click; why_new=the test above checks the title and story only;
  //   seam=none; no_claim=the embedded map itself loads (no network; jsdom, unit only)
  it.each(hobbies.map((h) => [h.label, h] as const))(
    "shows the %s meta band and route embed from the data",
    async (_label, h) => {
      const user = userEvent.setup();
      render(<HobbyMosaic />);
      expect(document.querySelector("iframe")).toBeNull();

      await user.click(tile(h.label));
      const dialog = screen.getByRole("dialog", { name: h.label });
      const values = within(dialog).queryAllByRole("definition");
      expect(
        within(dialog)
          .queryAllByRole("term")
          .map((dt, i) => [dt.textContent, values[i]?.textContent])
      ).toEqual((h.meta ?? []).map((m) => [m.label, m.value]));

      if (!h.embed) {
        expect(dialog.querySelector("iframe")).toBeNull();
        return;
      }
      expect(within(dialog).getByTitle(h.embed.title).getAttribute("src")).toBe(h.embed.src);
      if (h.embed.caption) expect(within(dialog).getByText(h.embed.caption).tagName).toBe("FIGCAPTION");
    }
  );

  // Added by the /ship test coverage audit, 2026-10-22.
  // Value: protects=a hobby with a hero shows that photo over its color wash at its
  //   data focal point on the tile and in its story (only the story photo carries the
  //   data's alt text), one without shows the "Photo · {label}" placeholder, and a
  //   photo that fails, on the tile or in the story, leaves the placeholder;
  //   fails_when=hero.src, hero.position or hero.alt stop reaching the img, the wash
  //   class leaves the photo, the tile photo gains a second accessible name, the hero
  //   or placeholder branch inverts, or a failed photo leaves a broken image or an
  //   empty slot; why_new=no test reads the tile photo; page.test.tsx checks only that
  //   failed images disappear; seam=none; no_claim=the crop's look (object-position
  //   read from the inline style; jsdom loads no images; unit only)
  it.each(hobbies.map((h) => [h.label, h] as const))(
    "shows the %s photo on its tile and in its story, or the placeholder",
    async (_label, h) => {
      const user = userEvent.setup();
      render(<HobbyMosaic />);
      const placeholder = `Photo · ${h.label}`;
      const expectPhoto = (slot: HTMLElement, described: boolean) => {
        const img = slot.querySelector("img");
        if (!h.hero) {
          expect(img).toBeNull();
          expect(within(slot).getByText(placeholder)).toBeTruthy();
          return;
        }
        expect(img?.getAttribute("src")).toBe(h.hero.src);
        expect(img?.style.objectPosition).toBe(h.hero.position ?? DEFAULT_POSITION);
        expect(img?.parentElement?.classList.contains(`ph-${h.slug}`)).toBe(true);
        // Only the story photo is described; the tile's button already names the hobby.
        expect(within(slot).queryByRole("img", { name: h.hero.alt }) !== null).toBe(described);
        expect(within(slot).queryByText(placeholder)).toBeNull();
      };
      const t = tile(h.label);
      expectPhoto(t, false);

      await user.click(t);
      const dialog = screen.getByRole("dialog", { name: h.label });
      expectPhoto(dialog, true);
      if (h.hero) {
        fireEvent.error(dialog.querySelector("img")!);
        expect(dialog.querySelector("img")).toBeNull();
        expect(within(dialog).getByText(placeholder)).toBeTruthy();
      }
      await user.keyboard("{Escape}");

      if (!h.hero) return;
      fireEvent.error(t.querySelector("img")!);
      expect(t.querySelector("img")).toBeNull();
      expect(within(t).getByText(placeholder)).toBeTruthy();
    }
  );

  // Added by the /ship review, 2026-10-23.
  // Value: protects=a hero without its own position sits at the documented default
  //   focal point; fails_when=the default fallback is dropped or drifts from the
  //   documented "50% 25%"; why_new=every hero in the data sets a position, so no
  //   other test reaches the default; seam=none (the hobby is edited in place and
  //   restored); no_claim=the crop's look
  it("puts a hero with no position at the documented default", () => {
    const h = hobbies.find((x) => x.hero)!;
    const saved = h.hero!;
    h.hero = { src: saved.src, alt: saved.alt };
    try {
      render(<HobbyMosaic />);
      expect(tile(h.label).querySelector("img")?.style.objectPosition).toBe(DEFAULT_POSITION);
    } finally {
      h.hero = saved;
    }
  });

  it("makes the first hobby the lead tile", () => {
    render(<HobbyMosaic />);
    expect(tile(hobbies[0].label).className).toContain("lead");
    expect(tile(hobbies[1].label).className).not.toContain("lead");
  });
});
