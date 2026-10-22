import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// next/font only works inside the Next compiler; stand in for the CSS variables.
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

const { default: RootLayout, metadata } = await import("./layout");
const css = readFileSync("src/app/globals.css", "utf8");

describe("RootLayout", () => {
  it("sets the page title and Geist font variables", () => {
    expect(metadata.title).toBe("Hussain Alam | Operator turned PM");
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>page</p>
      </RootLayout>
    );
    expect(html).toContain('<html lang="en" class="font-geist font-geist-mono');
    expect(html).toContain("<p>page</p>");
  });
});

describe("globals.css", () => {
  it("keeps Tailwind from scanning the raw media and mockup folders", () => {
    // Untracked HEIC/MOV files and saved web pages produced garbage CSS and a 500.
    for (const dir of ["images", "design-themes", "design-variants"]) {
      expect(css).toContain(`@source not "../../${dir}";`);
    }
  });

  it("defines the theme B brand blue and honours reduced motion", () => {
    expect(css).toMatch(/--primary:\s*#0a6eaa;/i);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*animation-duration:\s*0\.01ms/);
  });

  it("loads no retired fonts", () => {
    expect(css).not.toMatch(/--font-(inter|instrument)/i);
    expect(css).not.toMatch(/font-family:[^;]*(Inter|Instrument Serif)/);
  });
});
