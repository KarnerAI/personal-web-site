"use client";

// Sticky frosted header (theme B, DESIGN.md; v7 mockup).
//
// Desktop (≥ md): brand left, section links right; the link for the section
// in view gets aria-current and a soft blue fill (scrollspy).
// Mobile (< md): menu button opens a Radix Dialog drawer from the right.
// Tapping a link closes it (Dialog.Close asChild), lets the native `#anchor`
// jump happen, and moves keyboard focus to that section so the next Tab
// continues from there. Escape, the scrim and × also close and return focus
// to the menu button. Every target is at least 44×44.
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const NAV = [
  { href: "#career", label: "Career" },
  { href: "#entrepreneurship", label: "Entrepreneurship" },
  { href: "#beyond-work", label: "Beyond Work" },
  { href: "#contact", label: "Contact" },
];

// Which section counts as "in view": the one crossing a band just above
// the middle of the screen.
const SPY_MARGIN = "-40% 0px -55% 0px";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  // The section a drawer link was tapped for, so closing can focus it.
  const picked = useRef<string | null>(null);

  useEffect(() => {
    // Watch every section, not just the linked ones, so the highlight clears
    // over the hero, the bridge and Education (as in v7).
    const sections = document.querySelectorAll("main section");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    // The last section (Contact) is short, so on tall screens its top never
    // reaches the band; scrolled to the bottom, it is the one in view.
    const last = sections[sections.length - 1];
    const atBottom = () => {
      const h = document.documentElement.scrollHeight;
      return h > window.innerHeight && window.innerHeight + window.scrollY >= h - 2;
    };
    // The section in the band, so leaving the bottom can hand the highlight back.
    let inBand: string | null = null;
    const pick = () => setActive(last.id && atBottom() ? `#${last.id}` : inBand);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand = entry.target.id ? `#${entry.target.id}` : null;
        }
        pick();
      },
      { rootMargin: SPY_MARGIN }
    );
    sections.forEach((el) => io.observe(el));
    const onScroll = () => pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="theme-b sticky top-0 z-40 border-b border-line bg-[rgba(251,251,250,0.82)] backdrop-blur-md backdrop-saturate-[1.8]">
      <nav aria-label="Primary" className="wrap flex h-[60px] items-center justify-between">
        <a
          href="#hero"
          className="inline-flex min-h-[44px] items-center text-[15px] font-semibold tracking-[-0.01em] text-ink"
        >
          Hussain Alam
        </a>

        {/* Desktop nav */}
        <ul className="m-0 hidden list-none gap-1 p-0 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-[rgba(15,30,61,0.05)] hover:text-ink aria-[current=true]:bg-[rgba(10,110,170,0.07)] aria-[current=true]:text-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="-mr-2.5 grid h-11 w-11 place-items-center rounded-[10px] text-ink transition-colors hover:bg-[rgba(15,30,61,0.05)] md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(15,30,61,0.38)] backdrop-blur-[4px] animate-fadeIn" />
            <Dialog.Content
              onCloseAutoFocus={(e) => {
                const target = picked.current ? document.querySelector<HTMLElement>(picked.current) : null;
                picked.current = null;
                if (!target) return;
                e.preventDefault();
                target.tabIndex = -1;
                target.focus({ preventScroll: true });
              }}
              className="theme-b fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(320px,85vw)] flex-col border-l border-line bg-white p-6 shadow-[0_2px_6px_rgba(15,30,61,0.06),0_40px_100px_-24px_rgba(15,30,61,0.45)] focus:outline-none animate-slideInRight"
            >
              <Dialog.Description className="sr-only">
                Site navigation menu. Use the links below to jump to sections of
                the page. Press Escape to close.
              </Dialog.Description>
              <div className="-mt-2.5 mb-6 flex items-center justify-between">
                <Dialog.Title className="type-label text-ink-muted tracking-[0.12em]">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="-mr-2.5 grid h-11 w-11 place-items-center rounded-[10px] text-ink-muted transition-colors hover:bg-[#F3F4F6] hover:text-ink"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path
                        d="M1 1l12 12M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>

              <ul className="m-0 list-none p-0">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Dialog.Close asChild>
                      <a
                        href={item.href}
                        onClick={() => {
                          picked.current = item.href;
                        }}
                        className="flex min-h-[48px] items-center justify-between rounded-[10px] px-3 text-base font-medium text-ink transition-colors hover:bg-[#F3F6F9]"
                      >
                        {item.label}
                        <span aria-hidden className="glyph text-ink-muted">
                          →
                        </span>
                      </a>
                    </Dialog.Close>
                  </li>
                ))}
              </ul>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
