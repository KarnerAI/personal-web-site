"use client";

// Theme B logo tile: white, padded, never cropped (DESIGN.md Shapes). The
// short badge text sits underneath and shows only if the image is missing or
// fails. Size comes from the caller's class (see .logo-tile in globals.css).
import { useState } from "react";

export function LogoTile({
  src,
  domain,
  badge,
  className = "",
}: {
  src?: string;
  domain?: string;
  badge: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const resolved = src ?? (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined);
  // onError only fires after hydration; catch an image that already failed.
  const catchEarlyError = (img: HTMLImageElement | null) => {
    if (img?.complete && img.currentSrc && img.naturalWidth === 0) setErrored(true);
  };
  return (
    <span aria-hidden className={`logo-tile ${className}`}>
      {badge}
      {resolved && !errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolved} alt="" ref={catchEarlyError} onError={() => setErrored(true)} />
      )}
    </span>
  );
}
