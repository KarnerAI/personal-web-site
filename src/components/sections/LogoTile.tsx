"use client";

// Theme B logo tile: white, padded, never cropped (DESIGN.md Shapes). The
// short badge text sits underneath and shows only if the image is missing or
// fails. Size comes from the caller's class (see .logo-tile in globals.css).
import { useImageFallback } from "./useImageFallback";

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
  const { failed, imgProps } = useImageFallback();
  const resolved = src ?? (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined);
  return (
    <span aria-hidden className={`logo-tile ${className}`}>
      {badge}
      {resolved && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolved} alt="" loading="lazy" decoding="async" {...imgProps} />
      )}
    </span>
  );
}
