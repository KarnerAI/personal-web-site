"use client";

// HobbyTile — one tile in the H-A Magazine Mosaic. Each tile owns its own
// Dialog.Root so keyboard focus restores cleanly to the originating trigger
// when the modal closes (Radix handles that automatically).
//
// The first tile in the mosaic (isHero = true) spans 2 cols × 2 rows on
// desktop and reverts to full-width on tablet. Layout is driven by the
// className grid-area classes passed in from BeyondWork, not from inside here.

import * as Dialog from "@radix-ui/react-dialog";
import type { Hobby } from "@/types";
import { HobbyModal } from "./HobbyModal";
import { HobbyPhoto } from "./HobbyPhoto";

type Props = {
  hobby: Hobby;
  index: number;
  isHero?: boolean;
};

export function HobbyTile({ hobby, index, isHero = false }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={[
          "group relative block overflow-hidden rounded-xl text-left",
          "transition-transform duration-300 ease-out hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
          // Hero spans full width on tablet (2 cols) and 2×2 on desktop (4 cols).
          isHero
            ? "sm:col-span-2 md:col-span-2 md:row-span-2"
            : "",
        ].join(" ")}
      >
        {/* Photo layer */}
        <div className="absolute inset-0">
          <HobbyPhoto
            hobby={hobby}
            variant={isHero ? "tile-hero" : "tile-small"}
          />
        </div>

        {/* Expand cue (top-right pill) */}
        <span
          aria-hidden="true"
          className={[
            "absolute flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors group-hover:bg-white/30",
            isHero
              ? "right-3.5 top-3.5 h-10 w-10 text-xl"
              : "right-3 top-3 h-8 w-8 text-base",
          ].join(" ")}
        >
          +
        </span>

        {/* Bottom scrim + text */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,30,61,0) 0%, rgba(15,30,61,0.92) 100%)",
          }}
        />
        <span
          className={[
            "relative z-[1] flex h-full flex-col justify-end text-white",
            isHero ? "p-6" : "p-5",
          ].join(" ")}
        >
          <span
            className={[
              "font-semibold tracking-[-0.01em]",
              isHero ? "text-[1.875rem] leading-tight" : "text-[1.125rem]",
            ].join(" ")}
          >
            {hobby.label}
          </span>
          <span
            className={[
              "mt-1 leading-[1.5] text-white/85",
              isHero ? "text-[0.9375rem]" : "text-[0.8125rem]",
            ].join(" ")}
          >
            {hobby.tagline}
          </span>
        </span>
      </Dialog.Trigger>

      <HobbyModal hobby={hobby} index={index} />
    </Dialog.Root>
  );
}
