"use client";

// Entrepreneurship — v3 · "Things I've started" card grid + modal
// 4 cards in a row (2x2 on narrower widths). Each card: status dot + label,
// venture name, 1-2 line hook, tag chips, "Read story →" link.
// Click opens a modal with the full Problem/Built/Outcome/Lesson case study.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ventures } from "@/data/entrepreneurship";
import type { Venture, VentureStatus } from "@/types";

const STATUS_DOT: Record<VentureStatus, string> = {
  Active: "bg-emerald-500",
  Shipped: "bg-blue-500",
  Live: "bg-emerald-500",
  Acquired: "bg-[var(--accent)]",
  Paused: "bg-zinc-400",
  Experimental: "bg-amber-500",
};

// Venture logo resolver.
// Priority: explicit src (local asset or URL) > Google's s2 favicon API > initials badge.
function VentureLogo({
  venture: v,
  size,
}: {
  venture: Venture;
  size: "card" | "modal";
}) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc =
    v.logoSrc ??
    (v.logoDomain
      ? `https://www.google.com/s2/favicons?domain=${v.logoDomain}&sz=128`
      : undefined);
  const showImage = Boolean(resolvedSrc) && !errored;

  const dims =
    size === "card"
      ? "h-11 w-11 rounded-lg text-[13px]"
      : "h-14 w-14 rounded-xl text-base";

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt=""
        onError={() => setErrored(true)}
        className={`${dims} object-contain bg-[var(--bg)] border border-[var(--border)] p-1.5`}
      />
    );
  }

  return (
    <div
      className={`${dims} bg-[var(--bg)] border border-[var(--border)] font-semibold tracking-tight flex items-center justify-center text-[var(--fg)]`}
      aria-hidden
    >
      {v.logoInitials ?? v.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function Entrepreneurship() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openVenture = ventures.find((v) => v.slug === openSlug) ?? null;

  // Lock body scroll + close on Escape while modal is open.
  useEffect(() => {
    if (!openVenture) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openVenture]);

  return (
    <section id="entrepreneurship" className="section">
      <div className="content-width max-w-[1200px]">
        <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02] mb-6">
          Things I&apos;ve started.
        </h2>
        <p className="text-muted text-[17px] max-w-[680px] mb-12">
          I&apos;ve been a founder since before it was called &quot;building in public.&quot; Some worked,
          some taught me more than any growth role. Click any card to read the full story.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ventures.map((v) => (
            <VentureCard key={v.slug} venture={v} onOpen={() => setOpenSlug(v.slug)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openVenture && (
          <CaseStudyModal venture={openVenture} onClose={() => setOpenSlug(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function VentureCard({ venture: v, onOpen }: { venture: Venture; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group text-left border border-[var(--border)] bg-[var(--surface)] rounded-xl p-6 flex flex-col min-h-[280px] hover:border-[var(--accent)] hover:shadow-sm transition-all"
    >
      <VentureLogo venture={v} size="card" />

      <div className="flex items-center gap-2 mt-5 mb-3">
        <span className={["w-2 h-2 rounded-full", STATUS_DOT[v.status]].join(" ")} aria-hidden />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {v.status}
        </span>
      </div>

      <h3 className="text-2xl font-semibold tracking-tight mb-3 leading-tight">{v.name}</h3>
      <p className="text-muted text-[15px] leading-[1.55] mb-auto">{v.hook}</p>

      {v.tags && v.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {v.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] text-muted bg-[var(--bg)] border border-[var(--border)] px-2 py-[3px] rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-[var(--border)] mt-5 pt-4">
        <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
          Read story →
        </span>
      </div>
    </button>
  );
}

function CaseStudyModal({ venture: v, onClose }: { venture: Venture; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close case study"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(15,30,61,0.5)] backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${v.name} case study`}
        className="relative bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto p-7 md:p-10"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-4">
          <VentureLogo venture={v} size="modal" />
          <div className="flex items-center gap-2">
            <span className={["w-2 h-2 rounded-full", STATUS_DOT[v.status]].join(" ")} aria-hidden />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {v.status}
            </span>
          </div>
        </div>

        <h3 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-3">
          {v.name}
        </h3>
        <p className="text-muted text-lg mb-8">{v.hook}</p>

        <dl className="grid grid-cols-[90px_1fr] gap-x-5 gap-y-4 md:gap-y-5">
          <ModalField label="Problem">{v.caseStudy.problem}</ModalField>
          <ModalField label="Built">{v.caseStudy.whatIBuilt}</ModalField>
          <ModalField label="Outcome">{v.caseStudy.outcome}</ModalField>
          <ModalField label="Lesson" italic>
            {v.caseStudy.lessons}
          </ModalField>
        </dl>

        {v.externalUrl && v.externalUrl !== "#" && (
          <a
            href={v.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block text-sm font-medium text-[var(--accent)]"
          >
            Visit ↗
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

function ModalField({
  label,
  italic,
  children,
}: {
  label: string;
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] pt-[5px]">
        {label}
      </dt>
      <dd
        className={[
          "m-0 text-[15px] leading-[1.6]",
          italic ? "italic text-muted" : "text-[var(--fg)]",
        ].join(" ")}
      >
        {children}
      </dd>
    </>
  );
}
