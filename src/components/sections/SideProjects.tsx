// Side Projects — Option C · "Bento grid"
// Ported from public/sideprojects-comparison.html (#c).
// Mixed-size tiles in a 6-col grid with 180px row height, hover lift.
// Server component — no interaction state; the whole tile is a link.
import { sideProjects } from "@/data/sideProjects";
import type { SideProjectSize } from "@/types";

const SIZE_SPAN: Record<SideProjectSize, string> = {
  feature: "md:col-span-4 md:row-span-2 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[#F6EEEB]",
  tall: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-3 md:row-span-1",
  sq: "md:col-span-3 md:row-span-1",
};

export function SideProjects() {
  return (
    <section id="side-projects" className="section">
      <div className="content-width">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
          Side Projects
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          A bento box of builds.
        </h2>
        <p className="text-muted mb-10">
          One featured project + a grid of smaller ones. Click any tile to open.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[180px] gap-5">
          {sideProjects.map((p) => {
            const href = p.liveUrl || p.githubUrl || "#";
            const size: SideProjectSize = p.size ?? "sq";
            const isFeature = size === "feature";
            return (
              <a
                key={p.name}
                href={href}
                target={href === "#" ? undefined : "_blank"}
                rel={href === "#" ? undefined : "noreferrer"}
                className={[
                  "group relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)]",
                  "px-6 py-6 flex flex-col justify-between",
                  "transition-[transform,border-color,box-shadow] duration-200",
                  "hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[0_12px_32px_rgba(15,30,61,0.08)]",
                  SIZE_SPAN[size],
                ].join(" ")}
              >
                <div>
                  <h3
                    className={[
                      "font-semibold tracking-tight leading-[1.15]",
                      isFeature ? "text-3xl md:text-[36px]" : "text-xl md:text-[22px]",
                    ].join(" ")}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={[
                      "mt-2 text-muted leading-relaxed",
                      isFeature ? "text-base max-w-[440px]" : "text-sm",
                    ].join(" ")}
                  >
                    {p.description}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.techStack.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] tracking-wider text-muted bg-[#F0EFE9] rounded px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 flex gap-3.5 text-xs font-medium text-[var(--accent)]">
                    {p.liveUrl && <span>Live ↗</span>}
                    {p.githubUrl && <span>GitHub ↗</span>}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
