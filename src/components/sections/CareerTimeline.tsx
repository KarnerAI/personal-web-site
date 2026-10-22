"use client";

// Career timeline (theme B, DESIGN.md; v7 mockup).
// Desktop (≥ 768px): four equal segments with cards above (chapters 1, 3) and
// below (2, 4), joined by stems. Clicking a card or segment pins it and opens
// the detail panel under the timeline; arrow keys move between chapters and
// Escape or × closes. Phones: a stacked list whose details expand in place.
// The page's one authored animation lives here: a Karner-blue fill sweeps the
// bar once when Career scrolls into view (see animateDesktop below). Without
// JS or with reduced motion, the static markup is already the final state.

import { useCallback, useEffect, useRef, useState } from "react";
import { careerRoles } from "@/data/career";
import type { CareerRole } from "@/types";
import { LogoTile } from "./LogoTile";
import { useImageFallback } from "./useImageFallback";

const DESKTOP_TOP = [0, 2];
const DESKTOP_BOTTOM = [1, 3];
const MOBILE_QUERY = "(max-width: 767px)";

// Tenure from start month to end month (or today for "Present"). Only shown in
// the detail panel, which renders after a click, so a build-time vs visit-time
// difference can't cause a hydration mismatch.
function tenure(r: CareerRole): string {
  const [sy, sm] = r.startMonth.split("-").map(Number);
  const now = new Date();
  const [ey, em] =
    r.endMonth === "Present" ? [now.getFullYear(), now.getMonth() + 1] : r.endMonth.split("-").map(Number);
  const months = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(months / 12);
  return years > 0 ? `${years}y` : `${months}mo`;
}

// A client's logo beside its name; the slot drops out if the image fails.
function ClientLogo({ src }: { src: string }) {
  const { failed, imgProps } = useImageFallback();
  if (failed) return null;
  return (
    <span aria-hidden className="cl-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" {...imgProps} />
    </span>
  );
}

function Clients({ role, inPanel = false }: { role: CareerRole; inPanel?: boolean }) {
  if (!role.clients?.length) return null;
  return (
    <span className={inPanel ? "cl dp-cl" : "cl"}>
      <span className="cl-k">Clients</span>
      {role.clients.map((c) => (
        <span key={c.name} className="cl-b">
          <ClientLogo src={c.logoSrc} />
          {c.name}
        </span>
      ))}
    </span>
  );
}

function Detail({
  role,
  compact,
  onClose,
}: {
  role: CareerRole;
  compact: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div className="dp-tools">
        <span aria-hidden className="kbd">
          esc
        </span>
        <button type="button" className="close-x" aria-label="Close details" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {!compact && <LogoTile src={role.logoSrc} domain={role.logoDomain} badge={role.logo ?? ""} className="dp-logo" />}
      <div className="dp-main">
        {!compact && <h3 className="dp-co">{role.company}</h3>}
        <p className="dp-role">{role.role}</p>
        <p className="dp-meta">
          <span>{role.yearsLabel}</span>
          <span>{tenure(role)}</span>
          <span>{role.location}</span>
        </p>
        {role.clients && (
          <p className="m-0">
            <Clients role={role} inPanel />
          </p>
        )}
        <p className="dp-why bar-quote">{role.whyIWasThere}</p>
        <p className="dp-hero">{role.heroBullet}</p>
        <ul className="dp-subs">
          {role.subBullets.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {role.roles && (
          <div className="roles">
            <p className="sub-label">Roles held</p>
            <ol className="tbl">
              {role.roles.map((r) => (
                <li key={r.title} className="tr">
                  <span>
                    <span className="t">{r.title}</span>
                    <span className="l">{r.loc}</span>
                  </span>
                  <span className="d">{r.dates}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}

// --- The one animation ------------------------------------------------------
// Desktop: the fill sweeps the bar segment by segment with a sky dot leading
// it; each finished segment reveals its year, draws its stem and lifts its card;
// then the fill fades back to the resting track. Any interaction finishes it.
const SEG_MS = 300;

function animateDesktop(tl: HTMLElement): () => void {
  let state = 0; // 0 waiting, 1 running, 2 done
  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  const mark = (sel: string, i: number) =>
    tl.querySelectorAll(`${sel}[data-i="${i}"]`).forEach((el) => el.classList.add("in"));

  const reset = () => {
    timers.forEach(clearTimeout);
    tl.classList.add("tl-snap");
    tl.classList.remove("tl-anim", "tl-run", "tl-end");
    tl.querySelectorAll(".in").forEach((el) => el.classList.remove("in"));
    void tl.offsetWidth;
    tl.classList.remove("tl-snap");
  };
  const finish = () => {
    if (state === 2) return;
    state = 2;
    io.disconnect();
    reset();
  };
  const run = () => {
    state = 1;
    tl.classList.add("tl-run");
    [0, 1, 2, 3].forEach((i) => {
      at((i + 1) * SEG_MS, () => {
        mark(".seg", i);
        mark(".stem", i);
      });
      at((i + 1) * SEG_MS + 90, () => mark(".tl-c", i));
    });
    at(4 * SEG_MS + 150, () => tl.classList.add("tl-end"));
    at(4 * SEG_MS + 900, finish);
  };

  tl.classList.add("tl-anim");
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (state === 0 && en.isIntersecting && en.intersectionRatio >= 0.28) {
          io.disconnect();
          run();
        }
      }
    },
    { threshold: [0, 0.3] }
  );
  io.observe(tl);
  const events = ["pointerdown", "keydown", "focusin"] as const;
  events.forEach((t) => tl.addEventListener(t, finish, true));

  return () => {
    io.disconnect();
    events.forEach((t) => tl.removeEventListener(t, finish, true));
    reset();
  };
}

// Phones: cards fade up in order as they enter the screen.
function animateMobile(tlm: HTMLElement): () => void {
  const items = Array.from(tlm.querySelectorAll<HTMLElement>(".mi"));
  const queue: HTMLElement[] = [];
  const seen = new Set<Element>();
  const timers: number[] = [];
  let left = items.length;
  let busy = false;

  const done = () => {
    timers.forEach(clearTimeout);
    mio.disconnect();
    tlm.classList.add("tl-snap");
    tlm.classList.remove("tl-anim");
    items.forEach((el) => el.classList.remove("in"));
    void tlm.offsetWidth;
    tlm.classList.remove("tl-snap");
  };
  const pump = () => {
    if (busy) return;
    const it = queue.shift();
    if (!it) return;
    busy = true;
    it.classList.add("in");
    if (--left === 0) timers.push(window.setTimeout(done, 700));
    timers.push(
      window.setTimeout(() => {
        busy = false;
        pump();
      }, 120)
    );
  };
  const interrupt = () => {
    if (tlm.classList.contains("tl-anim")) done();
  };

  tlm.classList.add("tl-anim");
  const mio = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting && en.intersectionRatio >= 0.2 && !seen.has(en.target)) {
          seen.add(en.target);
          mio.unobserve(en.target);
          queue.push(en.target as HTMLElement);
        }
      }
      pump();
    },
    { threshold: [0, 0.25] }
  );
  items.forEach((it) => mio.observe(it));
  const events = ["pointerdown", "keydown", "focusin"] as const;
  events.forEach((t) => tlm.addEventListener(t, interrupt, true));

  return () => {
    events.forEach((t) => tlm.removeEventListener(t, interrupt, true));
    done();
  };
}

export function CareerTimeline() {
  const [pinned, setPinned] = useState<number | null>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const tlmRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = useCallback((i: number) => setPinned((p) => (p === i ? null : i)), []);

  const close = useCallback(
    (refocus: boolean) => {
      if (pinned === null) return;
      const i = pinned;
      setPinned(null);
      if (refocus) {
        const mobile = window.matchMedia(MOBILE_QUERY).matches;
        (mobile ? mobileRefs : cardRefs).current[i]?.focus();
      }
    },
    [pinned]
  );

  // Escape closes the panel (unless a dialog is open), returning focus to the
  // card when focus was inside Career. A Radix dialog handles its Escape first
  // (capture phase) and marks it handled; in a real browser the dialog is often
  // already gone from the DOM by the time this listener runs, so check both.
  useEffect(() => {
    if (pinned === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || document.querySelector('[role="dialog"]')) return;
      const inside = Boolean(document.activeElement?.closest("#career"));
      close(inside);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pinned, close]);

  // Arrow keys move between chapters on the desktop timeline.
  const onArrows = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const last = careerRoles.length - 1;
    const next =
      pinned === null
        ? e.key === "ArrowRight"
          ? 0
          : last
        : e.key === "ArrowRight"
          ? Math.min(last, pinned + 1)
          : Math.max(0, pinned - 1);
    setPinned(next);
    cardRefs.current[next]?.focus();
  };

  useEffect(() => {
    const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!motionOK || !("IntersectionObserver" in window)) return;
    const cleanups: (() => void)[] = [];
    if (tlRef.current) cleanups.push(animateDesktop(tlRef.current));
    if (tlmRef.current) cleanups.push(animateMobile(tlmRef.current));
    return () => cleanups.forEach((c) => c());
  }, []);

  const card = (i: number) => {
    const r = careerRoles[i];
    return (
      <button
        key={r.company}
        ref={(el) => {
          cardRefs.current[i] = el;
        }}
        type="button"
        className="tl-c"
        data-i={i}
        style={{ gridColumn: i + 1 }}
        aria-expanded={pinned === i}
        aria-controls="career-dp"
        onClick={() => toggle(i)}
      >
        <span className="cd">
          <span className="co">
            <LogoTile src={r.logoSrc} domain={r.logoDomain} badge={r.logo ?? ""} />
            <span className="co-n">{r.company}</span>
          </span>
          <span className="tag">{r.tagline}</span>
          <Clients role={r} />
        </span>
      </button>
    );
  };

  const stems = (indices: number[], dir: "up" | "dn") => (
    <div className="stems" aria-hidden>
      {indices.map((i) => (
        <span
          key={i}
          className={`stem ${dir}`}
          data-i={i}
          data-on={pinned === i ? "" : undefined}
          style={{ left: `${12.5 + 25 * i}%` }}
        />
      ))}
    </div>
  );

  const current = pinned !== null ? careerRoles[pinned] : null;

  return (
    <section id="career" aria-labelledby="career-h" className="theme-b relative py-[112px] max-md:py-20">
      <div className="wrap">
        <p className="chip">Career</p>
        <h2 id="career-h" className="type-heading m-0 mb-8 text-ink">
          My career, in four chapters.
        </h2>
        <blockquote className="pull bar-quote">
          Fortune 100 ops out of college <span aria-hidden className="ar">→</span>
          <span className="sr-only select-none">, then</span> co-founded a consultancy{" "}
          <span aria-hidden className="ar">→</span>
          <span className="sr-only select-none">, then</span> 5th U.S. hire at a Series-A startup{" "}
          <span aria-hidden className="ar">→</span>
          <span className="sr-only select-none">, then</span> joined WeWork three months before
          bankruptcy and led products to profitability.
        </blockquote>

        {/* Phones: vertical stack, details expand in place. */}
        <div className="tl-m" ref={tlmRef}>
          {careerRoles.map((r, i) => (
            <div key={r.company} className="mi" data-i={i}>
              <button
                ref={(el) => {
                  mobileRefs.current[i] = el;
                }}
                type="button"
                className="mc"
                aria-expanded={pinned === i}
                aria-controls={`career-md${i}`}
                onClick={() => toggle(i)}
              >
                <span className="mc-top">
                  <span className="yr">{r.yearsLabel}</span>
                  <svg className="chev" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M3 5l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="co">
                  <LogoTile src={r.logoSrc} domain={r.logoDomain} badge={r.logo ?? ""} />
                  <span className="co-n">{r.company}</span>
                </span>
                <span className="tag">{r.tagline}</span>
                <Clients role={r} />
              </button>
              <div
                key={pinned === i ? "open" : "closed"}
                id={`career-md${i}`}
                className="dp md show"
                role="region"
                aria-label={`${r.company} details`}
                hidden={pinned !== i}
              >
                {pinned === i && <Detail role={r} compact onClose={() => close(true)} />}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: equal four-segment bar, cards above (1, 3) and below (2, 4). */}
        <div className="tl" ref={tlRef} role="group" aria-label="Career timeline" onKeyDown={onArrows}>
          <div className="tl-row top">{DESKTOP_TOP.map(card)}</div>
          {stems(DESKTOP_TOP, "up")}
          <div className="bar">
            {careerRoles.map((r, i) => (
              <button
                key={r.company}
                type="button"
                className="seg"
                data-i={i}
                aria-expanded={pinned === i}
                aria-controls="career-dp"
                aria-label={`${r.company}, ${r.yearsLabel}`}
                onClick={() => toggle(i)}
              >
                {r.yearsLabel}
              </button>
            ))}
            <span aria-hidden className="tl-fill">
              {careerRoles.map((r) => (
                <span key={r.company}>{r.yearsLabel}</span>
              ))}
            </span>
            <i aria-hidden className="tl-dot" />
          </div>
          {stems(DESKTOP_BOTTOM, "dn")}
          <div className="tl-row bot">{DESKTOP_BOTTOM.map(card)}</div>
        </div>
        <div
          key={pinned ?? "none"}
          id="career-dp"
          className="dp dp-desk show"
          role="region"
          aria-label={current ? `${current.company} details` : "Chapter details"}
          hidden={current === null}
        >
          {current && <Detail role={current} compact={false} onClose={() => close(true)} />}
        </div>
      </div>
    </section>
  );
}
