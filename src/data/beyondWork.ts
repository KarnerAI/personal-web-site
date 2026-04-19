import type { Book, Hobby, Podcast, TravelData, VisitedCountry } from "@/types";

// PRD §6.5 — hobbies, travel, books, podcasts.
// Hobbies, travel count, favorite country, nationality are REAL
// (per Hussain's profile memory). Books & podcasts below are PLACEHOLDER —
// flagged in DevBanner until Hussain provides a confirmed list.

export const hobbies: Hobby[] = [
  { emoji: "🥋", label: "Martial arts", note: "BJJ, 4x/week" },
  { emoji: "🤝", label: "Youth mentor", note: "8 years, NYC" },
  { emoji: "🏍️", label: "Riding & driving", note: "Manual only" },
  { emoji: "💃", label: "Festivals & salsa", note: "Coachella, Afropunk" },
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
  nextUp: "Lisbon, May 2026",
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
    why: 'For the chapter on "You and Your Research."',
  },
  {
    title: "Crossing the Chasm",
    author: "Geoffrey A. Moore",
    why: "Every PM should re-read it every two years.",
  },
];

export const podcasts: Podcast[] = [
  { name: "Acquired", host: "Ben & David", art: "ACQ" },
  { name: "Invest Like the Best", host: "Patrick O'Shaughnessy", art: "ILB" },
  { name: "Lenny's Podcast", host: "Lenny Rachitsky", art: "LNY" },
  { name: "Dwarkesh Patel", host: "Dwarkesh Patel", art: "DWK" },
];
