import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { hobbies } from "@/data/beyondWork";
import { HobbyMosaic } from "./HobbyMosaic";

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

  it("makes the first hobby the lead tile", () => {
    render(<HobbyMosaic />);
    expect(tile(hobbies[0].label).className).toContain("lead");
    expect(tile(hobbies[1].label).className).not.toContain("lead");
  });
});
