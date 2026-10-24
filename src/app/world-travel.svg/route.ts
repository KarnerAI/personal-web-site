// /world-travel.svg: the Travel hobby tile's map (white land, visited countries
// in peach), rendered once at build time and cached like any static file.
import { worldTravelSvg } from "@/components/sections/beyondwork/map-variants/themeBLand";

export const dynamic = "force-static";

export function GET() {
  return new Response(worldTravelSvg(), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
