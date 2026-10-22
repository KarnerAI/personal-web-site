import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LogoTile } from "./LogoTile";

// Added by the /ship test coverage audit, 2026-10-22.
// Value: protects=a server-rendered logo whose image already failed before hydration
//   (its error event fired with no handler yet) falls back to its badge, while a loaded
//   image or one not fetched yet stays; fails_when=the ref check is dropped, or loosened
//   to `complete` alone or without currentSrc; why_new=page.test.tsx fires error events
//   only; seam=none; no_claim=real browser load timing (image state faked on jsdom's
//   HTMLImageElement getters; unit only)
describe("useImageFallback", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    { state: "still loading", complete: false, currentSrc: "http://localhost/logos/x.webp", naturalWidth: 0, kept: true },
    { state: "failed before hydration", currentSrc: "http://localhost/logos/x.webp", naturalWidth: 0, kept: false },
    { state: "loaded", currentSrc: "http://localhost/logos/x.webp", naturalWidth: 176, kept: true },
    { state: "complete with nothing fetched yet", currentSrc: "", naturalWidth: 0, kept: true },
  ])("hydrating a logo that is $state keeps its image: $kept", ({ complete = true, currentSrc, naturalWidth, kept }) => {
    const ui = <LogoTile src="/logos/x.webp" badge="XY" />;
    const container = document.body.appendChild(document.createElement("div"));
    container.innerHTML = renderToString(ui);
    const proto = HTMLImageElement.prototype;
    vi.spyOn(proto, "complete", "get").mockReturnValue(complete);
    vi.spyOn(proto, "currentSrc", "get").mockReturnValue(currentSrc);
    vi.spyOn(proto, "naturalWidth", "get").mockReturnValue(naturalWidth);

    render(ui, { container, hydrate: true });
    expect(container.querySelector("img") !== null).toBe(kept);
    expect(container.textContent).toBe("XY");
  });
});
