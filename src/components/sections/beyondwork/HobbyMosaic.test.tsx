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

  it("makes the first hobby the lead tile", () => {
    render(<HobbyMosaic />);
    expect(tile(hobbies[0].label).className).toContain("lead");
    expect(tile(hobbies[1].label).className).not.toContain("lead");
  });
});
