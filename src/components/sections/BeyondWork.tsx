// Beyond Work — Magazine spread with featured travel map + H-A Magazine Mosaic hobbies.
// Featured travel map + stats band above; full-width 5-tile hobby mosaic below.
// Reading & Listening is deferred (see notes/reading-page-v2.md) — removed for MVP.
// `books` and `podcasts` remain exported from the data module for the future /reading page.
// Server component shell that embeds the client TravelMap + client HobbyTile(s).

import { hobbies, travel } from "@/data/beyondWork";
import { TravelMapGeo as TravelMap } from "./beyondwork/map-variants/TravelMapGeo";
import { HobbyTile } from "./beyondwork/HobbyTile";

export function BeyondWork() {
  return (
    <section id="beyond-work" className="section">
      <div className="content-width">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
          Beyond Work
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12">
          Get to know me outside of work.
        </h2>

        {/* Featured travel map */}
        <div className="grid gap-10 md:grid-cols-[1fr_380px] items-start mb-16">
          <TravelMap />
          <div>
            <blockquote className="border-l-2 border-[var(--accent)] pl-4 text-base italic text-[var(--foreground)] mb-5 max-w-[340px]">
              {travel.caption}
            </blockquote>
            <h3 className="text-2xl md:text-3xl font-semibold leading-[1.15] tracking-tight mb-6">
              <span className="text-[var(--accent)]">{travel.countryCount}</span> countries
              {typeof travel.cityCount === "number" && (
                <>
                  {" "}and{" "}
                  <span className="text-[var(--accent)]">{travel.cityCount}</span> cities
                </>
              )}{" "}
              explored.
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
                <span className="text-lg leading-none">
                  {travel.favoriteCityFlag ?? "🏙️"}
                </span>
                <span className="text-sm">
                  <span className="font-medium text-[var(--foreground)]">Favorite city to visit</span>{" "}
                  <span className="text-muted">· {travel.favoriteCity ?? "—"}</span>
                </span>
              </li>
              {travel.base && (
                <li className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
                  <span className="text-lg leading-none">🗽</span>
                  <span className="text-sm">
                    <span className="font-medium text-[var(--foreground)]">Current base</span>{" "}
                    <span className="text-muted">· {travel.base}</span>
                  </span>
                </li>
              )}
              {travel.nextUp && (
                <li className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
                  <span className="text-lg leading-none">✈️</span>
                  <span className="text-sm">
                    <span className="font-medium text-[var(--foreground)]">Next up</span>{" "}
                    <span className="text-muted">· {travel.nextUp}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Hobbies — H-A Magazine Mosaic (5 tiles) */}
        <div>
          <p className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-5 pb-3 border-b border-[var(--border)]">
            Hobbies
          </p>
          {/* Mobile: 1-col stack. Tablet (sm): 2-col (hero spans full width).
              Desktop (md): 4-col (hero spans 2×2, 4 smalls fill cols 3-4).
              Row height is driven by `auto-rows` explicitly — NOT `grid-rows-2`.
              Tailwind's `grid-rows-2` sets 1fr rows which collapse to 0 here
              because the tiles are absolutely-positioned inside and contribute
              no intrinsic height. `auto-rows-[Npx]` applies to every row (there
              are no explicit rows defined), so both the implicit rows get the
              fixed height we want. */}
          <div className="grid grid-cols-1 gap-4 auto-rows-[260px] sm:grid-cols-2 sm:auto-rows-[240px] md:grid-cols-4 md:auto-rows-[280px]">
            {hobbies.map((hobby, i) => (
              <HobbyTile
                key={hobby.slug}
                hobby={hobby}
                index={i}
                isHero={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
