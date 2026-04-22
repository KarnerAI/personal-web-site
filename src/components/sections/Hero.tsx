"use client";

// Hero — "Notion faithful" variant.
// Ported from public/hero-variants/a.html — approved by user 2026-04-18.
// Cover photo → overlapping circular headshot → greeting → About (quote + callout bio) + Contact sidebar.
// Type is Inter-only (no serif) to match Notion's visual vibe. Palette stays Tokyo Transit.
import { motion } from "framer-motion";
import { EditableImage } from "@/components/edit-mode/EditableImage";

const NAME = "Hussain Alam";
const SUBLINE = "Product Strategist & Builder · New York";
const BIO =
  "12+ years across Fortune 100 growth and early-stage startups. I lead cross-functional teams, ship product, and start things on the side. Based in New York.";
const QUOTE = "The only source of knowledge is experience.";
const QUOTE_CITE = "Albert Einstein";

// Cover art — Annapurna South / Poon Hill at dusk (Unsplash).
// Original: unsplash.com/photos/QH9MAAVqLek. Trimmed 4800px → 1920px for LCP.
const COVER_URL =
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920";

// Soft warm callout tint — matches public/hero-variants/tokens.css --surface.
// Hardcoded because the project's existing --surface is pure white (used for cards).
const CALLOUT_TINT = "#F3F1EA";

// Local portrait. Uses public/logos/profile-image.png (full-body shot in front of rocks;
// the EditableImage crop position below frames it tight on the face).
// Falls back to "HA" monogram if the file is missing.
const PORTRAIT_URL = "/logos/profile-image.png";

export function Hero() {
  return (
    <section id="hero" aria-label="Introduction">
      {/* Full-bleed cover photo — EditableImage lets the user upload/reposition in edit mode. */}
      <EditableImage
        slotId="hero-cover"
        ariaLabel="Cover image"
        defaultSrc={COVER_URL}
        defaultPositionX={50}
        defaultPositionY={50}
        exportSize={{ w: 1920, h: 680 }}
        className="h-[280px] md:h-[340px] w-full overflow-hidden bg-[var(--foreground)]/5"
      >
        {/* Availability pill */}
        <div className="absolute top-5 right-5 md:top-6 md:right-8 z-10 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          Open to select advising
        </div>
      </EditableImage>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="content-width relative -mt-16 md:-mt-20 pb-16 md:pb-24"
      >
        {/* Headshot overlapping the cover.
            The "HA" monogram is always in the DOM; background-image of the portrait
            layers on top. If the file is missing, backgroundImage silently fails and
            the monogram shows through. No hydration race. */}
        <EditableImage
          slotId="hero-portrait"
          ariaLabel={NAME}
          defaultSrc={PORTRAIT_URL}
          defaultPositionX={50}
          defaultPositionY={22}
          exportSize={{ w: 1024, h: 1024 }}
          className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-[var(--foreground)] ring-4 ring-[var(--background)] shadow-lg"
        />

        {/* Greeting */}
        <div className="mt-8 md:mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold tracking-tight leading-[1.05]">
            Hey{" "}
            <span aria-hidden className="inline-block -translate-y-1">
              👋🏽
            </span>{" "}
            I&apos;m {NAME}.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted">{SUBLINE}</p>
        </div>

        {/* About + Contact */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-12 md:gap-20">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-5">About</h3>
            <blockquote className="border-l-[3px] border-[var(--accent)] pl-4 max-w-2xl text-[15px] text-muted leading-relaxed">
              &ldquo;{QUOTE}&rdquo;{" "}
              <cite className="not-italic font-medium text-[var(--foreground)]">
                — {QUOTE_CITE}
              </cite>
            </blockquote>
            <div
              className="mt-7 flex gap-4 items-start rounded-xl px-6 py-5 max-w-2xl"
              style={{ background: CALLOUT_TINT }}
            >
              <span aria-hidden className="text-xl leading-snug">
                👋
              </span>
              <p className="text-[15px] leading-relaxed m-0">{BIO}</p>
            </div>
          </div>

          {/* Contact sidebar */}
          <aside>
            <h3 className="text-lg font-semibold tracking-tight mb-5">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/hussainalam"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline gap-3"
                >
                  <span className="font-semibold w-20 shrink-0">LinkedIn</span>
                  <span className="text-muted group-hover:text-[var(--accent)] transition-colors">
                    /in/hussainalam
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hi@hussainalam.com"
                  className="group flex items-baseline gap-3"
                >
                  <span className="font-semibold w-20 shrink-0">Email</span>
                  <span className="text-muted group-hover:text-[var(--accent)] transition-colors">
                    hi@hussainalam.com
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-baseline gap-3">
                  <span className="font-semibold w-20 shrink-0">Writing</span>
                  <span className="text-muted">Coming soon</span>
                </div>
              </li>
            </ul>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
            >
              Get in touch <span aria-hidden>→</span>
            </a>
          </aside>
        </div>
      </motion.div>
    </section>
  );
}
