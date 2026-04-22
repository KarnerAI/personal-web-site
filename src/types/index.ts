// Shared types for the personal website.
// Expand these as content schemas get finalized in the content phase.

export type SubRole = {
  title: string;
  dates: string;
  loc: string;
};

export type CareerRole = {
  company: string;
  logo?: string; // short mono badge ("AB") — used as last-resort fallback
  logoSrc?: string; // local asset path (e.g. "/logos/karnerblu.png") or full URL — highest priority
  logoDomain?: string; // e.g. "wework.com" — resolved via Google's favicon API when no logoSrc
  // Display-format dates (what the UI renders as "yearsLabel").
  startDate: string; // "Jan 2020"
  endDate: string | "Present";
  // Machine-format dates used for proportional math on the timeline.
  // "YYYY-MM" or the string "Present".
  startMonth: string;
  endMonth: string | "Present";
  yearsLabel: string; // e.g. "2012 – 2018"
  role: string; // short headline role (one line)
  location: string;
  whyIWasThere: string;
  heroBullet: string;
  subBullets: string[]; // was fixed-2 tuple; widened so we can carry real resume bullets
  roles?: SubRole[]; // multi-role progression inside a company
  awards?: string[];
};

export type VentureStatus =
  | "Active"
  | "Shipped"
  | "Live"
  | "Acquired"
  | "Paused"
  | "Experimental";

export type Venture = {
  slug: string;
  name: string;
  icon?: string;
  // Logo resolution, same pattern as CareerRole:
  // logoSrc (local asset or URL) > logoDomain (favicon) > logoInitials (badge).
  logoSrc?: string;
  logoDomain?: string;
  logoInitials?: string;
  // Cover image for the card banner (variant A — 150px full-bleed).
  // Resolution: coverSrc (real asset) > coverGradient (CSS fallback, with optional coverEmoji).
  coverSrc?: string;
  coverGradient?: string; // full CSS `background` value
  coverEmoji?: string;
  hook: string;
  status: VentureStatus;
  tags?: string[];
  awards?: string[];
  externalUrl?: string;
  caseStudy: {
    problem: string;
    whatIBuilt: string;
    outcome: string;
    lessons: string;
  };
};

// Tile size within the bento grid (sideprojects Option C).
export type SideProjectSize = "feature" | "tall" | "wide" | "sq";

export type SideProject = {
  name: string;
  screenshot?: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  size?: SideProjectSize;
};

export type Hobby = {
  emoji: string;
  label: string;
  note?: string;
};

export type Book = {
  title: string;
  author: string;
  cover?: string;
  why: string;
};

export type Podcast = {
  name: string;
  host?: string;
  art?: string;
};

// A visited country plotted on the Beyond Work travel map.
export type VisitedCountry = {
  code: string; // ISO 3166-1 alpha-2 (or short alias)
  name: string;
  x: number; // SVG viewBox 480 x 240
  y: number;
  fav?: boolean;
};

export type TravelData = {
  countryCount: number;
  cityCount?: number;
  favoriteCountry: string;
  favoriteCity?: string; // e.g. "Mexico City"
  favoriteCityFlag?: string; // emoji flag for favoriteCity's country, e.g. "🇲🇽"
  nationality: string;
  nationalityFlag?: string; // emoji flag pair, e.g. "🇧🇩🇺🇸"
  favoriteFlag?: string; // emoji flag for favoriteCountry, e.g. "🇨🇴"
  caption: string;
  // Either an ISO list (for future real map lib) or the plotted coordinates used today.
  visitedCountryCodes: string[];
  visited?: VisitedCountry[];
  nextUp?: string; // "Lisbon, May 2026"
  base?: string; // "New York, NY"
};

export type Degree = {
  school: string;
  crest: string; // short 2-letter badge — fallback when logo fails to load
  degree: string;
  years: string;
  location: string;
  detail?: string;
  // Logo resolution, same pattern as CareerRole / Venture:
  // logoSrc (local asset or URL) > logoDomain (Google favicon API) > crest badge.
  logoSrc?: string;
  logoDomain?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string; // "'20" / "2020"
  icon: string; // short 2-letter badge — fallback when logo fails to load
  // Logo resolution, same pattern as CareerRole / Venture.
  logoSrc?: string;
  logoDomain?: string;
};

export type ContactFormInput = {
  name: string;
  email: string;
  companyOrRole?: string;
  message: string;
};
