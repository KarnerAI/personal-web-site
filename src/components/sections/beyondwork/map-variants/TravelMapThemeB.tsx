// Travel map, theme B (DESIGN.md; v7 mockup): pale gray countries on a faint
// blue grid, visited countries tinted blue, blue pins with a soft sky glow,
// and the favorite (Colombia) ringed. Server component: pin positions are
// computed here so the world atlas never ships to the browser. The land is a
// separate cached file, /world-land.svg (themeBLand.ts), drawn as an image;
// the interactive pins + legend are a small client layer on top.
import { travel } from "@/data/beyondWork";
import { countryCoords } from "./countryCoords";
import { MAP_HEIGHT, MAP_WIDTH, project } from "./worldMap";
import { TravelMapThemeBLand } from "./TravelMapThemeBLand";
import { TravelMapThemeBPins, type MapPin } from "./TravelMapThemeBPins";

const pins: MapPin[] = countryCoords.map((c) => {
  const [x, y] = project(c.lng, c.lat);
  return { name: c.name, x, y, fav: Boolean(c.fav) };
});

export function TravelMapThemeB() {
  const favorite = countryCoords.find((c) => c.fav)?.name;
  return (
    <div className="map">
      <TravelMapThemeBLand
        alt={`World map with ${travel.countryCount} visited countries marked.${favorite ? ` ${favorite}, the favorite, is ringed.` : ""}`}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
      />
      <TravelMapThemeBPins pins={pins} width={MAP_WIDTH} height={MAP_HEIGHT} />
    </div>
  );
}
