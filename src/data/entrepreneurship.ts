import type { Venture } from "@/types";

// PLACEHOLDER DATA — real copy to be filled in during the content phase.
// Four ventures: EmojiFriends, MIT Hackathon, Spots, Navigate.AI.
// Case-study fields will be written properly later; keeping reasonable stand-ins
// so the modal reads cleanly for layout review.
export const ventures: Venture[] = [
  {
    slug: "emojifriends",
    name: "EmojiFriends",
    logoInitials: "EF",
    coverGradient: "linear-gradient(135deg, #F6C85F 0%, #F47B7B 45%, #9A5CFF 100%)",
    coverEmoji: "😄",
    hook: "A Kickstarter-funded collectible line for the emoji generation.",
    status: "Shipped",
    tags: ["Kickstarter", "Anheuser-Busch", "Consumer"],
    externalUrl: "#",
    caseStudy: {
      problem:
        "PLACEHOLDER — why EmojiFriends existed, who it was for, the cultural moment it hit.",
      whatIBuilt:
        "PLACEHOLDER — the product, the manufacturing path, the Kickstarter launch, the Anheuser-Busch partnership.",
      outcome:
        "PLACEHOLDER — units shipped, funds raised, press, retail placement, what happened after.",
      lessons:
        "PLACEHOLDER — what I'd do differently on hardware, audience, and timing.",
    },
  },
  {
    slug: "mit-hackathon",
    name: "MIT Hackathon",
    logoInitials: "MIT",
    coverGradient: "linear-gradient(135deg, #8A0E2B 0%, #3D1C3F 55%, #0A1A2F 100%)",
    coverEmoji: "💻",
    hook: "Placeholder hook — the thing I built at the MIT hackathon and why it mattered.",
    status: "Shipped",
    tags: ["Hackathon", "MIT", "Prototype"],
    caseStudy: {
      problem:
        "PLACEHOLDER — the problem we chose and why, the team, the constraint.",
      whatIBuilt:
        "PLACEHOLDER — what the prototype actually did, the stack, the demo.",
      outcome:
        "PLACEHOLDER — placement, what judges said, what happened after the weekend.",
      lessons:
        "PLACEHOLDER — what a 48-hour build taught me that a quarter-long project didn't.",
    },
  },
  {
    slug: "spots",
    name: "Spots",
    logoInitials: "SP",
    coverGradient: "linear-gradient(135deg, #FFB86F 0%, #FF7A88 50%, #4F5BD5 100%)",
    coverEmoji: "📍",
    hook: "Social discovery for the places you love — and want to return to.",
    status: "Experimental",
    tags: ["Co-founder", "Consumer", "Social"],
    externalUrl: "#",
    caseStudy: {
      problem:
        "PLACEHOLDER — why existing place-discovery apps miss the repeat-visit use case.",
      whatIBuilt:
        "PLACEHOLDER — the core loop, the social graph bet, the MVP.",
      outcome:
        "PLACEHOLDER — early signal, users, retention, where it stands today.",
      lessons:
        "PLACEHOLDER — what I'd change about the wedge, the growth motion, or the category.",
    },
  },
  {
    slug: "navigate-ai",
    name: "Navigate.AI",
    logoInitials: "NA",
    coverGradient: "linear-gradient(135deg, #0F1E3D 0%, #2E4AA8 55%, #5EC6E5 100%)",
    coverEmoji: "🧭",
    hook: "Placeholder hook — what Navigate.AI is and the problem it tackles.",
    status: "Active",
    tags: ["Founder", "AI", "2025→"],
    externalUrl: "#",
    caseStudy: {
      problem:
        "PLACEHOLDER — the user, the workflow that's broken, what got worse with LLMs.",
      whatIBuilt:
        "PLACEHOLDER — the product shape, the wedge, the distribution play.",
      outcome:
        "PLACEHOLDER — current traction, users, what's working, what isn't yet.",
      lessons:
        "PLACEHOLDER — what building on LLMs in 2026 actually feels like.",
    },
  },
];
