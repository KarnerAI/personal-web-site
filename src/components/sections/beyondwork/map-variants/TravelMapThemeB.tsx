// Travel map, theme B (DESIGN.md; v7 mockup): pale gray countries on a faint
// blue grid, visited countries tinted blue, blue pins with a soft sky glow,
// and the favorite (Colombia) ringed. Server component: the land outlines and
// pin positions are computed here so the world atlas never ships to the
// browser; the interactive pins + legend are a small client layer on top.
import { travel } from "@/data/beyondWork";
import { countryCoords } from "./countryCoords";
import { MAP_HEIGHT, MAP_WIDTH, countries, pathGen, project } from "./worldMap";
import { TravelMapThemeBPins, type MapPin } from "./TravelMapThemeBPins";

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

const visitedIds = new Set(travel.visitedCountryCodes.map((c) => NUMERIC[c]).filter(Boolean));

// Antarctica (010) is dropped, as in v7. A few shapes (N. Cyprus, Somaliland,
// Kosovo) have no id, so keys use the array position.
const land = countries
  .filter((f) => String(f.id) !== "010")
  .map((f, i) => ({ key: `${f.id ?? "x"}-${i}`, d: pathGen(f) ?? "", visited: visitedIds.has(String(f.id)) }))
  .filter((l) => l.d);

const pins: MapPin[] = countryCoords.map((c) => {
  const [x, y] = project(c.lng, c.lat);
  return { name: c.name, x, y, fav: Boolean(c.fav) };
});

export function TravelMapThemeB() {
  const favorite = countryCoords.find((c) => c.fav)?.name;
  return (
    <div className="map">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`World map with ${travel.countryCount} visited countries marked.${favorite ? ` ${favorite}, the favorite, is ringed.` : ""}`}
      >
        {land.map((l) => (
          <path key={l.key} d={l.d} className={l.visited ? "land v" : "land"} />
        ))}
      </svg>
      <TravelMapThemeBPins pins={pins} width={MAP_WIDTH} height={MAP_HEIGHT} />
    </div>
  );
}
