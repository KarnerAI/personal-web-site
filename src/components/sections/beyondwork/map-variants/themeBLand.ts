// The theme B travel map's land layer as one standalone SVG file: pale gray
// countries with white borders, visited countries tinted blue (v7 colors).
// Served at /world-land.svg (src/app/world-land.svg/route.ts) and shown as an
// <img> under the interactive pins, so about 150 KB of country outlines stay
// out of the page HTML and out of React's payload, which would otherwise carry
// a second copy of every server-rendered path.
import { geoPath } from "d3-geo";
import { travel } from "@/data/beyondWork";
import { MAP_HEIGHT, MAP_WIDTH, countries, projection } from "./worldMap";

// world-atlas feature ids are ISO 3166 numeric codes.
const NUMERIC: Record<string, string> = {
  US: "840",
  CA: "124",
  MX: "484",
  CO: "170",
  BR: "076",
  GB: "826",
  FR: "250",
  ES: "724",
  IT: "380",
  NL: "528",
  DE: "276",
  BD: "050",
  IN: "356",
  JP: "392",
  TH: "764",
  AE: "784",
};

// One decimal is a tenth of a pixel on the 800-wide map: invisible, and a
// much smaller file than d3's default of three.
const path = geoPath(projection).digits(1);

export function worldLandSvg(): string {
  const visited = new Set(travel.visitedCountryCodes.map((c) => NUMERIC[c]).filter(Boolean));
  // Antarctica (010) is dropped, as in v7.
  const shapes = countries
    .filter((f) => String(f.id) !== "010")
    .map((f) => ({ d: path(f), visited: visited.has(String(f.id)) }))
    .filter((s) => s.d)
    .map((s) => `<path${s.visited ? ' class="v"' : ""} d="${s.d}"/>`)
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}">` +
    `<style>path{fill:#e2e6eb;stroke:#fff;stroke-width:.6;stroke-linejoin:round}.v{fill:#d2e5f2}</style>` +
    shapes +
    `</svg>`
  );
}
