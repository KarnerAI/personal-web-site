"use client";

// Variant F — Real interactive map (Leaflet + CartoDB "Voyager" tiles).
// Closest OSS match to the Google Maps reference: soft blue ocean, cream
// land, green terrain, thin road/border lines. Includes:
//   - Custom navy header strip with avatar + title + share/fullscreen icons
//   - 16 pin markers at country-level coordinates
//   - Colombia as the "favorite" — larger marker with white dot + popup
//   - Pan/zoom, keyboard controls, native Leaflet UX
//
// SSR-safe: this file is rendered client-only via next/dynamic in the page.

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countryCoords } from "./countryCoords";

// Build our own pin icons — keeps them independent of Leaflet's default
// PNG sprite which requires webpack asset config.
function buildPinIcon(options: { fav?: boolean }) {
  const size = options.fav ? 44 : 34;
  const accent = "#E63B1E";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="${size * 0.72}" height="${size}">
      <defs>
        <filter id="pinShadow" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
          <feOffset dx="0" dy="1" result="off" />
          <feComponentTransfer><feFuncA type="linear" slope="0.45" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M16 2 C 8 2, 2 8, 2 16 C 2 26, 16 42, 16 42 C 16 42, 30 26, 30 16 C 30 8, 24 2, 16 2 Z"
            fill="${accent}" stroke="#FFFFFF" stroke-width="2" filter="url(#pinShadow)" />
      <circle cx="16" cy="16" r="${options.fav ? 6 : 5}" fill="#FFFFFF" />
      ${options.fav ? `<circle cx="16" cy="16" r="3" fill="${accent}" />` : ""}
    </svg>
  `;
  return L.divIcon({
    className: "travel-map-pin",
    html: svg,
    iconSize: [size * 0.72, size],
    iconAnchor: [size * 0.36, size - 2],
    popupAnchor: [0, -size + 6],
  });
}

export function TravelMapLeaflet() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pinIcon = useMemo(() => buildPinIcon({ fav: false }), []);
  const favIcon = useMemo(() => buildPinIcon({ fav: true }), []);

  const center: [number, number] = [20, 0];
  // Lock to a single world copy so tile labels don't duplicate across wraps
  const maxBounds: [[number, number], [number, number]] = [
    [-85, -180],
    [85, 180],
  ];

  function onFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
    >
      {/* Header strip — matches the Google Maps reference */}
      <div className="flex items-center gap-3 bg-[#3F5672] px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20 text-sm font-semibold">
          HA
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold leading-tight">Travel Map</div>
          <div className="text-[11px] opacity-80 leading-tight">Hussain Alam</div>
        </div>
        <button
          type="button"
          aria-label="Share"
          className="rounded p-1.5 hover:bg-white/10"
          onClick={() => {
            if (navigator.share) navigator.share({ title: "Travel Map", url: window.location.href }).catch(() => {});
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Fullscreen"
          onClick={onFullscreen}
          className="rounded p-1.5 hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 4 20 10 20" />
            <polyline points="20 10 20 4 14 4" />
            <line x1="4" y1="20" x2="10" y2="14" />
            <line x1="20" y1="4" x2="14" y2="10" />
          </svg>
        </button>
      </div>

      {/* Map body */}
      <div className="h-[520px] w-full">
        {mounted && (
          <MapContainer
            center={center}
            zoom={2}
            minZoom={2}
            maxZoom={10}
            maxBounds={maxBounds}
            maxBoundsViscosity={1}
            scrollWheelZoom={false}
            zoomControl={false}
            className="h-full w-full"
            style={{ background: "#B8D8E8" }}
          >
            {/* CartoDB Voyager — the closest open tile set to Google Maps styling */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{y}/{x}.png"
              noWrap
            />
            <ZoomControl position="bottomleft" />

            {countryCoords.map((c) => (
              <Marker
                key={c.code}
                position={[c.lat, c.lng]}
                icon={c.fav ? favIcon : pinIcon}
              >
                <Popup>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#0F1E3D" }}>
                    {c.name}
                    {c.fav && (
                      <span style={{ color: "#E63B1E", marginLeft: 6 }}>★ favorite</span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        {!mounted && (
          <div className="flex h-full w-full items-center justify-center bg-[#B8D8E8] text-sm text-[var(--muted)]">
            Loading map…
          </div>
        )}
      </div>
    </div>
  );
}
