// Regression: ISSUE-001, the header highlight never cleared outside the linked sections.
// Found by /qa on 2026-10-21
// Report: .gstack/qa-reports/qa-report-localhost-2026-10-21.md
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

// jsdom has no IntersectionObserver; keep the callback so a test can say
// which section is crossing the scrollspy band. Like a real browser, it only
// reports sections the header actually observes.
let report: (entries: Partial<IntersectionObserverEntry>[]) => void;
const observed = new Set<Element>();
class FakeObserver {
  constructor(cb: typeof report) {
    report = cb;
  }
  observe(el: Element) {
    observed.add(el);
  }
  unobserve(el: Element) {
    observed.delete(el);
  }
  disconnect() {
    observed.clear();
  }
  takeRecords() {
    return [];
  }
}

function Page() {
  return (
    <>
      <Header />
      <main>
        <section id="hero" />
        <section aria-label="On experience" />
        <section id="career" />
        <section id="entrepreneurship" />
        <section id="beyond-work" />
        <section id="education" />
        <section id="contact" />
      </main>
    </>
  );
}

const inView = (selector: string, isIntersecting = true) => {
  const target = document.querySelector(selector)!;
  if (observed.has(target)) act(() => report([{ isIntersecting, target }]));
};

const highlighted = () =>
  screen
    .getAllByRole("link")
    .filter((a) => a.getAttribute("aria-current") === "true")
    .map((a) => a.textContent);

describe("Header scrollspy", () => {
  beforeEach(() => vi.stubGlobal("IntersectionObserver", FakeObserver));
  afterEach(() => vi.unstubAllGlobals());

  it("highlights the linked section in view", () => {
    render(<Page />);
    expect(highlighted()).toEqual([]);
    inView("#career");
    expect(highlighted()).toEqual(["Career"]);
    inView("#beyond-work");
    expect(highlighted()).toEqual(["Beyond Work"]);
  });

  it("clears over the hero, the bridge and Education, as in v7", () => {
    render(<Page />);
    inView("#career");
    inView("#hero");
    expect(highlighted()).toEqual([]);

    inView("#career");
    inView('section[aria-label="On experience"]');
    expect(highlighted()).toEqual([]);

    inView("#beyond-work");
    inView("#education");
    expect(highlighted()).toEqual([]);
  });

  it("ignores a section leaving the band", () => {
    render(<Page />);
    inView("#entrepreneurship");
    inView("#career", false);
    expect(highlighted()).toEqual(["Entrepreneurship"]);
  });

  // Added by the /ship review, 2026-10-24.
  // Value: protects=the short closing Contact section is highlighted once the page is
  //   scrolled to the bottom, even if its top never reaches the band (tall screens);
  //   fails_when=the bottom-of-page rule is dropped, or fires on a page too short to
  //   scroll; why_new=the band-crossing tests never reach the last section; seam=none;
  //   no_claim=real layout heights (jsdom page metrics are stubbed)
  it("highlights Contact at the bottom of the page, and hands it back on the way up", () => {
    const metrics = (scrollHeight: number, scrollY: number) => {
      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: scrollHeight });
      Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });
    };
    try {
      render(<Page />);
      inView("#beyond-work");
      metrics(5000, 1000);
      expect(highlighted()).toEqual(["Beyond Work"]);
      metrics(5000, 5000 - window.innerHeight);
      expect(highlighted()).toEqual(["Contact"]);
      // A crossing reported while still at the bottom keeps Contact.
      inView("#beyond-work");
      expect(highlighted()).toEqual(["Contact"]);
      // Scrolling back up hands the highlight back to the section in the band.
      metrics(5000, 1000);
      expect(highlighted()).toEqual(["Beyond Work"]);
    } finally {
      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 0 });
      Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    }
  });
});
