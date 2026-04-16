// Shared types for the personal website.
// Expand these as content schemas get finalized in the content phase.

export type CareerRole = {
  company: string;
  logo?: string; // path under /public/logos/
  role: string;
  startDate: string; // "Jan 2020"
  endDate: string | "Present";
  whyIWasThere: string;
  heroBullet: string;
  subBullets: [string, string];
  awards?: string[];
};

export type Venture = {
  slug: string;
  name: string;
  icon?: string;
  hook: string;
  status: "Live" | "Acquired" | "Paused" | "Experimental";
  awards?: string[];
  externalUrl?: string;
  caseStudy: {
    problem: string;
    whatIBuilt: string;
    outcome: string;
    lessons: string;
  };
};

export type SideProject = {
  name: string;
  screenshot?: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
};

export type Hobby = {
  emoji: string;
  label: string;
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

export type TravelData = {
  countryCount: number;
  favoriteCountry: string;
  nationality: string;
  caption: string;
  visitedCountryCodes: string[]; // ISO 3166-1 alpha-2
};

export type ContactFormInput = {
  name: string;
  email: string;
  companyOrRole?: string;
  message: string;
};
