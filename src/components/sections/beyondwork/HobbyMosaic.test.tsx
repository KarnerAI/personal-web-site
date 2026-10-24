import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  it.each(hobbies.filter((h) => !h.illustration && !h.map).map((h) => [h.label, h] as const))(
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

  it("draws art on tiles without a photo, and keeps the placeholder in their story", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic />);
    for (const h of hobbies.filter((x) => x.illustration)) {
      const t = tile(h.label);
      expect(t.querySelector(`svg.ill-${h.illustration}`)).not.toBeNull();
      await user.click(t);
      const dialog = screen.getByRole("dialog", { name: h.label });
      expect(dialog.querySelector(".hm-ph")?.textContent).toContain(`Photo · ${h.label}`);
      await user.keyboard("{Escape}");
    }
  });

  it("shows the tile tagline on the tile and the full tagline in the story", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic />);
    const h = hobbies.find((x) => x.tileTagline)!;
    const t = tile(h.label);
    expect(t.textContent).toContain(h.tileTagline);
    expect(t.textContent).not.toContain(h.tagline);
    await user.click(t);
    expect(screen.getByRole("dialog", { name: h.label }).textContent).toContain(h.tagline);
  });

  it("loads the hover loop lazily, muted, under the still", () => {
    render(<HobbyMosaic />);
    const h = hobbies.find((x) => x.video)!;
    const v = tile(h.label).querySelector("video")!;
    expect(v.getAttribute("src")).toBe(h.video!.src);
    expect(v.muted).toBe(true);
    expect(v.getAttribute("preload")).toBe("none");
    expect(tile(h.label).className).not.toContain("is-playing");
  });

  it("shows the travel map on its tile and the pinned map in its story", async () => {
    const user = userEvent.setup();
    const pins = [
      { name: "Colombia", x: 10, y: 20, fav: true },
      { name: "Japan", x: 30, y: 40, fav: false },
    ];
    render(<HobbyMosaic mapPins={pins} />);
    const h = hobbies.find((x) => x.map)!;
    const t = tile(h.label);
    expect(t.querySelector('img[src="/world-travel.svg"]')).not.toBeNull();
    expect(t.querySelectorAll("svg title")).toHaveLength(0);

    await user.click(t);
    const dialog = screen.getByRole("dialog", { name: h.label });
    expect(within(dialog).getByRole("img", { name: /2 visited countries.*Colombia, the favorite/ })).toBeTruthy();
    expect([...dialog.querySelectorAll("svg title")].map((x) => x.textContent)).toEqual([
      "Colombia (favorite)",
      "Japan",
    ]);
    // Hover-only names are also listed for keyboard, touch and screen-reader users.
    expect([...dialog.querySelectorAll("ul.sr-only li")].map((x) => x.textContent)).toEqual([
      "Colombia (favorite)",
      "Japan",
    ]);
    for (const p of h.story) expect(dialog.textContent).toContain(p);
  });

  // Added by the /ship test coverage audit, 2026-10-24.
  // Value: protects=if the travel map file fails to load, the story keeps the map's
  //   description for screen readers and the tile shows nothing broken;
  //   fails_when=the failed branch drops the sr-only text (the description is lost) or
  //   renders it on the tile too (an empty label read out, or a broken image left);
  //   why_new=no test fires an error on the travel map image; seam=none; no_claim=how
  //   the empty map frame looks (jsdom, unit only)
  it("keeps the travel map's description when the map file fails to load", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic mapPins={[{ name: "Colombia", x: 10, y: 20, fav: true }]} />);
    const h = hobbies.find((x) => x.map)!;
    const t = tile(h.label);
    fireEvent.error(t.querySelector('img[src="/world-travel.svg"]')!);
    expect(t.querySelector('img[src="/world-travel.svg"]')).toBeNull();
    expect(t.querySelector(".map")!.textContent).toBe("");

    await user.click(t);
    const dialog = screen.getByRole("dialog", { name: h.label });
    const img = dialog.querySelector('img[src="/world-travel.svg"]')!;
    fireEvent.error(img);
    expect(dialog.querySelector('img[src="/world-travel.svg"]')).toBeNull();
    const desc = [...dialog.querySelectorAll("span.sr-only")].map((x) => x.textContent);
    expect(desc).toContain("World map with 1 visited countries filled in. Colombia, the favorite, is ringed.");
  });

  // Added by the /ship test coverage audit, 2026-10-24.
  // Value: protects=with no favorite pinned, the map's description just counts the
  //   countries; fails_when=the favorite guard is dropped, so the alt reads
  //   "undefined, the favorite, is ringed." or names a country that is not the
  //   favorite; why_new=the existing travel test always pins a favorite; seam=none;
  //   no_claim=the ring drawing itself (jsdom, unit only)
  it("describes the travel map without a favorite when none is pinned", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic mapPins={[{ name: "Japan", x: 1, y: 1, fav: false }]} />);
    const h = hobbies.find((x) => x.map)!;
    await user.click(tile(h.label));
    const dialog = screen.getByRole("dialog", { name: h.label });
    expect(within(dialog).getByRole("img", { name: /^World map with 1 visited countries filled in\.$/ })).toBeTruthy();
  });

  it("tells the mentoring story as one section per program", async () => {
    const user = userEvent.setup();
    render(<HobbyMosaic />);
    const h = hobbies.find((x) => x.chapters)!;
    await user.click(tile(h.label));
    const dialog = screen.getByRole("dialog", { name: h.label });
    for (const c of h.chapters!) {
      const ch = within(dialog).getByRole("region", { name: c.kicker });
      expect(ch.textContent).toContain(c.text);
      expect(ch.querySelector("img.ch-logo")?.getAttribute("src")).toBe(c.logoSrc);
    }
  });
});

// Added by the /ship test coverage audit, 2026-10-24.
// Value: protects=a tile's loop plays only for a real mouse that moves (not touch, a
//   still cursor under scrolling, or reduced motion), loads once even if hovered again
//   before it is ready, starts from the still's moment, and stops on leave;
//   fails_when=a gate is dropped (phones or reduced motion download and play video),
//   a re-hover reloads it, play starts at 0 instead of the still frame, or leaving
//   keeps it playing; why_new=the test above checks the idle markup only; seam=none;
//   no_claim=real playback or the crossfade (media methods stubbed; jsdom, unit only)
describe("HobbyMosaic hover loop", () => {
  afterEach(() => vi.restoreAllMocks());

  const setup = (reducedMotion: boolean) => {
    const base = window.matchMedia("(hover: hover) and (pointer: fine)");
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...base,
      media: query,
      matches: query === "(hover: hover) and (pointer: fine)" || (reducedMotion && query === "(prefers-reduced-motion: reduce)"),
    }));
    const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    render(<HobbyMosaic />);
    const h = hobbies.find((x) => x.video)!;
    const t = tile(h.label);
    return { h, t, v: t.querySelector("video")!, load, play, pause };
  };
  const move = (el: Element, pointerType: string, movementX = 4) => {
    const e = new PointerEvent("pointermove", { bubbles: true, pointerType, movementX, movementY: 0 });
    act(() => {
      el.dispatchEvent(e);
    });
  };

  // Added by the /ship review, 2026-10-24.
  // Value: protects=a loop whose metadata or playing event arrives after the mouse
  //   left never starts or shows; fails_when=the hovered guard in go() or onPlaying is
  //   dropped; why_new=the test below only leaves and re-hovers before metadata;
  //   seam=none; no_claim=real playback (media methods are stubbed)
  it("does not play a loop whose metadata arrives after the mouse left", () => {
    const { t, v, play } = setup(false);
    move(t, "mouse");
    fireEvent.pointerLeave(t);
    fireEvent(v, new Event("loadedmetadata"));
    expect(play).not.toHaveBeenCalled();
    fireEvent(v, new Event("playing"));
    expect(t.className).not.toContain("is-playing");
  });

  it("plays for a moving mouse only, loads once, and stops on leave", () => {
    const { h, t, v, load, play, pause } = setup(false);
    move(t, "touch");
    move(t, "mouse", 0);
    expect(load).not.toHaveBeenCalled();

    move(t, "mouse");
    expect(load).toHaveBeenCalledTimes(1);
    expect(v.preload).toBe("auto");
    fireEvent.pointerLeave(t);
    move(t, "mouse");
    expect(load).toHaveBeenCalledTimes(1);

    fireEvent(v, new Event("loadedmetadata"));
    expect(play).toHaveBeenCalledTimes(1);
    expect(v.currentTime).toBe(h.video!.start);
    fireEvent(v, new Event("playing"));
    expect(t.className).toContain("is-playing");

    fireEvent.pointerLeave(t);
    expect(pause).toHaveBeenCalled();
    expect(t.className).not.toContain("is-playing");
  });

  it("never loads the loop with reduced motion", () => {
    const { t, load, play } = setup(true);
    move(t, "mouse");
    expect(load).not.toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
  });
});
