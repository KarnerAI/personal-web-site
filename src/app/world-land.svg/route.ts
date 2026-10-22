// /world-land.svg: the travel map's land layer, rendered once at build time and
// cached like any static file (see themeBLand.ts for why it is a separate file).
import { worldLandSvg } from "@/components/sections/beyondwork/map-variants/themeBLand";

export const dynamic = "force-static";

export function GET() {
  return new Response(worldLandSvg(), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
