// Education (theme B, DESIGN.md; v7 mockup).
// Left: the degree card. Right: certifications as table rows with a logo
// tile and a blue mono year. Server component; only the logo tiles are client.

import { certifications, degree } from "@/data/education";
import { LogoTile } from "./LogoTile";

export function Education() {
  return (
    <section id="education" aria-labelledby="edu-h" className="theme-b relative py-[112px] max-md:py-20">
      <div className="wrap">
        <p className="chip">Education</p>
        <h2 id="edu-h" className="type-heading m-0 mb-12 text-ink">
          Degree, and the things I added after.
        </h2>

        <div className="edu">
          <div>
            <p className="sub-label">Degree</p>
            <div className="deg">
              <LogoTile
                src={degree.logoSrc}
                domain={degree.logoDomain}
                badge={degree.crest}
                className="elogo"
              />
              <div>
                <h3>{degree.school}</h3>
                <p className="m">
                  {degree.years} · {degree.location}
                </p>
                <p className="dg">{degree.degree}</p>
                {degree.detail && <p className="dd">{degree.detail}</p>}
              </div>
            </div>
          </div>

          <div>
            <p className="sub-label">Certifications</p>
            <ul className="tbl">
              {certifications.map((c) => (
                <li key={c.name} className="cr">
                  <LogoTile src={c.logoSrc} domain={c.logoDomain} badge={c.icon} />
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.issuer}</p>
                  </div>
                  <span className="y">{c.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
