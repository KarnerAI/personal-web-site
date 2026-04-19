"use client";

// Client-only wrapper for TravelMapLeaflet.
// Next.js 16 disallows `ssr: false` on `next/dynamic` inside page.tsx —
// the dynamic import must live in a Client Component that is imported by
// the page, not in the page file itself.

import dynamic from "next/dynamic";

export const TravelMapLeaflet = dynamic(
  () =>
    import("./TravelMapLeaflet").then((m) => m.TravelMapLeaflet),
  { ssr: false },
);
