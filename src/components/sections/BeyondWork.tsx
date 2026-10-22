// Beyond Work (theme B, DESIGN.md; v7 mockup).
// Travel map on the left; the travel quote, two stat cards (countries,
// cities) and three fact rows on the right; then the hobby mosaic.
// Server component: pin positions are computed here. The map's land loads
// as the cached /world-land.svg image (with a fallback), and the pins and the
// hobby mosaic/dialog run in the browser.
// Reading & Listening is deferred (see notes/reading-page-v2.md); `books` and
// `podcasts` stay exported from the data module for a future /reading page.

import { travel } from "@/data/beyondWork";
import { TravelMapThemeB } from "./beyondwork/map-variants/TravelMapThemeB";
import { HobbyMosaic } from "./beyondwork/HobbyMosaic";

const FACT_ICONS = {
  pin: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  home: <path d="M4 10.5L12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" />,
  plane: <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />,
};

export function BeyondWork() {
  const facts = [
    { icon: FACT_ICONS.pin, k: "Favorite city to visit", v: travel.favoriteCity },
    { icon: FACT_ICONS.home, k: "Current base", v: travel.base },
    { icon: FACT_ICONS.plane, k: "Next up", v: travel.nextUp },
  ].filter((f) => f.v);

  return (
    <section id="beyond-work" aria-labelledby="bw-h" className="theme-b relative py-[112px] max-md:py-20">
      <div className="wrap">
        <p className="chip">Beyond Work</p>
        <h2 id="bw-h" className="type-heading m-0 mb-12 text-ink">
          Get to know me outside of work.
        </h2>

        <div className="bw-row">
          <TravelMapThemeB />
          <div className="aside">
            <blockquote className="aq bar-quote">
              {travel.caption}
              {travel.captionCite && <cite>{travel.captionCite}</cite>}
            </blockquote>
            <h3 className="stats">
              <span className="stat">
                <b>{travel.countryCount}</b> <span>countries</span>
              </span>
              {travel.cityCount != null && (
                <>
                  <span className="sr-only"> and </span>
                  <span className="stat">
                    <b>{travel.cityCount}</b> <span>cities explored.</span>
                  </span>
                </>
              )}
            </h3>
            <ul className="facts">
              {facts.map((f) => (
                <li key={f.k}>
                  <span aria-hidden className="fi">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      {f.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="k">{f.k}</span> <span className="v">· {f.v}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chiprow">
          <p className="chip">Hobbies</p>
        </div>
        <HobbyMosaic />
      </div>
    </section>
  );
}
