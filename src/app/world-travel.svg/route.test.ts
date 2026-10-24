// Value: protects=/world-travel.svg is a cacheable static SVG the browser draws as an
//   image: right content type and the map's 800x400 frame (the travel dialog pins use the
//   same box); fails_when=the route stops being static, or the type or viewBox
//   changes; why_new=the page test reads the land module, not the route; seam=none;
//   no_claim=how the browser paints it (unit only)
import { describe, expect, it } from "vitest";
import * as route from "./route";

describe("/world-travel.svg", () => {
  it("is a static SVG in the same 800x400 frame as the pins", async () => {
    expect(route.dynamic).toBe("force-static");
    const res = route.GET();
    expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
    const svg = await res.text();
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"')).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
  });
});

describe("/world-travel.svg colors", () => {
  it("draws white land with visited countries in peach", async () => {
    const svg = await route.GET().text();
    expect(svg).toContain("path{fill:#fff;");
    expect(svg).toContain(".v{fill:#ffd9bc}");
    expect(svg).toContain('class="v"');
  });
});
