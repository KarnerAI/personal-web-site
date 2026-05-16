// HobbyPhoto — renders either a real next/image hero OR a branded color
// placeholder block when the hobby's `hero` is undefined (photo pipeline not
// yet complete). Keeps the layout stable while real photography catches up;
// once a hero is set, swaps to <Image fill> automatically.
//
// The placeholder color is derived from the slug so each hobby gets a stable,
// distinguishable tint — no risk of all four small tiles reading as the same
// gray block during the photo gap.

import Image from "next/image";
import type { Hobby } from "@/types";

const PLACEHOLDER_BG: Record<string, string> = {
  riding: "#2d3a52",
  "building-ai": "#2a3d5c",
  "martial-arts": "#3a4558",
  mentor: "#5f7a6b",
  festivals: "#a8442f",
};
const PLACEHOLDER_FALLBACK = "#3a4558";

type Variant = "tile-hero" | "tile-small" | "modal-hero";

type Props = {
  hobby: Hobby;
  variant: Variant;
};

export function HobbyPhoto({ hobby, variant }: Props) {
  if (hobby.hero) {
    return (
      <Image
        src={hobby.hero.src}
        alt={hobby.hero.alt}
        fill
        priority={variant === "tile-hero"}
        sizes={
          variant === "tile-hero"
            ? "(max-width: 900px) 100vw, 600px"
            : variant === "tile-small"
            ? "(max-width: 900px) 50vw, 300px"
            : "(max-width: 640px) 100vw, 720px"
        }
        className="object-cover"
      />
    );
  }

  // Placeholder: solid color + radial highlights for a photo-ish texture,
  // plus the hobby label typeset small in a mono font to call out that this
  // is a stand-in (honest signal, not fake-photo deception).
  const bg = PLACEHOLDER_BG[hobby.slug] ?? PLACEHOLDER_FALLBACK;
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-start justify-start p-4"
      style={{ backgroundColor: bg }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.18), transparent 50%)",
        }}
      />
      <span className="relative font-mono text-[0.625rem] uppercase tracking-[0.1em] text-white/55">
        Photo · {hobby.label}
      </span>
    </div>
  );
}
