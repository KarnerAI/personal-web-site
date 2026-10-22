import type { Certification, Degree } from "@/types";

// From Hussain's 2026 resume. Verify exact years + any missing credentials
// before ship. The YC entry is Startup School (confirmed 2026-10-21; year unknown).
export const degree: Degree = {
  school: "UMass Amherst",
  crest: "UM",
  degree: "B.S. Mechanical Engineering · Cum Laude",
  years: "2008 – 2012",
  location: "Amherst, MA",
  detail:
    "Graduated cum laude. Built a foundation in systems thinking that still shapes how I approach product problems.",
  logoDomain: "umass.edu",
};

// Certifications & continuing education. Ordered newest → oldest.
export const certifications: Certification[] = [
  {
    name: "Mastering Design Thinking",
    issuer: "MIT Sloan Executive Education",
    year: "2020",
    icon: "MIT",
    logoDomain: "mitsloan.mit.edu",
  },
  {
    name: "Credential of Readiness (CORe)",
    issuer: "Harvard Business School Online",
    year: "2015",
    icon: "HBS",
    logoDomain: "hbs.edu",
  },
  {
    name: "Startup School",
    issuer: "Y Combinator",
    icon: "YC",
    logoDomain: "ycombinator.com",
  },
];
