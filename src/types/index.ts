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
  // Machine-format dates; they drive the tenure label in the chapter panel.
  // "YYYY-MM" or the string "Present".
  startMonth: string;
  endMonth: string | "Present";
  yearsLabel: string; // e.g. "2012 - 2018"
  tagline?: string; // 2–4 word chapter theme rendered prominently on the timeline card
  role: string; // short headline role (one line)
  location: string;
  whyIWasThere: string;
  // Story lines. Wrap the one key number in **double asterisks** to bold it;
  // one per line, so the numbers stand out when someone scans.
  heroBullet: string;
  subBullets: string[]; // was fixed-2 tuple; widened so we can carry real resume bullets
  roles?: SubRole[]; // multi-role progression inside a company
  awards?: string[];
  clients?: { name: string; logoSrc: string }[]; // logo row on the card and detail panel
  kpi?: { lead: string; rest: string }; // proof line on the card: bold lead, then the rest
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
  // Story-dialog mark: logoSrc (local asset or URL) over the logoInitials badge.
  // logoDomain is not looked up for ventures.
  logoSrc?: string;
  logoDomain?: string;
  logoInitials?: string;
  // Card cover (see coverTreatment). coverGradient paints only "logo" covers. With no
  // image, or one that fails, the cover shows the venture name. coverEmoji is unused.
  coverSrc?: string;
  coverGradient?: string; // full CSS `background` value
  coverEmoji?: string;
  // "fill" (default): coverSrc stretched edge-to-edge via object-cover (good for photos).
  // "logo": coverGradient paints the background, coverSrc rendered as a contained logo centered on top (good for wordmarks/marks).
  // "shot": a product screenshot floating on a soft blue grid wash.
  coverTreatment?: "fill" | "logo" | "shot";
  hook: string;
  status: VentureStatus;
  tags?: string[];
  awards?: string[];
  externalUrl?: string;
  externalLabel?: string; // link text in the modal; defaults to "Visit"
  caseStudy: {
    problem: string;
    whatIBuilt: string;
    outcome: string;
    lessons: string;
  };
};

// Hero or gallery image for a hobby. `alt` is required — every photo tells a
// story, so let the data file speak rather than defaulting to the label.
export type HobbyImage = {
  src: string; // any file under /images/hobbies/, e.g. "/images/hobbies/riding-poster.jpg"
  alt: string;
  position?: string; // CSS object-position focal point; defaults to "50% 25%" (faces sit high; HobbyMosaic's test pins it)
};

// A meta row rendered in the hobby modal's stat band (up to 3).
export type HobbyMeta = {
  label: string; // e.g. "Years"
  value: string; // e.g. "12+"
};

// Optional third-party embed (e.g. a Google My Maps route). Rendered in the
// modal below the story. Only loads when the modal opens, so the iframe cost
// doesn't hit the homepage — it's gated behind the user clicking the tile.
export type HobbyEmbed = {
  src: string; // iframe src (e.g. Google Maps `/maps/d/embed?mid=...`)
  title: string; // accessible label for the iframe
  caption?: string; // small caption rendered under the embed
  aspectRatio?: string; // CSS aspect-ratio, default "4 / 3"
};

export type Hobby = {
  slug: string; // stable key; also the .ph-{slug} placeholder wash class in globals.css
  label: string; // tile + modal title
  tagline: string; // short tile subtitle, also prose tagline in the modal
  // Without a `hero`, the tile renders a branded color block with the label so
  // layout is stable. With one, the photo fills the tile and the dialog header.
  hero?: HobbyImage;
  gallery?: HobbyImage[]; // 0–3 thumbnails for the modal; not rendered yet
  embed?: HobbyEmbed; // optional iframe block (e.g. trip route map)
  story: string[]; // 2–4 paragraphs rendered in the modal body
  meta?: HobbyMeta[]; // 0–3 rows in the modal meta band
  tileTagline?: string; // tile subtitle when it differs from the modal tagline
  // Muted loop that plays over the hero on mouse hover only, from `start` seconds.
  video?: { src: string; start: number };
  illustration?: "belt" | "pair"; // drawn tile art for a hobby without a photo
  map?: boolean; // the tile and modal header show the travel map
  chapters?: HobbyChapter[]; // stacked org sections in place of the story
};

// One organization inside a hobby's story (e.g. a mentoring program).
export type HobbyChapter = {
  org: string;
  kicker: string; // e.g. "iMentor · New York"
  logoSrc: string;
  text: string;
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
  captionCite?: string; // attribution shown on its own line under the caption
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
  year?: string; // "'20" / "2020"; omit when unknown and the chip is hidden
  icon: string; // short 2-letter badge — fallback when logo fails to load
  // Logo resolution, same pattern as CareerRole / Venture.
  logoSrc?: string;
  logoDomain?: string;
};
