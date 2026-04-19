"use client";

// Variant D — Mercator Plate with Graticule.
// Scientific atlas plate feel: graticule lat/lng grid, light-gray country
// fills with fine borders, ruled frame, Colombia called out with a
// leader line and uppercase mono label.

import { useState } from "react";
import { geoGraticule10 } from "d3-geo";
import { countryCoords } from "./countryCoords";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  countries,
  pathGen,
  project,
} from "./worldMap";

const graticulePath = pathGen(geoGraticule10());

export function TravelMapPlate() {
  const [hover, setHover] = useState<string | null>(null);

  const colombia = countryCoords.find((c) => c.code === "CO")!;
  const [coX, coY] = project(colombia.lng, colombia.lat);

  return (
    <div className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
      {/* Corner plate number */}
      <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
        Plate 16 · Visited
      </div>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="Mercator plate of visited countries"
      >
        {/* Ruled frame */}
        <rect
          x={2}
          y={2}
          width={MAP_WIDTH - 4}
          height={MAP_HEIGHT - 4}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={0.8}
        />

        {/* Tick marks along top/bottom */}
        {Array.from({ length: 17 }).map((_, i) => {
          const x = (i * MAP_WIDTH) / 16;
          return (
            <g key={`tick-${i}`}>
              <line x1={x} y1={2} x2={x} y2={i % 2 === 0 ? 10 : 6} stroke="var(--foreground)" strokeWidth={0.5} />
              <line
                x1={x}
                y1={MAP_HEIGHT - 2}
                x2={x}
                y2={MAP_HEIGHT - (i % 2 === 0 ? 10 : 6)}
                stroke="var(--foreground)"
                strokeWidth={0.5}
              />
            </g>
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = (i * MAP_HEIGHT) / 8;
          return (
            <g key={`tickY-${i}`}>
              <line x1={2} y1={y} x2={i % 2 === 0 ? 10 : 6} y2={y} stroke="var(--foreground)" strokeWidth={0.5} />
              <line
                x1={MAP_WIDTH - 2}
                y1={y}
                x2={MAP_WIDTH - (i % 2 === 0 ? 10 : 6)}
                y2={y}
                stroke="var(--foreground)"
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* Graticule */}
        {graticulePath && (
          <path d={graticulePath} fill="none" stroke="var(--muted)" strokeWidth={0.3} opacity={0.3} />
        )}

        {/* Country shapes */}
        <g>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={i}
                d={d}
                fill="#E8E9EC"
                stroke="#2B3752"
                strokeWidth={0.35}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Colombia callout leader line + label */}
        <g>
          <line
            x1={coX}
            y1={coY}
            x2={coX - 60}
            y2={coY + 55}
            stroke="var(--accent)"
            strokeWidth={0.7}
          />
          <line
            x1={coX - 60}
            y1={coY + 55}
            x2={coX - 120}
            y2={coY + 55}
            stroke="var(--accent)"
            strokeWidth={0.7}
          />
          <text
            x={coX - 122}
            y={coY + 52}
            textAnchor="end"
            fontSize={9}
            fontFamily="monospace"
            letterSpacing="0.1em"
            fill="var(--foreground)"
          >
            COLOMBIA
          </text>
          <text
            x={coX - 122}
            y={coY + 62}
            textAnchor="end"
            fontSize={7}
            fontFamily="monospace"
            letterSpacing="0.1em"
            fill="var(--muted)"
          >
            FAVORITE
          </text>
        </g>

        {/* Markers */}
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
                <circle
                  cx={x}
                  cy={y}
                  r={c.fav ? 7 : 4}
                  fill="var(--accent)"
                  stroke="var(--surface)"
                  strokeWidth={0.8}
                />
                {c.fav && (
                  <circle cx={x} cy={y} r={2.5} fill="var(--surface)" />
                )}
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
          VISITED
        </span>
        <span className="flex items-center gap-2">
          <span className="relative inline-block h-3 w-3 rounded-full bg-[var(--accent)]">
            <span className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-[var(--surface)]" />
          </span>
          FAVORITE · CALLOUT
        </span>
        {hover && (
          <span className="ml-auto font-mono uppercase tracking-widest text-[var(--foreground)]">
            {hover}
          </span>
        )}
      </div>
    </div>
  );
}
