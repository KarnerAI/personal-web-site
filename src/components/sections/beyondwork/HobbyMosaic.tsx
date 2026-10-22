"use client";

// Hobby mosaic + story dialog (theme B, DESIGN.md; v7 mockup).
// Four columns with the first hobby as the 2×2 lead tile (2 columns on tablets,
// 1 on phones). A tile shows the hobby's real photo when `hero` is set;
// otherwise an honest "Photo · {hobby}" placeholder wash, per DESIGN.md.
import { useRef, useState, type RefObject } from "react";
import { useImageFallback } from "../useImageFallback";
import * as Dialog from "@radix-ui/react-dialog";
import { hobbies } from "@/data/beyondWork";
import type { Hobby } from "@/types";

function PhotoIcon() {
  return (
    <svg className="ph-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="M4 17.5l5.5-4.8 3.8 3.2 2.6-2.2 4.1 3.8" />
    </svg>
  );
}

function HobbyPhoto({ hobby: h }: { hobby: Hobby }) {
  const { failed, imgProps } = useImageFallback();
  if (h.hero && !failed) {
    return (
      <span aria-hidden className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={h.hero.src}
          alt=""
          loading="lazy"
          decoding="async"
          {...imgProps}
          style={{ objectPosition: h.hero.position ?? "50% 25%" }}
        />
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
}: {
  index: number | null;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
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
            <div className="hm-ph">
              <HobbyPhoto hobby={h} />
            </div>
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
              <div className="story">
                {h.story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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

export function HobbyMosaic() {
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <div className="mosaic">
        {hobbies.map((h, i) => (
          <button
            key={h.slug}
            type="button"
            className={i === 0 ? "ht lead" : "ht"}
            aria-haspopup="dialog"
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setOpen(i);
            }}
          >
            <HobbyPhoto hobby={h} />
            <span aria-hidden className="plus">
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="ht-tx">
              <span className="ht-l">{h.label}</span>
              <span className="ht-s">{h.tagline}</span>
            </span>
          </button>
        ))}
      </div>
      <HobbyDialog index={open} onClose={() => setOpen(null)} returnFocus={trigger} />
    </>
  );
}
