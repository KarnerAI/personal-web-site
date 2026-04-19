"use client";

// Career Timeline — Option C · "Shape-of-career tape (Gantt)"
// Ported from public/career-comparison.html (#c).
// Horizontal tape with vermillion segments proportional to tenure, chip row above,
// year ticks below, and an opt-in detail panel that opens when a chip/bar is clicked.
// Default on first load = nothing pinned. Close via × button, Escape, or re-click.

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

// Proportional + flush: bars sit back-to-back with NO calendar gap between them.
// Each bar's width = its tenure / total tenure of all roles combined.
// Calendar gaps (e.g. Nov 2022 → Jul 2023) are collapsed. The axis is "share of
// career time," not "real calendar time."
const TENURES = careerRoles.map((r) => {
  const startMo = monthsFromEpoch(r.startMonth);
  const endMo = monthsFromEpoch(r.endMonth);
  return endMo - startMo;
});
const TOTAL_TENURE = TENURES.reduce((sum, t) => sum + t, 0);

const COMPUTED: Computed[] = careerRoles.map((r, i) => {
  const tenureMonths = TENURES[i];
  const widthPct = (tenureMonths / TOTAL_TENURE) * 100;
  const startPct = TENURES.slice(0, i).reduce((sum, t) => sum + t, 0) / TOTAL_TENURE * 100;
  return {
    ...r,
    startPct,
    widthPct,
    centerPct: startPct + widthPct / 2,
    tenure: tenureLabel(tenureMonths),
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
  variant: "chip" | "panel";
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

// Per-company year ranges centered under each bar.
// Flush-proportional model: no continuous calendar axis, just the range
// each bar covers. Pulled from career.ts `yearsLabel`.

export function CareerTimeline() {
  // null = nothing pinned (default on first load). Number = index of the open role.
  const [pinned, setPinned] = useState<number | null>(null);
  const [peek, setPeek] = useState<number | null>(null);
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
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          My career, in four chapters.
        </h2>
        <p className="text-muted mb-12 max-w-2xl">
          Fortune 100 ops out of college — founded a consultancy — 5th U.S. hire at a Series-A startup — joined WeWork three months before bankruptcy and led products to profitability.
        </p>

        {/* Timeline box */}
        <div
          ref={boxRef}
          tabIndex={0}
          role="group"
          aria-label="Career timeline"
          onKeyDown={onKeyDown}
          className="relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 rounded-xl"
        >
          {/* Chips above the tape */}
          <div className="relative h-[92px]">
            {COMPUTED.map((r, i) => (
              <button
                key={r.company}
                type="button"
                onMouseEnter={() => setPeek(i)}
                onMouseLeave={() => setPeek((p) => (p === i ? null : p))}
                onFocus={() => setPeek(i)}
                onBlur={() => setPeek((p) => (p === i ? null : p))}
                onClick={() => togglePinned(i)}
                aria-expanded={i === pinned}
                style={{
                  left: `${r.startPct}%`,
                  width: `${r.widthPct}%`,
                }}
                className={[
                  "absolute top-0 px-3 py-2 text-left",
                  "rounded-md border bg-[var(--surface)]",
                  "transition-all duration-200",
                  i === pinned
                    ? "border-[var(--accent)] shadow-[0_8px_24px_rgba(230,59,30,0.18)] -translate-y-0.5"
                    : "border-[var(--border)] hover:border-[var(--accent)]/60 hover:-translate-y-0.5",
                  "min-w-[80px]",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <CompanyLogo src={r.logoSrc} domain={r.logoDomain} initials={r.logo} variant="chip" />
                  <span className="font-semibold text-sm leading-tight truncate tracking-tight">{r.company}</span>
                </div>
                <span className="block text-[11px] text-muted mt-0.5 truncate">
                  {r.role.split(" → ").slice(-1)[0]}
                </span>
              </button>
            ))}

            {/* Hover peek tooltip */}
            <AnimatePresence>
              {peek !== null && peek !== pinned && (
                <motion.div
                  key={peek}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    left: `${COMPUTED[peek].centerPct}%`,
                  }}
                  className="absolute -top-10 -translate-x-1/2 pointer-events-none bg-[var(--foreground)] text-[var(--background)] text-[11px] font-mono px-2.5 py-1.5 rounded whitespace-nowrap"
                >
                  {COMPUTED[peek].company} · {COMPUTED[peek].yearsLabel} · {COMPUTED[peek].tenure}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gantt tape */}
          <div className="relative h-10 mt-2">
            {COMPUTED.map((r, i) => (
              <button
                key={r.company}
                type="button"
                onClick={() => togglePinned(i)}
                onMouseEnter={() => setPeek(i)}
                onMouseLeave={() => setPeek((p) => (p === i ? null : p))}
                aria-label={`${r.company} — ${r.tenure}`}
                aria-expanded={i === pinned}
                style={{
                  left: `${r.startPct}%`,
                  width: `${r.widthPct}%`,
                }}
                className={[
                  "absolute inset-y-0 rounded-md px-3 flex items-center",
                  "text-[11px] font-mono uppercase tracking-wider transition-colors",
                  i === pinned
                    ? "bg-[#2A3749] text-white"
                    : "bg-[#2A3749]/80 text-white hover:bg-[#2A3749]",
                ].join(" ")}
              >
                <span className="truncate">{r.tenure}</span>
              </button>
            ))}
          </div>

          {/* Per-company year ranges — one under each bar, left-aligned to the bar's start */}
          <div className="relative h-6 mt-1">
            {COMPUTED.map((r) => (
              <span
                key={r.company}
                style={{ left: `${r.startPct}%` }}
                className="absolute top-0 text-[11px] font-mono text-muted whitespace-nowrap"
              >
                {r.yearsLabel}
              </span>
            ))}
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
