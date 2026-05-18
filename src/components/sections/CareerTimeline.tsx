"use client";

// Career Timeline — Option C · "Shape-of-career tape (Gantt)"
// Ported from public/career-comparison.html (#c).
// Horizontal tape with vermillion segments proportional to tenure, chip row above,
// year ticks below, and an opt-in detail panel that opens when a chip/bar is clicked.
// Default on first load = nothing pinned. Close via × button, Escape, or re-click.

import { useCallback, useRef, useState } from "react";
import {
  careerRoles,
  TIMELINE_EPOCH_YEAR,
  TIMELINE_EPOCH_MONTH,
  TIMELINE_TODAY,
} from "@/data/career";
import type { CareerRole } from "@/types";

// --- Time math (months from epoch) ---
function monthsFromEpoch(s: string): number {
  if (s === "Present") {
    return (TIMELINE_TODAY.year - TIMELINE_EPOCH_YEAR) * 12 + (TIMELINE_TODAY.month - TIMELINE_EPOCH_MONTH);
  }
  const [y, m] = s.split("-").map(Number);
  return (y - TIMELINE_EPOCH_YEAR) * 12 + (m - TIMELINE_EPOCH_MONTH);
}

function tenureLabel(months: number): string {
  // Years-only label — drop the trailing "Nmo". "2y 9mo" → "2y".
  // Sub-year tenures still render as months so we don't display "0y".
  const y = Math.floor(months / 12);
  return y > 0 ? `${y}y` : `${months}mo`;
}

type Computed = CareerRole & {
  startPct: number;
  widthPct: number;
  centerPct: number;
  tenure: string;
};

// Equal segments — each role gets 1/N of the bar regardless of tenure length.
// We still compute tenure (months) so the in-bar label ("6y", "2y") stays
// honest about real time. Layout (startPct/widthPct/centerPct), however, is
// purely categorical — four chapters, four equal columns. This matches the
// approved v2 mockup where the bar is a structural device, not a calendar.
const TENURES = careerRoles.map((r) => {
  const startMo = monthsFromEpoch(r.startMonth);
  const endMo = monthsFromEpoch(r.endMonth);
  return endMo - startMo;
});

const SEGMENT_PCT = 100 / careerRoles.length;

const COMPUTED: Computed[] = careerRoles.map((r, i) => {
  const startPct = i * SEGMENT_PCT;
  return {
    ...r,
    startPct,
    widthPct: SEGMENT_PCT,
    centerPct: startPct + SEGMENT_PCT / 2,
    tenure: tenureLabel(TENURES[i]),
  };
});

// Company logo resolver.
// Priority: explicit src (local asset or URL) > Google's s2 favicon API > initials badge.
function CompanyLogo({
  src,
  domain,
  initials,
  variant,
}: {
  src?: string;
  domain?: string;
  initials?: string;
  variant: "chip" | "card" | "panel";
}) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = src ?? (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined);
  const showImage = Boolean(resolvedSrc) && !errored;

  if (variant === "chip") {
    return showImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt=""
        onError={() => setErrored(true)}
        className="h-5 w-5 rounded-sm object-contain"
      />
    ) : (
      <span className="font-mono text-[10px] bg-[#F0EFE9] text-muted rounded px-1.5 py-0.5">
        {initials}
      </span>
    );
  }

  // card — prominent badge for timeline cards. Bigger than chip, smaller than
  // panel. White circle with hairline so the logo pops against the card's
  // white surface. Slight inner padding so wordmarks/favicons don't run to
  // the edge of the badge.
  if (variant === "card") {
    return showImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt=""
        onError={() => setErrored(true)}
        className="h-11 w-11 rounded-full bg-[var(--surface)] border border-[var(--border)] object-contain shrink-0 p-1"
      />
    ) : (
      <span className="h-11 w-11 rounded-full bg-[#F0EFE9] flex items-center justify-center font-semibold text-sm tracking-tight shrink-0">
        {initials}
      </span>
    );
  }

  // panel — full-bleed logo, no grey frame
  return showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt=""
      onError={() => setErrored(true)}
      className="h-[72px] w-[72px] md:h-[88px] md:w-[88px] rounded-xl object-cover border border-[var(--border)]"
    />
  ) : (
    <div className="h-[72px] w-[72px] md:h-[88px] md:w-[88px] rounded-xl bg-[#F0EFE9] font-semibold text-2xl flex items-center justify-center tracking-tight">
      {initials}
    </div>
  );
}

// Timeline card — clickable card sitting above (top row) or below (bottom row)
// the bar. Click toggles the detail panel. Cards in the top row are
// bottom-aligned within their cell so they sit flush against the connector
// descending into the bar; bottom-row cards are top-aligned for the same
// reason. Each card occupies its segment's full width (25%) — flush with the
// next card so the row reads as a single horizontal band.
function TimelineCard({
  role: r,
  i,
  pinned,
  onToggle,
  position,
}: {
  role: Computed;
  i: number;
  pinned: number | null;
  onToggle: (i: number) => void;
  position: "top" | "bottom";
}) {
  const isPinned = i === pinned;
  return (
    <button
      type="button"
      onClick={() => onToggle(i)}
      aria-expanded={isPinned}
      aria-label={`${r.company}, ${r.yearsLabel}. ${isPinned ? "Hide" : "Show"} details.`}
      style={{ left: `${r.startPct}%`, width: `${r.widthPct}%` }}
      className={[
        "absolute px-2 text-left",
        position === "top" ? "bottom-0" : "top-0",
      ].join(" ")}
    >
      <div
        className={[
          "rounded-lg p-4 md:p-5 transition-all duration-200 bg-[var(--surface)] border h-full",
          isPinned
            ? "border-[var(--accent)] shadow-[0_8px_24px_rgba(230,59,30,0.18)] -translate-y-0.5"
            : "border-[var(--border)] hover:border-[var(--accent)]/60 hover:-translate-y-0.5",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 mb-2">
          <CompanyLogo
            src={r.logoSrc}
            domain={r.logoDomain}
            initials={r.logo}
            variant="card"
          />
          <span className="font-semibold text-[17px] md:text-[18px] tracking-tight leading-tight">
            {r.company}
          </span>
        </div>
        {r.tagline && (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)] leading-snug mt-1">
            {r.tagline}
          </p>
        )}
      </div>
    </button>
  );
}

export function CareerTimeline() {
  // null = nothing pinned (default on first load). Number = index of the open role.
  const [pinned, setPinned] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const current = pinned !== null ? COMPUTED[pinned] : null;

  // Toggle: clicking the already-open chip/bar closes the panel.
  const togglePinned = useCallback((i: number) => {
    setPinned((cur) => (cur === i ? null : i));
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (pinned !== null) {
        e.preventDefault();
        setPinned(null);
      }
      return;
    }
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setPinned((cur) => {
      if (cur === null) return e.key === "ArrowRight" ? 0 : COMPUTED.length - 1;
      return e.key === "ArrowRight"
        ? Math.min(COMPUTED.length - 1, cur + 1)
        : Math.max(0, cur - 1);
    });
  }, [pinned]);

  return (
    <section id="career" className="section !pb-0">
      <div className="content-width">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">Career</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">
          My career, in four chapters.
        </h2>
        <blockquote className="relative mb-10 border-l-[3px] border-[var(--accent)] pl-4 md:pl-5 max-w-3xl text-[17px] md:text-[18px] font-medium leading-relaxed text-[var(--foreground)]">
          Fortune 100 ops out of college <span className="text-[var(--accent)] italic font-medium">—</span> founded a consultancy <span className="text-[var(--accent)] italic font-medium">—</span> 5th U.S. hire at a Series-A startup <span className="text-[var(--accent)] italic font-medium">—</span> joined WeWork three months before bankruptcy and led products to profitability.
        </blockquote>

        {/* Mobile vertical layout — single column of chapter cards, chronological.
            The horizontal Gantt below is desktop-only; this fallback gives mobile
            its own design (not just stacked desktop columns). */}
        <div className="md:hidden flex flex-col gap-3">
          {COMPUTED.map((r, i) => {
            const isPinned = i === pinned;
            return (
              <button
                key={r.company}
                type="button"
                onClick={() => togglePinned(i)}
                aria-expanded={isPinned}
                aria-label={`${r.company}, ${r.yearsLabel}. ${isPinned ? "Hide" : "Show"} details.`}
                className="text-left rounded-lg"
              >
                <div
                  className={[
                    "rounded-lg p-4 transition-all duration-200 bg-[var(--surface)] border",
                    isPinned
                      ? "border-[var(--accent)] shadow-[0_8px_24px_rgba(230,59,30,0.18)]"
                      : "border-[var(--border)]",
                  ].join(" ")}
                >
                  <div className="mb-3">
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-white bg-[#2A3749] rounded px-2 py-1">
                      {r.yearsLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <CompanyLogo
                      src={r.logoSrc}
                      domain={r.logoDomain}
                      initials={r.logo}
                      variant="card"
                    />
                    <span className="font-semibold text-[17px] tracking-tight leading-tight">
                      {r.company}
                    </span>
                  </div>
                  {r.tagline && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)] leading-snug mt-1">
                      {r.tagline}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Timeline box — desktop Gantt (md+) */}
        <div
          ref={boxRef}
          tabIndex={0}
          role="group"
          aria-label="Career timeline"
          onKeyDown={onKeyDown}
          className="hidden md:block relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 rounded-xl"
        >
          {/* Top row — cards above the bar (positions 0, 2). Card heights are
              fixed so all cards in a row line up; line-clamp-3 keeps the
              italic line visually tight. */}
          <div className="relative h-[132px]">
            {COMPUTED.map((r, i) =>
              i % 2 === 0 ? (
                <TimelineCard
                  key={r.company}
                  role={r}
                  i={i}
                  pinned={pinned}
                  onToggle={togglePinned}
                  position="top"
                />
              ) : null
            )}
          </div>

          {/* Top connector stems — one hairline per top card, descending to the bar */}
          <div className="relative h-5" aria-hidden="true">
            {COMPUTED.map((r, i) =>
              i % 2 === 0 ? (
                <div
                  key={r.company}
                  className="absolute top-0 h-full w-px bg-[var(--border)]"
                  style={{ left: `${r.centerPct}%` }}
                />
              ) : null
            )}
          </div>

          {/* Bar — 4 equal segments, year range inside each segment */}
          <div className="relative h-12 rounded-md overflow-hidden flex">
            {COMPUTED.map((r, i) => (
              <button
                key={r.company}
                type="button"
                onClick={() => togglePinned(i)}
                aria-label={`${r.company} — ${r.yearsLabel}`}
                aria-expanded={i === pinned}
                className={[
                  "flex-1 flex items-center justify-center",
                  "text-white font-mono text-[11px] uppercase tracking-[0.12em]",
                  "transition-colors border-r border-white/10 last:border-r-0",
                  i === pinned ? "bg-[#1F2937]" : "bg-[#2A3749] hover:bg-[#1F2937]",
                ].join(" ")}
              >
                {r.yearsLabel}
              </button>
            ))}
          </div>

          {/* Bottom connector stems — one hairline per bottom card, rising from the bar */}
          <div className="relative h-5" aria-hidden="true">
            {COMPUTED.map((r, i) =>
              i % 2 === 1 ? (
                <div
                  key={r.company}
                  className="absolute top-0 h-full w-px bg-[var(--border)]"
                  style={{ left: `${r.centerPct}%` }}
                />
              ) : null
            )}
          </div>

          {/* Bottom row — cards below the bar (positions 1, 3) */}
          <div className="relative h-[132px]">
            {COMPUTED.map((r, i) =>
              i % 2 === 1 ? (
                <TimelineCard
                  key={r.company}
                  role={r}
                  i={i}
                  pinned={pinned}
                  onToggle={togglePinned}
                  position="bottom"
                />
              ) : null
            )}
          </div>
        </div>

        {/* Detail panel — only renders when a role is pinned */}
        {current && (
          <div
            key={current.company}
            className="relative mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 grid grid-cols-[72px_1fr] md:grid-cols-[88px_1fr] gap-5 md:gap-7 animate-in fade-in-0 slide-in-from-top-1 duration-200"
          >
              <button
                type="button"
                onClick={() => setPinned(null)}
                aria-label="Close details"
                className="absolute top-3 right-3 md:top-4 md:right-4 h-8 w-8 rounded-full flex items-center justify-center text-muted hover:text-[var(--foreground)] hover:bg-[#F0EFE9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <CompanyLogo
                src={current.logoSrc}
                domain={current.logoDomain}
                initials={current.logo}
                variant="panel"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{current.company}</h3>
              <p className="text-[15px] font-medium mt-1">{current.role}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-mono text-muted">
                <span>{current.yearsLabel}</span>
                <span>· {current.tenure}</span>
                <span>· {current.location}</span>
              </div>
              <p className="mt-5 italic text-[15px] text-muted border-l-[3px] border-[var(--accent)] pl-4 max-w-2xl">
                {current.whyIWasThere}
              </p>
              <p className="mt-5 text-[15px] font-medium max-w-2xl">{current.heroBullet}</p>
              <ul className="mt-3 space-y-2 max-w-2xl">
                {current.subBullets.map((b, i) => (
                  <li key={i} className="text-[14px] text-muted leading-relaxed pl-4 relative">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-[var(--accent)]/70" />
                    {b}
                  </li>
                ))}
              </ul>
              {current.roles && current.roles.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <h4 className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-3">
                    Roles held
                  </h4>
                  <ol className="space-y-2">
                    {current.roles.map((r, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm"
                      >
                        <div>
                          <span className="font-medium">{r.title}</span>
                          <span className="text-muted font-mono text-[11px] ml-2">{r.loc}</span>
                        </div>
                        <span className="font-mono text-[11px] text-muted">{r.dates}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              </div>
          </div>
        )}
      </div>
    </section>
  );
}
