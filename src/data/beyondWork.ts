import type { Book, Hobby, Podcast, TravelData, VisitedCountry } from "@/types";

// PRD §6.5 — hobbies, travel, books, podcasts.
// Hobbies, travel count, favorite country, nationality are REAL
// (per Hussain's profile memory). Books & podcasts below are PLACEHOLDER —
// flagged in DevBanner until Hussain provides a confirmed list.

// Hobbies — Magazine Mosaic (design-shotgun approved 2026-04-22).
// First entry renders as the 2×2 hero tile; remaining four fill the mosaic.
// Reorder to promote a different hobby to hero. When real photos land, point
// each `hero.src` at `/images/hobbies/{slug}-hero.jpg` and drop gallery images
// into the same folder.
//
// `story` and `meta` are seeded with honest placeholders Hussain can swap for
// his own copy — they're plausible but not load-bearing claims.
export const hobbies: Hobby[] = [
  {
    slug: "riding",
    label: "Riding & driving",
    tagline: "Three days disconnected through the hills of Colombia.",
    story: [
      "Three days on a motorcycle through the mountains outside Medellín. Went with a friend I've known since I was fourteen — the same friend who taught me to ride. The loop was Medellín → Salgar → Jericó → Fredonia and back, two long riding days bookending a day at a coffee farm in the hills.",
      "No cell service for most of it. You don't realize how much of your attention the phone quietly costs you until you spend three days without one — I love technology and build with it for a living, but getting fully off it for a stretch is the cleanest reset I've found.",
      "The coffee farm in Jericó was the highlight. I spent six years at Anheuser-Busch watching beer get made at scale, and it was grounding to see the same shape of craft — fermentation, aging, a thousand small choices — mapped onto coffee instead. Different product, same instinct. Our host was also a chef and cooked every meal, which doesn't fit neatly in a motorcycle story but was somehow the best part.",
    ],
    meta: [
      { label: "Route", value: "Medellín → Jericó → Fredonia" },
      { label: "Days", value: "3" },
      { label: "Rode with", value: "Friend since age 14" },
    ],
    embed: {
      src: "https://www.google.com/maps/d/embed?mid=1OyXj6bPJXS677fD6peBqAic3mLXtM-E&ehbc=2E312F",
      title: "Colombia motorcycle route: Medellín → Salgar → Jericó → Fredonia",
      caption: "The actual route — 2-Day Colonial Cruisin' with Adrenaline Addicts.",
      aspectRatio: "4 / 3",
    },
  },
  {
    slug: "building-ai",
    label: "Building with AI",
    tagline: "Products, agents, automation. Always shipping.",
    story: [
      "I use AI to collapse the distance between \u201CI wonder if...\u201D and \u201Chere's a working thing.\u201D Most of what I build now starts in a CLI session with Claude and ends as a prototype I can show a real user the same week.",
      "This site is one of them. Built live with Claude Code. The mosaic you're looking at right now? AI wrote the scaffolding. I wrote the taglines.",
    ],
    meta: [
      { label: "Stack", value: "Claude, Cursor, v0" },
      { label: "Cadence", value: "Weekly shipping" },
      { label: "Latest", value: "This site" },
    ],
  },
  {
    slug: "martial-arts",
    label: "Martial arts",
    tagline: "BJJ, 4x/week. Purple belt.",
    story: [
      "BJJ teaches you that composure is a muscle. Four nights a week I go get outclassed by blue belts half my age, and every time I leave the mat sharper than I arrived.",
      "Currently drilling leg entanglements. Next stripe is the long game.",
    ],
    meta: [
      { label: "Belt", value: "Purple" },
      { label: "Frequency", value: "4x / week" },
      { label: "Focus", value: "Leg entanglements" },
    ],
  },
  {
    slug: "mentor",
    label: "Youth mentor",
    tagline: "8 years in NYC. Mentee just graduated college.",
    story: [
      "Matched with my mentee when he was 12 through a NYC youth program. He just graduated college. Best meeting on my calendar, every other Saturday, for eight years running.",
      "If you're early-career and on the fence about mentoring a kid — do it. The return on one good afternoon a month is absurd.",
    ],
    meta: [
      { label: "Years", value: "8" },
      { label: "City", value: "New York" },
      { label: "Cadence", value: "Bi-weekly" },
    ],
  },
  {
    slug: "festivals",
    label: "Festivals & salsa",
    tagline: "Coachella, Afropunk. Salsa Saturdays in Bushwick.",
    story: [
      "Live music is how I reset. Coachella and Afropunk every year, smaller festivals whenever the lineup earns the flight.",
      "Saturday nights I'm at salsa socials in Bushwick. You don't need to be good. You need to show up.",
    ],
    meta: [
      { label: "Regular", value: "Coachella · Afropunk" },
      { label: "Weekly", value: "Bushwick salsa" },
    ],
  },
];

// Positioned visited countries on the 480×240 stylized world SVG.
// Coordinates chosen roughly to match the continent dot-matrix below.
// 16 plotted to match the confirmed countryCount of 16.
export const visitedCountries: VisitedCountry[] = [
  { code: "US", name: "United States", x: 92, y: 66 },
  { code: "CA", name: "Canada", x: 88, y: 46 },
  { code: "MX", name: "Mexico", x: 86, y: 88 },
  { code: "CO", name: "Colombia", x: 116, y: 118, fav: true },
  { code: "BR", name: "Brazil", x: 130, y: 144 },
  { code: "GB", name: "United Kingdom", x: 232, y: 62 },
  { code: "FR", name: "France", x: 238, y: 74 },
  { code: "ES", name: "Spain", x: 228, y: 84 },
  { code: "IT", name: "Italy", x: 254, y: 82 },
  { code: "NL", name: "Netherlands", x: 244, y: 64 },
  { code: "DE", name: "Germany", x: 252, y: 68 },
  { code: "BD", name: "Bangladesh", x: 328, y: 108 },
  { code: "IN", name: "India", x: 316, y: 108 },
  { code: "JP", name: "Japan", x: 392, y: 86 },
  { code: "TH", name: "Thailand", x: 344, y: 118 },
  { code: "AE", name: "UAE", x: 292, y: 104 },
];

export const travel: TravelData = {
  countryCount: 16,
  cityCount: 32,
  favoriteCountry: "Colombia",
  favoriteFlag: "🇨🇴",
  favoriteCity: "Mexico City",
  favoriteCityFlag: "🇲🇽",
  nationality: "Bangladeshi-American",
  nationalityFlag: "🇧🇩🇺🇸",
  caption:
    "“The world is a book and those who do not travel read only one page.” — Saint Augustine",
  visitedCountryCodes: visitedCountries.map((c) => c.code),
  visited: visitedCountries,
  base: "New York, NY",
  nextUp: "Turkey, September 2026",
};

// Stylized continent dot-matrix background for the map.
// Not geographically precise — purely decorative.
export const continentBgDots: Array<[number, number]> = [
  // North America
  [60, 50], [72, 50], [84, 50], [96, 50], [108, 55], [68, 62], [80, 62], [92, 62], [104, 62], [116, 68], [76, 74], [88, 74], [100, 74], [112, 80], [96, 86],
  // South America
  [118, 110], [124, 120], [128, 132], [130, 144], [132, 156], [134, 168], [130, 180],
  // Europe
  [230, 62], [240, 62], [250, 62], [236, 70], [246, 70], [256, 70], [242, 78], [252, 78],
  // Africa
  [240, 100], [250, 100], [260, 110], [248, 118], [258, 126], [264, 136], [254, 146], [260, 158], [252, 168],
  // Middle East
  [276, 92], [282, 100], [288, 108],
  // Asia
  [300, 70], [312, 70], [324, 70], [336, 72], [348, 74], [360, 78], [304, 82], [316, 82], [328, 84], [340, 86], [352, 90], [316, 96], [330, 98], [342, 102], [352, 106], [340, 114], [350, 120],
  // Australia
  [392, 166], [402, 166], [412, 170], [398, 176], [408, 178],
];

export const books: Book[] = [
  {
    title: "Working in Public",
    author: "Nadia Eghbal",
    why: "Reframed how I think about shipping small things.",
  },
  {
    title: "The Art of Doing Science",
    author: "Richard Hamming",
    why: "For the chapter on “You and Your Research.”",
  },
  {
    title: "Crossing the Chasm",
    author: "Geoffrey A. Moore",
    why: "Every PM should re-read it every two years.",
  },
];

export const podcasts: Podcast[] = [
  { name: "Acquired", host: "Ben & David", art: "ACQ" },
  { name: "Invest Like the Best", host: "Patrick O’Shaughnessy", art: "ILB" },
  { name: "Lenny’s Podcast", host: "Lenny Rachitsky", art: "LNY" },
  { name: "Dwarkesh Patel", host: "Dwarkesh Patel", art: "DWK" },
];
