import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { careerRoles } from "@/data/career";
import { CareerTimeline, KeyNumbers } from "./CareerTimeline";

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
    expect(details().textContent).toContain(role.heroBullet.replaceAll("**", ""));
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

describe("KeyNumbers", () => {
  it("bolds the marked number and keeps the rest as plain text", () => {
    const { container } = render(
      <p>
        <KeyNumbers text="Cut errors from **7% to 1%** in a year." />
      </p>
    );
    expect(container.textContent).toBe("Cut errors from 7% to 1% in a year.");
    expect([...container.querySelectorAll("b")].map((b) => b.textContent)).toEqual(["7% to 1%"]);
  });

  it("leaves a line with no marker unbolded", () => {
    const { container } = render(<KeyNumbers text="No numbers here." />);
    expect(container.querySelector("b")).toBeNull();
  });

  // The data rule: one bold number per story line, with its markers paired.
  it.each(careerRoles.map((r) => [r.company, r] as const))("bolds one key number per %s story line", (_c, r) => {
    for (const line of [r.heroBullet, ...r.subBullets]) {
      expect(line.split("**")).toHaveLength(3);
    }
  });
});

describe("CareerTimeline present chapter", () => {
  // The animation settles on the present chapter, so its accent must be in the
  // static markup (reduced motion and no-JS see the same final state).
  it("marks only the present chapter as now, on desktop and phones", () => {
    const { container } = render(<CareerTimeline />);
    const now = careerRoles.map((r) => r.endMonth === "Present");
    for (const sel of [".seg", ".mi", ".stem"]) {
      const marked = [...container.querySelectorAll(sel)]
        .filter((el) => el.classList.contains("now"))
        .map((el) => Number(el.getAttribute("data-i")));
      expect(marked).toEqual(now.flatMap((n, i) => (n ? [i] : [])));
    }
  });

  it("draws a phone rail between chapters, none after the last", () => {
    const { container } = render(<CareerTimeline />);
    const items = [...container.querySelectorAll(".mi")];
    expect(items.map((mi) => mi.querySelector(".rail") !== null)).toEqual(
      careerRoles.map((_, i) => i < careerRoles.length - 1)
    );
  });
});

// jsdom has no IntersectionObserver or motion preference. Keep each observer's
// callback and targets so a test can say where an element sits on screen, and
// report motion as allowed so the career reading animation arms.
type Spot = { isIntersecting: boolean; intersectionRatio: number; top: number };
const observers: { cb: IntersectionObserverCallback; targets: Set<Element> }[] = [];
class FakeObserver {
  targets = new Set<Element>();
  constructor(cb: IntersectionObserverCallback) {
    observers.push({ cb, targets: this.targets });
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
}
const report = (el: Element, { isIntersecting, intersectionRatio, top }: Spot) => {
  const o = observers.find((x) => x.targets.has(el));
  if (!o) return;
  const entry = { target: el, isIntersecting, intersectionRatio, boundingClientRect: { top } as DOMRectReadOnly };
  act(() => o.cb([entry as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
};
const PAST: Spot = { isIntersecting: false, intersectionRatio: 0, top: -600 };
const IN_VIEW: Spot = { isIntersecting: true, intersectionRatio: 0.5, top: 100 };

describe("CareerTimeline reading animation", () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    const base = window.matchMedia("(prefers-reduced-motion: no-preference)");
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...base,
      media: query,
      matches: query === "(prefers-reduced-motion: no-preference)",
    }));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Added by the /ship test coverage audit, 2026-10-24.
  // Value: protects=a visitor who lands below Career (a nav link, a reload mid-page)
  //   gets the finished timeline at once, and scrolling back up does not replay the
  //   sweep; fails_when=the "landed below" branch is dropped or inverted, so the
  //   cards and years stay hidden until Career is scrolled back into view;
  //   why_new=the e2e sweep test always loads at the top; unit tests ran with motion
  //   off; seam=none; no_claim=what the CSS shows (class state only; jsdom, unit only)
  it("shows the desktop timeline as is when the page opens below Career", () => {
    const { container } = render(<CareerTimeline />);
    const tl = container.querySelector(".tl")!;
    expect(tl.classList.contains("tl-anim")).toBe(true);

    report(tl, PAST);
    expect(tl.classList.contains("tl-anim")).toBe(false);
    report(tl, IN_VIEW);
    expect(tl.classList.contains("tl-run")).toBe(false);
    expect(tl.classList.contains("tl-anim")).toBe(false);
  });

  // Added by the /ship test coverage audit, 2026-10-24.
  // Value: protects=on phones a card already scrolled past shows at once without its
  //   entrance, and once every card is past the animation ends with all of them
  //   showing; fails_when=the "scrolled past" branch is dropped (cards above the
  //   screen stay hidden) or its count never reaches finish (the list stays armed);
  //   why_new=the e2e phone test scrolls down from the top, so no card is ever past;
  //   seam=none; no_claim=the rail fill and timing (class state only; jsdom, unit only)
  it("shows phone cards already scrolled past, and ends once every card is past", () => {
    const { container } = render(<CareerTimeline />);
    const tlm = container.querySelector(".tl-m")!;
    const items = [...tlm.querySelectorAll(".mi")];
    expect(tlm.classList.contains("tl-anim")).toBe(true);

    items.slice(0, -1).forEach((el) => report(el, PAST));
    expect(items.map((el) => el.classList.contains("in"))).toEqual(items.map((_, i) => i < items.length - 1));
    expect(tlm.classList.contains("tl-anim")).toBe(true);

    report(items[items.length - 1], PAST);
    expect(tlm.classList.contains("tl-anim")).toBe(false);
  });

  // Added by the /ship test coverage audit, 2026-10-24.
  // Value: protects=on phones, cards that scroll in together arrive one by one in page
  //   order, the rail from the card above fills before the next card arrives, and the
  //   animation ends once the last card has answered; fails_when=the queue is not
  //   sorted (a lower card pops in first), the rail lead or the gap between cards is
  //   dropped (cards arrive at once with no rail fill), or the end after the last
  //   arrival never fires (the list stays armed); why_new=the other phone test only
  //   covers cards already scrolled past, and e2e does not check order or timing;
  //   seam=none; no_claim=what the CSS draws (class state only; jsdom, unit only)
  it("brings phone cards in one by one, in page order, each after the rail above fills", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<CareerTimeline />);
      const tlm = container.querySelector(".tl-m")!;
      const items = [...tlm.querySelectorAll(".mi")];
      const has = (el: Element, c: string) => el.classList.contains(c);
      const o = observers.find((x) => x.targets.has(items[0]))!;
      const entry = (el: Element) =>
        ({ target: el, isIntersecting: true, intersectionRatio: 0.5, boundingClientRect: { top: 100 } }) as unknown as IntersectionObserverEntry;

      // Every card enters in one callback, bottom card first.
      act(() => o.cb([...items].reverse().map(entry), {} as IntersectionObserver));
      act(() => vi.advanceTimersByTime(0));
      expect(items.map((el) => has(el, "in"))).toEqual(items.map((_, i) => i === 0));

      for (let i = 1; i < items.length; i++) {
        act(() => vi.advanceTimersByTime(180)); // the gap: the rail above starts filling
        expect(has(items[i - 1], "reach")).toBe(true);
        expect(has(items[i], "in")).toBe(false);
        act(() => vi.advanceTimersByTime(350)); // the rail has filled: the card arrives
        expect(has(items[i], "in")).toBe(true);
        if (i + 1 < items.length) expect(has(items[i + 1], "in")).toBe(false);
      }

      expect(has(tlm, "tl-anim")).toBe(true);
      act(() => vi.advanceTimersByTime(800 + 149));
      expect(has(tlm, "tl-anim")).toBe(true);
      act(() => vi.advanceTimersByTime(1));
      expect(has(tlm, "tl-anim")).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

// Added by the /ship test coverage audit, 2026-10-24.
// Value: protects=every chapter card, desktop and phone, ends with its proof line
//   (bold lead, then the rest) and the "See the story" cue; fails_when=CardFoot drops
//   the kpi or its bold lead, the cue goes, or a chapter loses its kpi data;
//   why_new=no test reads the card footer; seam=none; no_claim=the CSS swap to
//   "Showing below" on aria-expanded (jsdom, unit only)
describe("CareerTimeline card footer", () => {
  it.each(careerRoles.map((r, i) => [r.company, r, i] as const))("shows the %s proof line on both cards", (_c, r, i) => {
    const { container } = render(<CareerTimeline />);
    const cards = [
      container.querySelector(`.tl-c[data-i="${i}"]`)!,
      container.querySelector(`[aria-controls="career-md${i}"]`)!,
    ];
    for (const card of cards) {
      const kpi = card.querySelector(".kpi")!;
      expect(kpi.querySelector("b")?.textContent).toBe(r.kpi!.lead);
      expect(kpi.textContent).toBe(`${r.kpi!.lead} ${r.kpi!.rest}`);
      expect(card.querySelector(".more")?.textContent).toBe("See the story");
    }
  });
});
