"use client";

// Sticky header with smooth-scroll anchors (PRD §6).
//
// Desktop (≥ md): horizontal nav links, right-aligned.
// Mobile (< md): hamburger button opens a Radix Dialog drawer slid in from
// the right. Tapping a link inside the drawer closes it automatically
// (Dialog.Close asChild on each anchor) and lets the native `#anchor`
// navigation scroll-to-section. Escape + backdrop tap also close. All tap
// targets ≥ 44×44 per FINDING-005 / WCAG.
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const NAV = [
  { href: "#career", label: "Career" },
  { href: "#entrepreneurship", label: "Entrepreneurship" },
  { href: "#beyond-work", label: "Beyond Work" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--background)_85%,transparent)] border-b border-[var(--border)]">
      <nav className="content-width flex items-center justify-between h-14">
        <a href="#hero" className="font-medium tracking-tight">
          Hussain Alam
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 text-sm text-muted">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex items-center min-h-[44px] px-1 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-md text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
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
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            {/* Scrim — animates via data-state attrs. */}
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(15,30,61,0.45)] backdrop-blur-sm" />
            <Dialog.Content
              aria-label="Site navigation"
              className="fixed inset-y-0 right-0 z-50 w-[min(320px,85vw)] bg-[var(--background)] border-l border-[var(--border)] shadow-xl p-6 flex flex-col focus:outline-none"
            >
              <Dialog.Description className="sr-only">
                Site navigation menu. Use the links below to jump to sections of
                the page. Press Escape to close.
              </Dialog.Description>
              <div className="flex items-center justify-between mb-8">
                <Dialog.Title className="font-medium tracking-tight text-sm text-muted">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-md text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="5" x2="15" y2="15" />
                      <line x1="15" y1="5" x2="5" y2="15" />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>

              <ul className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Dialog.Close asChild>
                      <a
                        href={item.href}
                        className="flex items-center min-h-[48px] px-3 rounded-md text-base font-medium text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
                      >
                        {item.label}
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
