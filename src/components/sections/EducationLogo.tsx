"use client";

// Education logo resolver.
// Priority: explicit logoSrc > Google's s2 favicon API (logoDomain) > initials badge.
// Same pattern as VentureLogo in Entrepreneurship.tsx.

import { useState } from "react";

type Size = "degree" | "cert";

export function EducationLogo({
  logoSrc,
  logoDomain,
  initials,
  size,
  alt,
}: {
  logoSrc?: string;
  logoDomain?: string;
  initials: string;
  size: Size;
  alt: string;
}) {
  const [errored, setErrored] = useState(false);

  const resolvedSrc =
    logoSrc ??
    (logoDomain
      ? `https://www.google.com/s2/favicons?domain=${logoDomain}&sz=128`
      : undefined);
  const showImage = Boolean(resolvedSrc) && !errored;

  const dims =
    size === "degree"
      ? "h-20 w-20 rounded-2xl text-2xl"
      : "h-9 w-9 rounded-lg text-[11px]";

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        onError={() => setErrored(true)}
        className={`${dims} object-contain bg-[var(--surface)] border border-[var(--border)] ${
          size === "degree" ? "p-3" : "p-1.5"
        }`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`${dims} bg-[var(--surface)] border border-[var(--border)] font-mono tracking-wider flex items-center justify-center text-muted`}
    >
      {initials}
    </div>
  );
}
