"use client";

// Hobby mosaic + story dialog (theme B, DESIGN.md; v7 mockup, v8 for media,
// v9 for the card layout). Four columns with the first hobby as the 2×2 lead
// tile (2 columns on tablets, 1 on phones). Each tile is a picture over a solid
// caption. The picture is the hobby's real photo when `hero` is set (plus a
// muted loop on mouse hover when it has a `video`), drawn art for
// `illustration`, the travel map for `map`, and otherwise an honest
// "Photo · {hobby}" placeholder wash, per DESIGN.md.
import { useEffect, useRef, useState, type RefObject } from "react";
import { useImageFallback } from "../useImageFallback";
import * as Dialog from "@radix-ui/react-dialog";
import { hobbies } from "@/data/beyondWork";
import type { Hobby } from "@/types";
import { TravelMapThemeBPins, type MapPin } from "./map-variants/TravelMapThemeBPins";
import { MAP_HEIGHT, MAP_WIDTH } from "./map-variants/mapSize";

function PhotoIcon() {
  return (
    <svg className="ph-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="M4 17.5l5.5-4.8 3.8 3.2 2.6-2.2 4.1 3.8" />
    </svg>
  );
}

// Drawn tile art for hobbies without a photo; it moves a little on hover.
const ILLUSTRATIONS = {
  belt: (
    <svg className="ill ill-belt" viewBox="0 0 120 120">
      <path d="M6 52Q60 40 114 52v13Q60 53 6 65z" fill="#6B4FA0" />
      <g className="sw sw-l">
        <path d="M54 64L40 104l11 3 11-41z" fill="#5A4189" />
      </g>
      <g className="sw sw-r">
        <path d="M64 64l16 39-11 4-12-41z" fill="#6B4FA0" />
        <path d="M73.5 89l-10.4 4.2 2.6 6.4 10.4-4.2z" fill="#1A1A1A" />
      </g>
      <rect x="47" y="42" width="26" height="26" rx="5" fill="#5A4189" />
      <path d="M52 50h16M52 60h16" stroke="#7E63B3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  pair: (
    <svg
      className="ill ill-pair"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <circle cx="46" cy="38" r="12" />
        <path d="M24 94c0-16 10-28 22-28s22 12 22 28" />
      </g>
      <g className="small">
        <circle cx="80" cy="56" r="9" />
        <path d="M64 94c0-12 7-21 16-21s16 9 16 21" />
      </g>
      <path d="M62 76c6-4 10-5 14-4" />
    </svg>
  ),
};

// The travel map's land (white, visited countries in peach), as a cached image.
function TravelLand({ alt = "" }: { alt?: string }) {
  const { failed, imgProps } = useImageFallback();
  // If the map file fails, keep its description for screen readers.
  if (failed) return alt ? <span className="sr-only">{alt}</span> : null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/world-travel.svg"
      alt={alt}
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
      loading="lazy"
      decoding="async"
      {...imgProps}
    />
  );
}

function travelAlt(pins: MapPin[]): string {
  const fav = pins.find((p) => p.fav);
  return `World map with ${pins.length} visited countries filled in.${fav ? ` ${fav.name}, the favorite, is ringed.` : ""}`;
}

// Plays the tile's loop while a real mouse moves over it (never touch, pen or
// reduced motion), from the still frame's moment; the still stays otherwise.
function useHoverVideo(tile: RefObject<HTMLButtonElement | null>, video: RefObject<HTMLVideoElement | null>, start = 0) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const t = tile.current;
    const v = video.current;
    if (!t || !v || !window.matchMedia) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = false;
    let requested = false;
    const go = () => {
      if (!hovered) return;
      v.currentTime = start;
      v.play()?.catch(() => {});
    };
    const onPlaying = () => hovered && setPlaying(true);
    // A real move, not pointerenter: scrolling under a still cursor sends
    // pointer events with no movement.
    const onMove = (e: PointerEvent) => {
      if (hovered || e.pointerType !== "mouse" || !fine.matches || calm.matches) return;
      if (!e.movementX && !e.movementY) return;
      hovered = true;
      if (v.readyState >= 1) go();
      else if (!requested) {
        // Load once: hovering again before metadata arrives must not restart it.
        requested = true;
        v.addEventListener("loadedmetadata", go, { once: true });
        v.preload = "auto";
        v.load();
      }
    };
    const onLeave = () => {
      hovered = false;
      setPlaying(false);
      v.pause();
    };
    v.addEventListener("playing", onPlaying);
    t.addEventListener("pointermove", onMove);
    t.addEventListener("pointerleave", onLeave);
    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("loadedmetadata", go);
      t.removeEventListener("pointermove", onMove);
      t.removeEventListener("pointerleave", onLeave);
    };
  }, [tile, video, start]);
  return playing;
}

// Focal point for a hero without its own `position` (faces sit high).
const DEFAULT_HERO_POSITION = "50% 25%";

// The tile's photo is decorative (the button already names the hobby); the story
// dialog's photo is `described`, so it carries the data's alt text.
function HobbyPhoto({
  hobby: h,
  described = false,
  videoRef,
}: {
  hobby: Hobby;
  described?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
}) {
  const { failed, imgProps } = useImageFallback();
  if (h.map) {
    return (
      <span aria-hidden className="ph ph-travel">
        <span className="map">
          <TravelLand />
        </span>
      </span>
    );
  }
  if (h.illustration && !described) {
    return (
      <span aria-hidden className={`ph ph-${h.slug}`}>
        {ILLUSTRATIONS[h.illustration]}
      </span>
    );
  }
  if (h.hero && !failed) {
    return (
      <span aria-hidden={described ? undefined : true} className={`ph ph-${h.slug}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={h.hero.src}
          alt={described ? h.hero.alt : ""}
          loading="lazy"
          decoding="async"
          {...imgProps}
          style={{ objectPosition: h.hero.position ?? DEFAULT_HERO_POSITION }}
        />
        {h.video && videoRef && (
          <video
            ref={videoRef}
            className="ph-vid"
            src={h.video.src}
            muted
            loop
            playsInline
            preload="none"
            style={{ objectPosition: h.hero.position ?? DEFAULT_HERO_POSITION }}
          />
        )}
      </span>
    );
  }
  return (
    <span aria-hidden className={`ph ph-wash ph-${h.slug}`}>
      <span className="ph-l">Photo · {h.label}</span>
      <PhotoIcon />
    </span>
  );
}

function HobbyDialog({
  index,
  onClose,
  returnFocus,
  mapPins,
}: {
  index: number | null;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
  mapPins: MapPin[];
}) {
  const h = index !== null ? hobbies[index] : null;
  return (
    <Dialog.Root open={h !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="b-scrim" />
        {h && index !== null && (
          <Dialog.Content
            className="theme-b b-sheet"
            onCloseAutoFocus={(e) => {
              // The tiles open the dialog themselves, so hand focus back to the one clicked.
              e.preventDefault();
              returnFocus.current?.focus();
            }}
          >
            <Dialog.Close className="close-x x-float" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
            {h.map ? (
              <div className="hm-ph hm-map map">
                <TravelLand alt={travelAlt(mapPins)} />
                <TravelMapThemeBPins pins={mapPins} width={MAP_WIDTH} height={MAP_HEIGHT} />
                {/* The pins name countries on hover only; list them for everyone else. */}
                <ul className="sr-only">
                  {mapPins.map((p) => (
                    <li key={p.name}>{p.fav ? `${p.name} (favorite)` : p.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="hm-ph">
                <HobbyPhoto hobby={h} described />
              </div>
            )}
            <div className="hm-body">
              <p className="kick">
                {String(index + 1).padStart(2, "0")} · {h.label}
              </p>
              <Dialog.Title asChild>
                <h2>{h.label}</h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <p className="hm-tag">{h.tagline}</p>
              </Dialog.Description>
              {h.meta && h.meta.length > 0 && (
                <dl className="meta" style={{ "--n": h.meta.length } as React.CSSProperties}>
                  {h.meta.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {h.chapters ? (
                <div className="chs">
                  {h.chapters.map((c, ci) => (
                    <section key={c.org} className="ch" aria-labelledby={`hm-ch-${ci}`}>
                      <div className="ch-ph">
                        <span aria-hidden className={`ph ph-wash ph-${h.slug}`}>
                          <span className="ph-l">Photo coming · {c.org}</span>
                          <PhotoIcon />
                        </span>
                      </div>
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="ch-logo" src={c.logoSrc} alt="" />
                        <h3 className="kick" id={`hm-ch-${ci}`}>
                          {c.kicker}
                        </h3>
                        <p>{c.text}</p>
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="story">
                  {h.story.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}
              {h.embed && (
                <figure className="embed">
                  <div className="fr" style={{ aspectRatio: h.embed.aspectRatio ?? "4 / 3" }}>
                    <iframe
                      src={h.embed.src}
                      title={h.embed.title}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  {h.embed.caption && <figcaption>{h.embed.caption}</figcaption>}
                </figure>
              )}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function HobbyTile({
  hobby: h,
  lead,
  onOpen,
}: {
  hobby: Hobby;
  lead: boolean;
  onOpen: (el: HTMLButtonElement) => void;
}) {
  const tile = useRef<HTMLButtonElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const playing = useHoverVideo(tile, video, h.video?.start);
  return (
    <button
      ref={tile}
      type="button"
      className={["ht", lead && "lead", playing && "is-playing"].filter(Boolean).join(" ")}
      aria-haspopup="dialog"
      onClick={(e) => onOpen(e.currentTarget)}
    >
      <HobbyPhoto hobby={h} videoRef={video} />
      <span aria-hidden className="plus">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="ht-tx">
        <span className="ht-l">{h.label}</span>
        <span className="ht-s">{h.tileTagline ?? h.tagline}</span>
      </span>
    </button>
  );
}

// `mapPins` are projected on the server (BeyondWork) so the world atlas never
// ships to the browser; the Travel dialog draws them over the map.
export function HobbyMosaic({ mapPins = [] }: { mapPins?: MapPin[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <div className="mosaic">
        {hobbies.map((h, i) => (
          <HobbyTile
            key={h.slug}
            hobby={h}
            lead={i === 0}
            onOpen={(el) => {
              trigger.current = el;
              setOpen(i);
            }}
          />
        ))}
      </div>
      <HobbyDialog index={open} onClose={() => setOpen(null)} returnFocus={trigger} mapPins={mapPins} />
    </>
  );
}
