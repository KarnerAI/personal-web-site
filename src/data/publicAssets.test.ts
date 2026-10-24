import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as beyondWork from "./beyondWork";
import * as career from "./career";
import * as contact from "./contact";
import * as education from "./education";
import * as entrepreneurship from "./entrepreneurship";

const ROOT = path.resolve(__dirname, "../..");
const PUBLIC = path.join(ROOT, "public");
const MOCKUPS = path.join(ROOT, "design-variants");

// Every module in src/data; the first test fails when one is added and not listed here.
const DATA = { beyondWork, career, contact, education, entrepreneurship };

const MEDIA = /^\/(?!\/)[^?#\s]+\.(avif|gif|jpe?g|mp4|png|svg|webm|webp)$/i;

// Every local media path anywhere in a data module (any field, any depth).
function mediaPaths(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (MEDIA.test(value)) found.add(value);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) mediaPaths(v, found);
  }
  return found;
}

// Walks public/ one folder listing at a time, so a name that differs only in case
// fails here too: macOS finds it anyway, but Linux (CI) and Vercel do not.
function problemWith(rel: string): string | null {
  let dir = PUBLIC;
  for (const name of rel.split("/").filter(Boolean)) {
    const names = readdirSync(dir);
    if (!names.includes(name)) {
      const near = names.find((n) => n.toLowerCase() === name.toLowerCase());
      const where = path.relative(PUBLIC, dir) || ".";
      return near ? `${rel}: on disk as "${near}" (case differs)` : `${rel}: no "${name}" in public/${where}`;
    }
    dir = path.join(dir, name);
  }
  return statSync(dir).isFile() ? null : `${rel}: a folder, not a file`;
}

describe("public/ assets", () => {
  // Added by the /ship test coverage audit, 2026-10-22.
  // Value: protects=every local image or video path in src/data (venture covers and
  //   logos, hobby heroes and galleries, career and education logos) names a file in
  //   public/ with the exact case; fails_when=a path is mistyped, differs only in case
  //   (passes on macOS, 404s on Vercel), its new file is left out of the commit, or a
  //   new src/data module is never scanned;
  //   why_new=the cover, logo and photo fallbacks hide a missing file, and the
  //   story-badge unit test runs in jsdom, which never fetches the logo; seam=none;
  //   no_claim=the files decode as images (see e2e/home.spec.ts) or look right
  it("every local media path in the data files names a real file, exact case", () => {
    // Any file or folder here but a test (a .json module, a subfolder) must be listed in
    // DATA; dotfiles (Finder's .DS_Store, editor swap files) are skipped.
    const modules = readdirSync(__dirname).filter((f) => !f.startsWith(".") && !/\.test\.[jt]sx?$/.test(f));
    expect(modules.map((f) => f.replace(/\.[^.]+$/, "")).sort()).toEqual(Object.keys(DATA).sort());

    const { ventures } = entrepreneurship;
    const { hobbies } = beyondWork;
    const { careerRoles } = career;
    const { degree, certifications } = education;
    const refs = mediaPaths(Object.values(DATA));
    // The scan reaches the local paths the data names for display (logos may be full
    // URLs; hobby galleries aren't drawn yet but their files must exist too).
    const rendered = [
      ...ventures.flatMap((v) => [v.coverSrc, v.logoSrc]),
      ...hobbies.flatMap((h) => [h.hero, ...(h.gallery ?? [])].map((img) => img?.src)),
      ...careerRoles.flatMap((r) => [r.logoSrc, ...(r.clients ?? []).map((c) => c.logoSrc)]),
      degree.logoSrc,
      ...certifications.map((c) => c.logoSrc),
    ].filter((src): src is string => !!src && src.startsWith("/") && !src.startsWith("//"));
    expect(rendered.length).toBeGreaterThan(0);
    expect([...refs]).toEqual(expect.arrayContaining(rendered));

    expect([...refs].map(problemWith).filter(Boolean)).toEqual([]);
  });

  // Added by the /ship test coverage audit, 2026-10-22.
  // Value: protects=every ../public/ file a design-variants mockup loads (v7, v8 and
  //   earlier) still exists with the exact case, per DESIGN-VARIANTS.md (never rename
  //   or delete them); fails_when=a file only a mockup uses (riding-loop.mp4,
  //   logo-imentor.png, logo-build.png, emojifriends.avif, profile-image.png) is
  //   deleted or renamed as unused, or left out of the commit; why_new=no test reads
  //   design-variants/; seam=none; no_claim=paths a mockup builds at runtime (literal
  //   ../public/ strings only) and how the mockups render
  it("every public/ file a design mockup loads still exists, exact case", () => {
    const refs = new Set<string>();
    for (const file of readdirSync(MOCKUPS).filter((f) => f.endsWith(".html"))) {
      const html = readFileSync(path.join(MOCKUPS, file), "utf8");
      for (const [, rel] of html.matchAll(/\.\.\/public\/([^"'`()\s?#]+)/g)) refs.add(decodeURIComponent(rel));
    }
    expect(refs.size).toBeGreaterThan(0);

    expect([...refs].map(problemWith).filter(Boolean)).toEqual([]);
  });
});
