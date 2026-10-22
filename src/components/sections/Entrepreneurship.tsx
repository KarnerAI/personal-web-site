"use client";

// Things I've started (theme B, DESIGN.md; v7 mockup).
// Four cards in one row on desktop (2×2 tablet, 1 column phone): a 150px
// cover, status pill, name, hook, mono tags and "Read story" pinned to the
// card bottom. Clicking a card opens the story dialog (Problem / Built /
// Outcome / Lesson). Covers are real artifacts only: a photo ("fill"), a
// wordmark on its brand color ("logo") or a product screenshot ("shot"). When
// an image is missing or fails, the venture's name shows instead.

import { useRef, useState, type RefObject } from "react";
import { useImageFallback } from "./useImageFallback";
import * as Dialog from "@radix-ui/react-dialog";
import { ventures } from "@/data/entrepreneurship";
import type { Venture, VentureStatus } from "@/types";

const STATUS_DOT: Record<VentureStatus, string> = {
  Shipped: "shipped",
  Acquired: "shipped",
  Experimental: "experimental",
  Paused: "experimental",
  Active: "active",
  Live: "active",
};

function StatusPill({ status, className = "" }: { status: VentureStatus; className?: string }) {
  return (
    <span className={`status-pill ${className}`}>
      <span aria-hidden className={`status-dot ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

function VentureCover({ venture: v }: { venture: Venture }) {
  const { failed, imgProps } = useImageFallback();
  const treatment = v.coverTreatment ?? "fill";
  const showImage = Boolean(v.coverSrc) && !failed;

  return (
    <span
      className={`cv cv-${treatment}`}
      style={treatment === "logo" ? { background: v.coverGradient ?? "#0F1E3D" } : undefined}
    >
      {!showImage && (
        <span aria-hidden className="cv-fb">
          {v.name}
        </span>
      )}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={v.coverSrc}
          alt=""
          loading="lazy"
          decoding="async"
          {...imgProps}
        />
      )}
      <StatusPill status={v.status} />
    </span>
  );
}

function StoryMark({ venture: v }: { venture: Venture }) {
  const { failed, imgProps } = useImageFallback();
  return (
    <span aria-hidden className="mark">
      {v.logoInitials}
      {v.logoSrc && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.logoSrc} alt="" {...imgProps} />
      )}
    </span>
  );
}

function StoryDialog({
  venture: v,
  onClose,
  returnFocus,
}: {
  venture: Venture | null;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog.Root open={v !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="b-scrim" />
        {v && (
          <Dialog.Content
            className="theme-b b-sheet"
            onCloseAutoFocus={(e) => {
              // The cards open the dialog themselves, so hand focus back to the one clicked.
              e.preventDefault();
              returnFocus.current?.focus();
            }}
          >
            <div className="sheet-tools">
              <span aria-hidden className="kbd">
                esc
              </span>
              <Dialog.Close className="close-x" aria-label="Close story">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Dialog.Close>
            </div>
            <div className="vm">
              <div className="vm-hd">
                <StoryMark venture={v} />
                <span className="st">
                  <span aria-hidden className={`status-dot ${STATUS_DOT[v.status]}`} />
                  {v.status}
                </span>
              </div>
              <Dialog.Title asChild>
                <h2>{v.name}</h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <p className="vm-hook">{v.hook}</p>
              </Dialog.Description>
              <dl className="cs">
                <dt>Problem</dt>
                <dd>{v.caseStudy.problem}</dd>
                <dt>Built</dt>
                <dd>{v.caseStudy.whatIBuilt}</dd>
                <dt>Outcome</dt>
                <dd>{v.caseStudy.outcome}</dd>
                <dt>Lesson</dt>
                <dd className="it">{v.caseStudy.lessons}</dd>
              </dl>
              {v.externalUrl && v.externalUrl !== "#" && (
                <a className="ext" href={v.externalUrl} target="_blank" rel="noreferrer">
                  {v.externalLabel ?? "Visit"}{" "}
                  <span aria-hidden className="glyph">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Entrepreneurship() {
  const [open, setOpen] = useState<Venture | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  return (
    <section id="entrepreneurship" aria-labelledby="ven-h" className="theme-b relative py-[112px] max-md:py-20">
      <div className="wrap">
        <h2 id="ven-h" className="type-heading m-0 mb-6 text-ink">
          Things I&rsquo;ve started.
        </h2>
        <p className="lede">
          I&rsquo;ve been a founder since before it was called &ldquo;building in public.&rdquo; Some
          worked, some taught me more than any growth role. Click any card to read the full story.
        </p>
        <div className="vgrid">
          {ventures.map((v) => (
            <button
              key={v.slug}
              type="button"
              className="vc"
              aria-haspopup="dialog"
              onClick={(e) => {
                trigger.current = e.currentTarget;
                setOpen(v);
              }}
            >
              <VentureCover venture={v} />
              <span className="vb">
                <span className="vn">{v.name}</span>
                <span className="hook">{v.hook}</span>
                {v.tags && (
                  <span className="tags">
                    {v.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                )}
                <span className="rs">
                  Read story{" "}
                  <span aria-hidden className="glyph">
                    →
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <StoryDialog venture={open} onClose={() => setOpen(null)} returnFocus={trigger} />
    </section>
  );
}
