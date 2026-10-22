import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TravelMapThemeBPins, type MapPin } from "./TravelMapThemeBPins";

// Added by the /ship test coverage audit, 2026-10-22.
// Value: protects=the legend names the pin under the pointer (its plain name, even for
//   the favorite) and clears on leave, and a late leave from the previous pin does not
//   blank the new one; fails_when=the hover state, the leave handler or its same-pin
//   guard breaks, or the legend shows the tooltip text; why_new=page.test.tsx only
//   counts the pins; seam=none; no_claim=pointer hit-testing over overlapping glows
//   (two made-up pins; jsdom, unit only)
const pins: MapPin[] = [
  { name: "Colombia", x: 120, y: 140, fav: true },
  { name: "Japan", x: 400, y: 90, fav: false },
];

function renderPins() {
  const { container } = render(<TravelMapThemeBPins pins={pins} width={480} height={240} />);
  // Each pin is a <g> whose <title> is its tooltip ("Colombia (favorite)").
  const pin = (name: string) =>
    [...container.querySelectorAll("svg title")].find((t) => t.textContent?.startsWith(name))!.parentElement!;
  const legend = () => container.querySelector('[aria-live="polite"]')!.textContent;
  return { pin, legend };
}

describe("TravelMapThemeBPins", () => {
  it("names the hovered country in the legend and clears it when the pointer leaves", async () => {
    const user = userEvent.setup();
    const { pin, legend } = renderPins();
    expect(legend()).toBe("");

    await user.hover(pin("Colombia"));
    expect(legend()).toBe("Colombia");
    await user.hover(pin("Japan"));
    expect(legend()).toBe("Japan");
    await user.unhover(pin("Japan"));
    expect(legend()).toBe("");
  });

  it("keeps the new country when the previous pin's leave arrives after it", () => {
    const { pin, legend } = renderPins();
    fireEvent.mouseEnter(pin("Colombia"));
    fireEvent.mouseEnter(pin("Japan"));
    fireEvent.mouseLeave(pin("Colombia"));
    expect(legend()).toBe("Japan");
  });
});
