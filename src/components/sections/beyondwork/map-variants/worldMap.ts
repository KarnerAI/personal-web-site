// Shared world-map geometry for the map variants.
// Uses TopoJSON country shapes from `world-atlas` + d3-geo Mercator projection.
// All variants share a 800x400 viewBox so markers project to the same coords.

import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import countriesTopo from "world-atlas/countries-110m.json";

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 400;

type CountryProps = { name: string };

// Build GeoJSON once at module load (pure data, not server/client-specific).
const topology = countriesTopo as unknown as Parameters<typeof feature>[0];
const countriesObject = (topology as unknown as { objects: { countries: unknown } }).objects.countries as Parameters<typeof feature>[1];
const countriesFC = feature(topology, countriesObject) as unknown as FeatureCollection<
  Geometry,
  CountryProps
>;

// Mercator clipped slightly north of Antarctica so the map doesn't have a huge
// blank southern strip. Scale + translate chosen to fit 800x400 neatly.
export const projection = geoMercator()
  .scale(125)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 1.55])
  .center([10, 20]);

export const pathGen = geoPath(projection);

export const countries = countriesFC.features;

// Round to 3 decimals so server (Node) and client (V8) render identical
// SVG attribute strings. d3-geo's Mercator uses trig that produces tiny
// FP drift across runtimes (e.g. 250.07955996176426 vs ...423), which
// React treats as a hydration mismatch. 0.001 SVG-pixel is sub-pixel
// on screen — invisible but eliminates the drift.
const roundCoord = (n: number) => Math.round(n * 1000) / 1000;

export function project(lng: number, lat: number): [number, number] {
  const p = projection([lng, lat]);
  if (!p) return [0, 0];
  return [roundCoord(p[0]), roundCoord(p[1])];
}
