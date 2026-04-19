"use client";

// Variant A — Cartographer's Atlas.
// Light gray country fills + thin slate borders, vermillion pins,
// Colombia gets a navy halo ring. Ruled frame + tiny compass rose.

import { useState } from "react";
import { countryCoords } from "./countryCoords";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  countries,
  pathGen,
  project,
} from "./worldMap";

export function TravelMapAtlas() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
      {/* Small corner label */}
      <div className="absolute left-6 top-6 font-serif text-[11px] italic tracking-wide text-[var(--muted)]">
        Atlas
      </div>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="World atlas showing visited countries"
      >
        {/* Ruled frame */}
        <rect
          x={4}
          y={4}
          width={MAP_WIDTH - 8}
          height={MAP_HEIGHT - 8}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={0.6}
          opacity={0.35}
        />

        {/* Country shapes */}
        <g>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={i}
                d={d}
                fill="#EFEFEA"
                stroke="#5F6B85"
                strokeWidth={0.4}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Compass rose — bottom right */}
        <g transform={`translate(${MAP_WIDTH - 48}, ${MAP_HEIGHT - 50})`}>
          <circle cx={0} cy={0} r={14} fill="none" stroke="var(--foreground)" strokeWidth={0.6} opacity={0.5} />
          <line x1={0} y1={-14} x2={0} y2={14} stroke="var(--foreground)" strokeWidth={0.6} opacity={0.5} />
          <line x1={-14} y1={0} x2={14} y2={0} stroke="var(--foreground)" strokeWidth={0.6} opacity={0.5} />
          <polygon points="0,-16 -3,-6 0,-9 3,-6" fill="var(--accent)" />
          <text x={0} y={-20} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--foreground)">N</text>
        </g>

        {/* Visited pins */}
        <g>
          {countryCoords.map((c) => {
            const [x, y] = project(c.lng, c.lat);
            return (
              <g
                key={c.code}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover((h) => (h === c.name ? null : h))}
                className="cursor-pointer"
              >
                {c.fav && (
                  <circle
                    cx={x}
                    cy={y}
                    r={11}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth={1.5}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={c.fav ? 5.5 : 4.5}
                  fill="var(--accent)"
                  stroke="var(--surface)"
                  strokeWidth={1}
                />
                <title>{c.name}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 text-[11px] font-mono text-muted">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          Visited
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] ring-2 ring-[var(--foreground)] ring-offset-1 ring-offset-[var(--surface)]" />
          Favorite
        </span>
        {hover && (
          <span className="ml-auto font-mono text-[var(--foreground)]">
            {hover}
          </span>
        )}
      </div>
    </div>
  );
}
