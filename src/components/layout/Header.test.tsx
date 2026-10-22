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
});
