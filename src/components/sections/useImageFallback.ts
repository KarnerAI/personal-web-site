import { useState } from "react";

// Tracks whether an <img> failed to load so the caller can show its text
// fallback (initials, a badge, a name) or drop the slot instead. Spread
// `imgProps` onto the <img>. onError only fires after hydration, so the ref
// also catches an image that already failed before React attached the handler.
export function useImageFallback() {
  const [failed, setFailed] = useState(false);
  const imgProps = {
    ref: (img: HTMLImageElement | null) => {
      if (img?.complete && img.currentSrc && img.naturalWidth === 0) setFailed(true);
    },
    onError: () => setFailed(true),
  };
  return { failed, imgProps };
}
