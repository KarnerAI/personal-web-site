// Hero: theme B "board" layout (DESIGN.md; v7 mockup).
// Info strip → name → bio, a contact ticket under them, and a framed square
// portrait on the right (stacked on tablets and phones). No entrance
// animation: the career timeline is the page's one moment of motion (the
// Riding & driving hover loop is an approved exception, not built yet; see
// TODOS.md Phase 6).
// The Einstein quote moved out of the hero into the bridge band below.
import { EditableImage } from "@/components/edit-mode/EditableImage";

const NAME = "Hussain Alam";
const ROLE = "Operator turned PM";
const CITY = "Based in New York";
// One sentence per line where the column is wide enough; on narrower screens
// each sentence wraps on its own, balanced so no word is left alone.
// "early-stage" stays on one line so the wrap can't split it.
const BIO = (
  <>
    <span className="block [text-wrap:balance]">
      13+ years across Fortune 500 growth and{" "}
      <span className="whitespace-nowrap">early-stage</span> startups.
    </span>{" "}
    <span className="block [text-wrap:balance]">
      I lead cross-functional teams, ship product, and build things on the side.
    </span>
  </>
);
const EMAIL = "hussain@karnerblu.com";

// Pre-cropped square (1024px) with the head centered, so the default 50/50
// position is right. EditableImage lets edit mode swap or reposition it.
// The older public/logos/profile-image.png stays for the mockups that use it.
const PORTRAIT_URL = "/logos/profile-image-nyc.webp";

const CONTACTS = [
  {
    label: "LinkedIn",
    handle: "/in/hussainalam",
    href: "https://www.linkedin.com/in/hussainalam",
    external: true,
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Email",
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
    icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  },
  {
    label: "GitHub",
    handle: "/KarnerAI",
    href: "https://github.com/KarnerAI",
    external: true,
    icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

export function Hero() {
  return (
    <section id="hero" aria-label="Introduction" className="theme-b hero-wash">
      <div className="wrap pb-[104px] pt-14 max-[860px]:pb-[72px] max-[860px]:pt-9">
        {/* Info strip */}
        <p className="mx-auto mb-16 flex max-w-[620px] flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-full border border-line bg-white/85 px-[22px] py-2.5 shadow-[0_1px_2px_rgba(15,30,61,0.05)] max-[860px]:mb-10 max-[860px]:flex-col max-[860px]:items-start max-[860px]:rounded-2xl max-[860px]:px-4 max-[860px]:py-3">
          <span className="text-[13.5px] font-semibold text-ink">{ROLE}</span>
          <span className="type-mono text-ink-muted">{CITY}</span>
        </p>

        <div className="hero-grid">
          <div className="[grid-area:intro]">
            <h1 className="type-display m-0 mb-[22px] text-ink">{NAME}</h1>
            <p className="type-body-lg m-0 max-w-[34em] text-ink-secondary">
              {BIO}
            </p>
          </div>

          {/* Framed square portrait. The "HA" monogram sits underneath the
              photo layer, so it only shows if the image is missing. */}
          <figure className="portrait-frame m-0 rounded-[20px] border border-line bg-white p-1.5 [grid-area:portrait] max-[860px]:max-w-[300px]">
            <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#E7F3FB,#FDEEE2)]">
              <span
                aria-hidden
                className="absolute inset-0 grid place-items-center text-5xl font-semibold text-ink/35"
              >
                HA
              </span>
              <EditableImage
                slotId="hero-portrait"
                ariaLabel={`Portrait of ${NAME}`}
                defaultSrc={PORTRAIT_URL}
                defaultPositionX={50}
                defaultPositionY={50}
                exportSize={{ w: 1024, h: 1024 }}
                className="h-full w-full"
                priority
              />
            </div>
          </figure>

          {/* Contact ticket: link rows + the one primary button. */}
          <div className="grid grid-cols-[minmax(0,1fr)_220px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(15,30,61,0.05),0_8px_24px_-12px_rgba(15,30,61,0.16)] [grid-area:ticket] max-[860px]:grid-cols-1">
            <ul className="m-0 list-none p-0">
              {CONTACTS.map((c) => (
                <li key={c.label} className="border-line-subtle [&+&]:border-t">
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    aria-label={`${c.label}: ${c.handle}`}
                    className="group grid min-h-[52px] grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-4 px-5 text-[14.5px] text-ink transition-colors hover:bg-[#F7FAFC] focus-visible:outline-offset-[-3px] max-[860px]:px-4"
                  >
                    <span
                      aria-hidden
                      className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-line bg-sunken transition-colors group-hover:border-[rgba(10,110,170,0.35)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        className="h-[15px] w-[15px] fill-ink transition-colors group-hover:fill-primary"
                      >
                        <path d={c.icon} />
                      </svg>
                    </span>
                    <span className="[overflow-wrap:anywhere]">{c.handle}</span>
                    <span
                      aria-hidden
                      className="glyph text-[#9CA3AF] transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="grid place-items-center border-l border-line-subtle bg-[#FAFBFC] p-5 max-[860px]:border-l-0 max-[860px]:border-t">
              <a className="btn-primary" href={`mailto:${EMAIL}`}>
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
