// Education — Option B · "Two-column (degree + certifications)"
// Ported from public/education-comparison.html (#b).
// Left: degree with detail. Right: stacked certifications list.
// Server component; fully static.

import { certifications, degree } from "@/data/education";
import { EducationLogo } from "./EducationLogo";

export function Education() {
  return (
    <section id="education" className="section">
      <div className="content-width max-w-[1100px]">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
          Education
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12">
          Degree, and the things I added after.
        </h2>

        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-start">
          {/* Degree column */}
          <div>
            <p className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-5 pb-3 border-b border-[var(--border)]">
              Degree
            </p>
            <div className="grid grid-cols-[80px_1fr] gap-5 items-start">
              <EducationLogo
                logoSrc={degree.logoSrc}
                logoDomain={degree.logoDomain}
                initials={degree.crest}
                size="degree"
                alt={`${degree.school} logo`}
              />
              <div>
                <h4 className="text-2xl md:text-[28px] font-semibold leading-tight tracking-tight mb-1">
                  {degree.school}
                </h4>
                <p className="font-mono text-xs text-muted tracking-wider mb-2.5">
                  {degree.years} · {degree.location}
                </p>
                <p className="text-[15px] font-medium mb-2">{degree.degree}</p>
                {degree.detail && (
                  <p className="text-sm text-muted leading-relaxed">{degree.detail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Certifications column */}
          <div>
            <p className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-5 pb-3 border-b border-[var(--border)]">
              Certifications
            </p>
            <div className="flex flex-col gap-3">
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className="grid grid-cols-[36px_1fr_auto] gap-3.5 items-center px-4 py-3.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]"
                >
                  <EducationLogo
                    logoSrc={c.logoSrc}
                    logoDomain={c.logoDomain}
                    initials={c.icon}
                    size="cert"
                    alt={`${c.issuer} logo`}
                  />
                  <div>
                    <p className="text-[15px] font-medium">{c.name}</p>
                    <p className="font-mono text-xs text-muted">{c.issuer}</p>
                  </div>
                  <span className="font-mono text-xs text-[var(--accent)]">{c.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
