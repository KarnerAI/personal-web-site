// Beyond Work — Option B · "Magazine spread with featured travel map"
// Ported from public/beyondwork-comparison.html (#b).
// Featured travel map + stats band above; hobbies + reading/listening below in two columns.
// Server component shell that embeds the client TravelMap.

import { books, hobbies, podcasts, travel } from "@/data/beyondWork";
import { TravelMapGeo as TravelMap } from "./beyondwork/map-variants/TravelMapGeo";

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

        {/* Hobbies + Reading/Listening */}
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-start">
          <div>
            <p className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-5 pb-3 border-b border-[var(--border)]">
              Hobbies
            </p>
            <div className="grid grid-cols-2 gap-3">
              {hobbies.map((h) => (
                <div
                  key={h.label}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <div className="text-2xl leading-none mb-3">{h.emoji}</div>
                  <div className="font-medium text-sm">{h.label}</div>
                  {h.note && (
                    <div className="text-xs font-mono text-muted mt-1">{h.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-5 pb-3 border-b border-[var(--border)]">
              Reading &amp; listening
            </p>
            <h4 className="text-lg font-semibold tracking-tight mb-2">On the shelf</h4>
            <ul className="list-disc pl-5 text-sm text-muted leading-[1.8] mb-6">
              {books.map((b) => (
                <li key={b.title}>
                  <span className="text-[var(--foreground)] font-medium">{b.title}</span>
                  {b.author ? ` — ${b.author}` : ""}
                  {b.why ? `. ${b.why}` : ""}
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold tracking-tight mb-2">In rotation</h4>
            <ul className="list-disc pl-5 text-sm text-muted leading-[1.8]">
              {podcasts.map((p) => (
                <li key={p.name}>
                  <span className="text-[var(--foreground)] font-medium">{p.name}</span>
                  {p.host ? ` — ${p.host}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
