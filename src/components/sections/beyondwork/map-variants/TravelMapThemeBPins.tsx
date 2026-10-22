"use client";

// Interactive layer for TravelMapThemeB: pins drawn in an SVG overlay that
// shares the map's viewBox (so positions line up exactly), plus the legend,
// whose last slot names the pin under the pointer.
import { useState } from "react";

export type MapPin = { name: string; x: number; y: number; fav: boolean };

export function TravelMapThemeBPins({
  pins,
  width,
  height,
}: {
  pins: MapPin[];
  width: number;
  height: number;
}) {
  const [hovered, setHovered] = useState("");

  return (
    <>
      <svg
        className="pins"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="pin-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        {pins.map((p) => (
          <g
            key={p.name}
            className="pn"
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered((h) => (h === p.name ? "" : h))}
          >
            <circle cx={p.x} cy={p.y} r={p.fav ? 13 : 9} className="glow" filter="url(#pin-blur)" />
            {p.fav && (
              <>
                <circle cx={p.x} cy={p.y} r={11} className="halo pulse" />
                <circle cx={p.x} cy={p.y} r={11} className="ring" />
              </>
            )}
            <circle cx={p.x} cy={p.y} r={p.fav ? 5.5 : 4.5} className="dt" />
            <title>{p.fav ? `${p.name} (favorite)` : p.name}</title>
          </g>
        ))}
      </svg>
      <div className="legend">
        <span>
          <i aria-hidden className="lgd" />
          Visited
        </span>
        <span>
          <i aria-hidden className="lgr" />
          Favorite
        </span>
        <span className="hov" aria-live="polite">
          {hovered}
        </span>
      </div>
    </>
  );
}
