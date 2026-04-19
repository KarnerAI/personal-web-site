"use client";

// Variant C — Topographic Journal.
// Sketched-feeling navy country borders on a warm cream paper background
// with subtle noise texture. Vermillion pushpins with soft drop shadow +
// handwritten-style labels. Colombia gets a slightly bigger pin with a
// tiny ribbon tail.

import { useState } from "react";
import { countryCoords } from "./countryCoords";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  countries,
  pathGen,
  project,
} from "./worldMap";

// A few countries to label on the map (not all 16 — we want handwritten,
// not crowded). Colombia always shown; others are selective.
const LABELED = new Set(["CO", "JP", "BR", "IN"]);

export function TravelMapJournal() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div
      className="relative w-full rounded-xl border border-[var(--border)] p-4 md:p-5"
      style={{
        background:
          "radial-gradient(ellipse at center, #FDFCF7 0%, #F6F1E4 100%)",
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="Hand-drawn travel journal map"
      >
        <defs>
          {/* Soft drop shadow for pushpins */}
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" />
            <feOffset dx="0.8" dy="1.4" result="off" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Paper noise pattern — subtle */}
          <pattern id="paper-stipple" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.35" fill="#C9BFA5" opacity="0.35" />
            <circle cx="4" cy="3" r="0.25" fill="#C9BFA5" opacity="0.25" />
          </pattern>

          {/* Ocean hatch — very subtle */}
          <pattern id="ocean-hatch" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#B8AE91" strokeWidth="0.3" opacity="0.25" />
          </pattern>
        </defs>

        {/* Paper background */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#paper-stipple)" />
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-hatch)" />

        {/* Countries — ink-drawn borders on warm cream fill */}
        <g>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={i}
                d={d}
                fill="#FAF5E7"
                stroke="var(--foreground)"
                strokeWidth={0.55}
                strokeLinejoin="round"
                opacity={0.9}
              />
            );
          })}
        </g>

        {/* Handwritten compass */}
        <g transform={`translate(${MAP_WIDTH - 52}, 42)`}>
          <path
            d="M 0 14 L 0 -14 M -4 -10 L 0 -14 L 4 -10"
            stroke="var(--foreground)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={0}
            y={-18}
            textAnchor="middle"
            fontSize={11}
            fontStyle="italic"
            fill="var(--foreground)"
            fontFamily="Georgia, serif"
          >
            N
          </text>
        </g>

        {/* Pushpins */}
        <g>
          {countryCoords.map((c) => {
            const [x, y] = project(c.lng, c.lat);
            const isFav = !!c.fav;
            const r = isFav ? 6 : 4.5;
            return (
              <g
                key={c.code}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover((h) => (h === c.name ? null : h))}
                className="cursor-pointer"
                filter="url(#pin-shadow)"
              >
                {/* Favorite ribbon tail */}
                {isFav && (
                  <path
                    d={`M ${x - 1} ${y + r} L ${x - 4} ${y + r + 9} L ${x} ${y + r + 6} L ${x + 4} ${y + r + 9} L ${x + 1} ${y + r} Z`}
                    fill="var(--accent)"
                    opacity={0.95}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="var(--accent)"
                  stroke="#A5240D"
                  strokeWidth={0.8}
                />
                {/* Pin highlight */}
                <circle cx={x - 1.2} cy={y - 1.2} r={r * 0.35} fill="#FFB59E" opacity={0.8} />
                <title>{c.name}</title>
              </g>
            );
          })}
        </g>

        {/* Handwritten labels for a few select countries */}
        <g>
          {countryCoords
            .filter((c) => LABELED.has(c.code))
            .map((c) => {
              const [x, y] = project(c.lng, c.lat);
              return (
                <text
                  key={`lbl-${c.code}`}
                  x={x + 10}
                  y={y + 3}
                  fontSize={13}
                  fontStyle="italic"
                  fontFamily="Georgia, serif"
                  fill="var(--foreground)"
                >
                  {c.name}
                </text>
              );
            })}
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 text-[11px] font-mono text-muted">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          Pinned
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)]" />
          <span className="italic font-serif text-[var(--foreground)]">Favorite · with ribbon</span>
        </span>
        {hover && (
          <span className="ml-auto font-serif italic text-[var(--foreground)]">
            {hover}
          </span>
        )}
      </div>
    </div>
  );
}
