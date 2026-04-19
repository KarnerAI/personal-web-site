"use client";

// Travel map — stylized dot-matrix world in an SVG viewBox (480×240).
// Background dots paint rough continent shapes; a larger vermillion dot marks each
// visited country; the favorite gets a ringed dot. Hover any visited dot to see
// the country name in a tooltip positioned over the SVG.
// Data lives in src/data/beyondWork.ts.

import { useRef, useState } from "react";
import { continentBgDots, visitedCountries } from "@/data/beyondWork";

type Tip = { name: string; xPct: number; yPct: number } | null;

export function TravelMap() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tip, setTip] = useState<Tip>(null);

  return (
    <div
      ref={wrapRef}
      className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6"
    >
      <svg
        viewBox="0 0 480 240"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="World map showing visited countries"
      >
        {continentBgDots.map(([x, y], i) => (
          <circle
            key={`bg-${i}`}
            cx={x}
            cy={y}
            r={2.5}
            className="fill-[color:var(--border)]"
          />
        ))}
        {visitedCountries.map((v) => {
          const r = v.fav ? 7 : 5;
          return (
            <circle
              key={v.code}
              cx={v.x}
              cy={v.y}
              r={r}
              fill="var(--accent)"
              stroke={v.fav ? "var(--foreground)" : "none"}
              strokeWidth={v.fav ? 2 : 0}
              className="cursor-pointer transition-[r] duration-150 hover:[r:8]"
              onMouseEnter={() =>
                setTip({
                  name: v.name,
                  xPct: (v.x / 480) * 100,
                  yPct: (v.y / 240) * 100,
                })
              }
              onMouseLeave={() =>
                setTip((cur) => (cur?.name === v.name ? null : cur))
              }
            />
          );
        })}
      </svg>

      {tip && (
        <div
          style={{ left: `${tip.xPct}%`, top: `${tip.yPct}%` }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded bg-[var(--foreground)] px-2.5 py-1 text-[11px] font-mono text-[var(--background)] whitespace-nowrap shadow-[0_6px_16px_rgba(15,30,61,0.2)]"
        >
          {tip.name}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 text-[11px] font-mono text-muted">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          Visited
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] ring-2 ring-[var(--foreground)]" />
          Favorite
        </span>
      </div>
    </div>
  );
}
