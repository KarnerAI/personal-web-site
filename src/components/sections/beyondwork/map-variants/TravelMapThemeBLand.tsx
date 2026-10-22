"use client";

// The map's land layer (/world-land.svg) as an image. If the file fails to
// load, an empty box of the same shape keeps its place, so the grid and the
// pins still show every visited country instead of a broken-image icon.
import { useImageFallback } from "../../useImageFallback";

export function TravelMapThemeBLand({ alt, width, height }: { alt: string; width: number; height: number }) {
  const { failed, imgProps } = useImageFallback();
  if (failed) return <div role="img" aria-label={alt} style={{ aspectRatio: `${width} / ${height}` }} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/world-land.svg" alt={alt} width={width} height={height} loading="lazy" decoding="async" {...imgProps} />
  );
}
