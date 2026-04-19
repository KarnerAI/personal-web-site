"use client";

// Variant E — Modern Cartography (Google Maps palette).
// Light blue water + cream/beige land with soft green park tones.
// Vermillion pins carry over from Tokyo Transit palette — they pop
// beautifully against the cool blue ocean. Colombia gets a bigger pin
// with a white inner dot (Google-Maps-style "selected" look).

import { useState } from "react";
import { countryCoords } from "./countryCoords";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  countries,
  pathGen,
  project,
} from "./worldMap";

const WATER = "#B8D8E8";          // soft cartographic blue
const WATER_SHADE = "#A9CDE0";     // slightly darker for subtle ocean shading
const LAND = "#F4EEDC";            // cream/beige continents
const LAND_SHADE = "#E8DFC3";      // subtle shadow on land
const BORDER = "#C9B98A";          // muted tan country border
const GREEN_TINT = "#CFDDB0";      // faint park/forest accent

export function TravelMapGeo() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[var(--border)]"
      style={{ background: WATER }}
    >
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="World map with 16 visited countries pinned"
      >
        <defs>
          {/* Subtle ocean gradient — darker at poles, lighter near equator */}
          <linearGradient id="ocean-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={WATER_SHADE} />
            <stop offset="50%" stopColor={WATER} />
            <stop offset="100%" stopColor={WATER_SHADE} />
          </linearGradient>

          {/* Latitude lines — very subtle */}
          <pattern id="lat-lines" x="0" y="0" width={MAP_WIDTH} height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2={MAP_WIDTH} y2="50" stroke="#9BC0D4" strokeWidth="0.3" opacity="0.5" />
          </pattern>

          {/* Drop shadow for pins */}
          <filter id="pin-drop" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0" dy="1.2" result="off" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean base */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-grad)" />
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#lat-lines)" />

        {/* Countries — filled cream with tan border */}
        <g>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={`land-${i}`}
                d={d}
                fill={LAND}
                stroke={BORDER}
                strokeWidth={0.4}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Faint "vegetation" overlay — clip green tint to every other country
            for a subtle park/terrain variation without tagging real biomes. */}
        <g opacity={0.35}>
          {countries.map((c, i) => {
            if (i % 3 !== 0) return null;
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={`green-${i}`}
                d={d}
                fill={GREEN_TINT}
                stroke="none"
              />
            );
          })}
        </g>

        {/* Subtle land inner shadow for dimensionality */}
        <g opacity={0.4}>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={`shade-${i}`}
                d={d}
                fill="none"
                stroke={LAND_SHADE}
                strokeWidth={1.2}
                strokeLinejoin="round"
                transform="translate(0, 0.6)"
                opacity={0.5}
              />
            );
          })}
        </g>

        {/* Pins — Google-Maps-style red markers */}
        <g>
          {countryCoords.map((c) => {
            const [x, y] = project(c.lng, c.lat);
            const isFav = !!c.fav;
            return (
              <g
                key={c.code}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover((h) => (h === c.name ? null : h))}
                className="cursor-pointer"
                filter="url(#pin-drop)"
              >
                {/* Outer halo for favorite */}
                {isFav && (
                  <circle cx={x} cy={y} r={13} fill="var(--accent)" opacity={0.18} />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isFav ? 8 : 5.5}
                  fill="var(--accent)"
                  stroke="#FFFFFF"
                  strokeWidth={isFav ? 1.6 : 1.2}
                />
                {isFav && <circle cx={x} cy={y} r={2.5} fill="#FFFFFF" />}
                <title>{c.name}</title>
              </g>
            );
          })}
        </g>

      </svg>

      {/* Legend — sits on the map like a Google Maps attribution chip */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--foreground)] shadow-sm backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)] ring-1 ring-white" />
          Visited
        </span>
        {hover && (
          <span className="ml-2 border-l border-[var(--border)] pl-3 text-[var(--muted)]">
            {hover}
          </span>
        )}
      </div>
    </div>
  );
}
