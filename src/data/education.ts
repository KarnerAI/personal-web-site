import type { Certification, Degree } from "@/types";

// From Hussain's 2026 resume. Verify exact years + any missing credentials
// (e.g. YC Product School reference in the old Education stub) before ship.
export const degree: Degree = {
  school: "UMass Amherst",
  crest: "UM",
  degree: "B.S. Mechanical Engineering · Cum Laude",
  years: "2008 – 2012",
  location: "AMHERST, MA",
  detail:
    "Graduated cum laude. Built a foundation in systems thinking that still shapes how I approach product problems.",
  logoDomain: "umass.edu",
};

// Certifications & continuing education. Ordered newest → oldest.
export const certifications: Certification[] = [
  {
    name: "Mastering Design Thinking",
    issuer: "MIT Sloan Executive Education",
    year: "'20",
    icon: "MIT",
    logoDomain: "mitsloan.mit.edu",
  },
  {
    name: "Credential of Readiness (CORe)",
    issuer: "Harvard Business School Online",
    year: "'15",
    icon: "HBS",
    logoDomain: "hbs.edu",
  },
  {
    name: "Product School",
    issuer: "Y Combinator",
    year: "—",
    icon: "YC",
    logoDomain: "ycombinator.com",
  },
];
