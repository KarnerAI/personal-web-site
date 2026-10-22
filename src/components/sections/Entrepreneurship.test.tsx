import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ventures } from "@/data/entrepreneurship";
import { Entrepreneurship } from "./Entrepreneurship";

const card = (name: string) => screen.getByRole("button", { name: (n) => n.includes(name) });

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
    const dialog = screen.getByRole("dialog");
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
});
