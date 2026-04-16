import type { Book, Hobby, Podcast, TravelData } from "@/types";

// PRD §6.5 — hobbies, travel, books, podcasts.

export const hobbies: Hobby[] = [
  { emoji: "🥋", label: "Martial Arts" },
  { emoji: "🤝", label: "Youth Mentor" },
  { emoji: "🏍️", label: "Riding & Driving" },
  { emoji: "💃", label: "Music Festivals & Salsa" },
];

export const travel: TravelData = {
  countryCount: 16,
  favoriteCountry: "Colombia",
  nationality: "🇧🇩 Bangladesh",
  caption:
    "“The world is a book and those who do not travel read only one page.” — Saint Augustine",
  visitedCountryCodes: [], // TODO: populate with ISO codes
};

export const books: Book[] = [
  {
    title: "Disciplined Entrepreneurship",
    author: "Bill Aulet",
    why: "", // TODO
  },
  { title: "The Innovator's Dilemma", author: "Clayton Christensen", why: "" },
  { title: "The Lean Startup", author: "Eric Ries", why: "" },
  { title: "Atomic Habits", author: "James Clear", why: "" },
  { title: "Designing Your Life", author: "Bill Burnett & Dave Evans", why: "" },
];

export const podcasts: Podcast[] = [
  { name: "How I Built This", host: "Guy Raz" },
  { name: "Founder's Journal", host: "Alex Lieberman" },
  { name: "HBR IdeaCast" },
  { name: "Think Fast, Talk Smart" },
];
