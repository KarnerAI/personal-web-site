// Beyond Work (theme B, DESIGN.md; v9 mockup): the hobby mosaic. Travel is one
// of its tiles now (it replaced the v7 map-and-stats row, whose components stay
// in beyondwork/map-variants).
// Server component: the Travel dialog's pins are projected here so the world
// atlas never ships to the browser; the mosaic and dialog run in the browser.
// Reading & Listening is deferred (see notes/reading-page-v2.md); `books` and
// `podcasts` stay exported from the data module for a future /reading page.

import { countryCoords } from "./beyondwork/map-variants/countryCoords";
import { project } from "./beyondwork/map-variants/worldMap";
import type { MapPin } from "./beyondwork/map-variants/TravelMapThemeBPins";
import { HobbyMosaic } from "./beyondwork/HobbyMosaic";

const pins: MapPin[] = countryCoords.map((c) => {
  const [x, y] = project(c.lng, c.lat);
  return { name: c.name, x, y, fav: Boolean(c.fav) };
});

export function BeyondWork() {
  return (
    <section id="beyond-work" aria-labelledby="bw-h" className="theme-b relative py-[72px] max-md:py-14">
      <div className="wrap">
        <p className="chip">Beyond Work</p>
        <h2 id="bw-h" className="type-heading m-0 mb-12 text-ink">
          Outside of work.
        </h2>

        <div className="chiprow">
          <p className="chip">Hobbies</p>
        </div>
        <HobbyMosaic mapPins={pins} />
      </div>
    </section>
  );
}
