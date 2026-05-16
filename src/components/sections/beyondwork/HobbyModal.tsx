"use client";

// HobbyModal — Radix Dialog content for one hobby tile's expanded story.
// The tile itself owns the Dialog.Root + Dialog.Trigger (see HobbyTile);
// this component is mounted inside Dialog.Portal and renders the overlay,
// panel, hero image, meta band, story, and optional gallery.
//
// Motion: slide-up + fade on mount, scoped to the Radix `data-state` hooks so
// `prefers-reduced-motion` can opt out cleanly via the globals.css rule.

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import type { Hobby } from "@/types";
import { HobbyPhoto } from "./HobbyPhoto";

type Props = {
  hobby: Hobby;
  index: number; // 0-based; rendered as "01 · Label" eyebrow
};

export function HobbyModal({ hobby, index }: Props) {
  const eyebrow = `${String(index + 1).padStart(2, "0")} · ${hobby.label}`;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-[rgba(15,30,61,0.72)] backdrop-blur-[4px] data-[state=open]:animate-fadeIn" />
      <Dialog.Content
        aria-describedby={undefined}
        className="fixed left-1/2 top-[clamp(2rem,6vh,6rem)] z-[101] w-[calc(100vw-3rem)] max-w-[720px] -translate-x-1/2 overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,0.4)] data-[state=open]:animate-slideUp focus:outline-none max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        {/* Close button */}
        <Dialog.Close
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--foreground)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Dialog.Close>

        {/* Hero image (or placeholder) */}
        <div className="relative h-[260px] w-full sm:h-[360px]">
          <HobbyPhoto hobby={hobby} variant="modal-hero" />
        </div>

        {/* Body */}
        <div className="px-6 pt-8 sm:px-9">
          <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--accent)]">
            {eyebrow}
          </p>
          <Dialog.Title asChild>
            <h2 className="mb-2 font-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.01em] sm:text-[2.5rem]">
              {hobby.label}
            </h2>
          </Dialog.Title>
          <p className="mb-6 text-[1.0625rem] leading-[1.55] text-[var(--muted)]">
            {hobby.tagline}
          </p>

          {hobby.meta && hobby.meta.length > 0 && (
            <dl className="mb-6 flex flex-wrap gap-x-7 gap-y-3 border-y border-[var(--border)] py-4">
              {hobby.meta.slice(0, 3).map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    {m.label}
                  </dt>
                  <dd className="text-[0.9375rem] font-medium text-[var(--foreground)]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mb-8 space-y-3.5 text-[1rem] leading-[1.7]">
            {hobby.story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Embed (optional) — e.g. Google My Maps route for a trip.
              Lazy-loaded and gated behind the modal open event, so the iframe
              cost doesn't touch the homepage. */}
          {hobby.embed && (
            <figure className="mb-8">
              <div
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
                style={{ aspectRatio: hobby.embed.aspectRatio ?? "4 / 3" }}
              >
                <iframe
                  src={hobby.embed.src}
                  title={hobby.embed.title}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              {hobby.embed.caption && (
                <figcaption className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                  {hobby.embed.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>

        {/* Gallery (optional) */}
        {hobby.gallery && hobby.gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-3 px-6 pb-6 sm:px-9 sm:pb-9">
            {hobby.gallery.slice(0, 3).map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 30vw, 220px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
