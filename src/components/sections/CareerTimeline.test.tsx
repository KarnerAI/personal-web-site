import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { careerRoles } from "@/data/career";
import { CareerTimeline } from "./CareerTimeline";

// jsdom renders both layouts (CSS hides one), so read the desktop panel the
// timeline controls rather than any "details" region.
const panel = () => document.getElementById("career-dp")!;
const panelHeading = () => within(panel()).getByRole("heading").textContent;

describe("CareerTimeline", () => {
  it("opens a chapter, moves with the arrow keys and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<CareerTimeline />);
    const [first, second] = careerRoles;
    const timeline = screen.getByRole("group", { name: "Career timeline" });
    expect(panel().hidden).toBe(true);

    await user.click(within(timeline).getByRole("button", { name: `${first.company}, ${first.yearsLabel}` }));
    expect(panel().hidden).toBe(false);
    expect(panelHeading()).toBe(first.company);

    // Arrows follow the chronological order of careerRoles, not the card rows.
    await user.keyboard("{ArrowRight}");
    expect(panelHeading()).toBe(second.company);
    const focused = document.activeElement as HTMLElement;
    expect(focused.getAttribute("aria-controls")).toBe("career-dp");
    expect(focused.textContent).toContain(second.company);

    await user.keyboard("{Escape}");
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(focused);
  });

  it("closes the open chapter when its year segment is clicked again", async () => {
    const user = userEvent.setup();
    render(<CareerTimeline />);
    const last = careerRoles[careerRoles.length - 1];
    const segment = screen.getByRole("button", { name: `${last.company}, ${last.yearsLabel}` });

    await user.click(segment);
    expect(panelHeading()).toBe(last.company);
    expect(segment.getAttribute("aria-expanded")).toBe("true");

    await user.click(segment);
    expect(panel().hidden).toBe(true);
    expect(segment.getAttribute("aria-expanded")).toBe("false");
  });
});
