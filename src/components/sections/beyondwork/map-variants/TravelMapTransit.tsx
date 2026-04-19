"use client";

// Variant B — Transit-Map World.
// Flat solid navy country silhouettes (no per-country borders), vermillion
// station dots connected by subway-style arcs. Colombia is the "terminus"
// with a larger ringed station marker.

import { useState } from "react";
import { countryCoords } from "./countryCoords";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  countries,
  pathGen,
  project,
} from "./worldMap";

// Route order — approximates a narrative path through visits.
// (West-to-east-ish, grouping nearby cities so arcs don't crisscross.)
const ROUTE_ORDER = [
  "CA", "US", "MX", "CO", "BR",
  "GB", "NL", "DE", "FR", "ES", "IT",
  "AE", "IN", "BD", "TH", "JP",
];

export function TravelMapTransit() {
  const [hover, setHover] = useState<string | null>(null);

  const byCode = new Map(countryCoords.map((c) => [c.code, c]));
  const routePoints = ROUTE_ORDER.map((code) => byCode.get(code)!).filter(Boolean);

  return (
    <div className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="Transit-style travel map"
      >
        {/* Flat navy country silhouettes */}
        <g>
          {countries.map((c, i) => {
            const d = pathGen(c);
            if (!d) return null;
            return (
              <path
                key={i}
                d={d}
                fill="var(--foreground)"
                stroke="none"
              />
            );
          })}
        </g>

        {/* Subway route: thin vermillion line through the points */}
        <g>
          {routePoints.map((c, i) => {
            if (i === 0) return null;
            const prev = routePoints[i - 1];
            const [x1, y1] = project(prev.lng, prev.lat);
            const [x2, y2] = project(c.lng, c.lat);
            // Curved arc — perpendicular midpoint offset
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len;
            const ny = dx / len;
            const bulge = Math.min(len * 0.12, 25);
            const cx = mx + nx * bulge;
            const cy = my + ny * bulge;
            return (
              <path
                key={`r-${i}`}
                d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.85}
              />
            );
          })}
        </g>

        {/* Station dots */}
        <g>
          {countryCoords.map((c) => {
            const [x, y] = project(c.lng, c.lat);
            if (c.fav) {
              // Terminus: larger station with white inner circle
              return (
                <g
                  key={c.code}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover((h) => (h === c.name ? null : h))}
                  className="cursor-pointer"
                >
                  <circle cx={x} cy={y} r={9} fill="var(--accent)" />
                  <circle cx={x} cy={y} r={4.5} fill="var(--surface)" />
                  <title>{c.name}</title>
                </g>
              );
            }
            return (
              <g
                key={c.code}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover((h) => (h === c.name ? null : h))}
                className="cursor-pointer"
              >
                <circle cx={x} cy={y} r={5.5} fill="var(--accent)" />
                <circle cx={x} cy={y} r={2.2} fill="var(--surface)" />
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
          Station
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] ring-2 ring-inset ring-[var(--surface)]" />
          Terminus · Colombia
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
