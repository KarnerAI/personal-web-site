import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  // Added by the /ship test coverage audit, 2026-10-21.
  // Value: protects=with nothing open, Left starts at the latest chapter and Right at
  //   the first, and the arrows stop at either end; fails_when=the start or the
  //   clamps change (an empty panel and lost focus past the last chapter);
  //   why_new=the test above only steps Right from an open middle chapter;
  //   seam=none; no_claim=real browser key handling (jsdom, unit only)
  it("starts the arrow keys from either end and stops at the ends", async () => {
    const user = userEvent.setup();
    render(<CareerTimeline />);
    const first = careerRoles[0];
    const last = careerRoles[careerRoles.length - 1];
    const timeline = screen.getByRole("group", { name: "Career timeline" });
    within(timeline).getAllByRole("button")[0].focus();

    await user.keyboard("{ArrowLeft}");
    expect(panelHeading()).toBe(last.company);
    expect(document.activeElement?.textContent).toContain(last.company);
    await user.keyboard("{ArrowRight}");
    expect(panelHeading()).toBe(last.company);

    await user.keyboard("{Escape}");
    expect(panel().hidden).toBe(true);
    await user.keyboard("{ArrowRight}");
    expect(panelHeading()).toBe(first.company);
    await user.keyboard("{ArrowLeft}");
    expect(panelHeading()).toBe(first.company);
    expect(document.activeElement?.textContent).toContain(first.company);
  });

  // Added by the /ship test coverage audit, 2026-10-22.
  // Value: protects=an open chapter's panel lists every role held, in order with its
  //   place and dates, and names its clients, each only when the chapter has them;
  //   fails_when=the roles table or the panel's clients row is dropped, loses a field,
  //   or shows on a chapter without that data; why_new=the tests above read the
  //   heading, tenure and hero bullet only; seam=none; no_claim=the table's layout and
  //   client logos (jsdom, unit only)
  it.each(careerRoles.map((r) => [r.company, r] as const))(
    "shows the roles held and clients in the %s panel only when it has them",
    async (_company, role) => {
      const user = userEvent.setup();
      render(<CareerTimeline />);
      await user.click(screen.getByRole("button", { name: `${role.company}, ${role.yearsLabel}` }));

      const rolesLabel = within(panel()).queryByText("Roles held");
      if (role.roles) {
        const rows = within(rolesLabel!.nextElementSibling as HTMLElement).getAllByRole("listitem");
        expect(rows).toHaveLength(role.roles.length);
        role.roles.forEach((r, i) => {
          for (const text of [r.title, r.loc, r.dates]) expect(rows[i].textContent).toContain(text);
        });
      } else {
        expect(rolesLabel).toBeNull();
      }

      const clientsLabel = within(panel()).queryByText("Clients");
      if (role.clients) {
        for (const c of role.clients) expect(clientsLabel!.parentElement!.textContent).toContain(c.name);
      } else {
        expect(clientsLabel).toBeNull();
      }
    }
  );
});

// Added by the /ship test coverage audit, 2026-10-21.
// Value: protects=on phones a chapter expands under its own card and closing it hands
//   focus back to that card; fails_when=close() refocuses the desktop card, which is
//   hidden on phones, so focus falls to the page; why_new=other tests run the
//   desktop layout only; seam=none; no_claim=which layout CSS shows (matchMedia
//   stubbed to a phone width; jsdom, unit only)
describe("CareerTimeline on phones", () => {
  afterEach(() => vi.restoreAllMocks());

  it("expands a chapter in place and returns focus to its card on close", async () => {
    const phone = window.matchMedia("(max-width: 767px)");
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...phone,
      media: query,
      matches: query === "(max-width: 767px)",
    }));
    const user = userEvent.setup();
    render(<CareerTimeline />);
    const i = 1;
    const role = careerRoles[i];
    const card = document.querySelector<HTMLButtonElement>(`[aria-controls="career-md${i}"]`)!;
    const details = () => document.getElementById(`career-md${i}`)!;
    expect(details().hidden).toBe(true);

    await user.click(card);
    expect(card.getAttribute("aria-expanded")).toBe("true");
    expect(details().hidden).toBe(false);
    expect(details().textContent).toContain(role.heroBullet);
    // Compact: the card right above already names the company.
    expect(within(details()).queryByRole("heading")).toBeNull();

    await user.click(within(details()).getByRole("button", { name: "Close details" }));
    expect(details().hidden).toBe(true);
    expect(document.activeElement).toBe(card);
  });
});

// Added by the /ship test coverage audit, 2026-10-21.
// Value: protects=the detail panel counts a "Present" chapter's tenure up to today, in
//   months under a year and whole years from a year on; fails_when=the Present branch
//   or the month/year switch breaks (an off-by-one month, "NaNmo", "12mo");
//   why_new=no test reads the tenure; seam=none; no_claim=ended chapters' tenure
//   (unit only; only Date is faked)
describe("CareerTimeline tenure", () => {
  afterEach(() => vi.useRealTimers());

  const current = careerRoles.find((r) => r.endMonth === "Present")!;
  const [startYear, startMonth] = current.startMonth.split("-").map(Number);

  it.each([
    { monthsIn: 11, shown: "11mo" },
    { monthsIn: 12, shown: "1y" },
    { monthsIn: 27, shown: "2y" },
    { monthsIn: 30, shown: "2y" },
  ])("shows $shown for the current chapter $monthsIn months in", async ({ monthsIn, shown }) => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(startYear, startMonth - 1 + monthsIn, 15));
    const user = userEvent.setup();
    render(<CareerTimeline />);

    await user.click(screen.getByRole("button", { name: `${current.company}, ${current.yearsLabel}` }));
    expect(within(panel()).getByText(shown)).toBeTruthy();
  });
});
