import type { Venture } from "@/types";

// Four ventures: EmojiFriends, SpreadTheFacts (MIT Hackathon), Spots, Navigate.AI.
// Copy sourced from LinkedIn, Notion STAR stories, SpreadTheFacts pitch deck,
// and the Navigate.AI GTM doc. Curly punctuation throughout.
export const ventures: Venture[] = [
  {
    slug: "emojifriends",
    name: "EmojiFriends",
    logoInitials: "EF",
    coverGradient: "linear-gradient(135deg, #F6C85F 0%, #F47B7B 45%, #9A5CFF 100%)",
    coverEmoji: "😄",
    hook: "A Kickstarter-funded collectible line for the emoji generation.",
    status: "Shipped",
    tags: ["Kickstarter", "EDM", "Consumer Hardware"],
    externalUrl: "#",
    caseStudy: {
      problem:
        "By 2015, emoji had become a second language for anyone under 30 — but the physical world hadn’t caught up. The EDM festival scene had a decade-old tradition of trading kandi beads with strangers as a form of connection. The bracelets were still stuck in 2005 visual language: smiley faces, peace signs, block letters. No one had brought the emoji vocabulary into the thing people were actually wearing on their wrists.",
      whatIBuilt:
        "A line of collectible emoji-face beads designed for the kandi-trading culture, manufactured overseas and sold direct-to-consumer. I ran the Kickstarter from concept to fulfillment: product design, factory sourcing, campaign video, reward tiers, pricing, and the post-funding logistics of getting thousands of beads into envelopes. Built the brand on Instagram with zero paid spend — the product photographed well enough that the community did the distribution.",
      outcome:
        "Raised just over $6,000 on Kickstarter from a cold-start audience. Featured on Insomniac.com, the largest EDM publication at the time. Grew past 1,200 organic Instagram followers and shipped to customers across the US, UK, and Australia. The brand built a small but real community of repeat buyers who would message photos from festivals months later.",
      lessons:
        "Hardware margins are brutal once you factor in shipping envelopes one at a time. The smart next move would have been a subscription drop model or a licensing deal with a festival brand — not another SKU. I also learned how much of “going viral” is really just a product that’s photogenic enough to survive compression on someone else’s feed.",
    },
  },
  {
    slug: "spreadthefacts",
    name: "SpreadTheFacts",
    logoInitials: "STF",
    coverGradient: "linear-gradient(135deg, #8A0E2B 0%, #3D1C3F 55%, #0A1A2F 100%)",
    coverEmoji: "🧵",
    hook: "Won the MIT COVID-19 Hackathon, then turned the prototype into 6,500 masks on the ground.",
    status: "Shipped",
    tags: ["MIT", "Hackathon", "Public Health"],
    externalUrl: "#",
    caseStudy: {
      problem:
        "48 hours into the pandemic lockdown, MIT ran a hackathon focused on improving access to information for vulnerable populations. My team’s first instinct was to build a “better CDC website” — cleaner UI on top of the same firehose of advisories. I disagreed. The real problem wasn’t that the information was ugly; it was that the people who needed it most weren’t going to a website at all.",
      whatIBuilt:
        "I was the minority voice in the room, and when I spoke up I wasn’t being heard. So I scheduled a session with the hackathon moderators to pressure-test the direction. Judge feedback came back aligned with my read. I led the team through a design-thinking exercise to redefine the problem around a specific audience — essential workers who needed PPE, not pamphlets — and we pivoted hard. The output was a pitch to crowdfund and distribute reusable cotton masks directly to frontline staff, paired with plain-language CDC-sourced hygiene guidance.",
      outcome:
        "Won the hackathon after a grueling 48 hours. Raised $5,500 in follow-on funding and partnered with Mass General Brigham to distribute 6,500 reusable masks to healthcare workers, grocery employees, and transit staff across the Boston area. The project kept going after the weekend ended, which is the only outcome that really matters from a hackathon.",
      lessons:
        "Being the dissenting voice in a team room is useless unless you have a mechanism to force the conversation. Scheduling the moderator session was the whole ballgame — without that, we would have shipped a nicer-looking CDC website and lost. Also: in a crisis, the fastest path from idea to impact is physical goods, not software.",
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
        "Google Maps is a utility. Yelp is a review directory. Neither of them answers the question you actually ask your friends: “Where should I take someone tonight?” The best place recommendations happen inside group chats and disappear there — unindexed, unsearchable, and lost the second the conversation scrolls. Repeat-visit behavior had no product surface at all.",
      whatIBuilt:
        "Co-founded Spots as a social discovery app — Pinterest for places, with a social graph layered on top of Google Maps. Prototyped the full experience in Sketch and InVision, ran early user-testing sessions through Instabug’s user groups, and iterated through three rounds of wireframes before any code shipped. The wedge was collections: let people save, tag, and share the places that were already living in their Notes app.",
      outcome:
        "Landed the spotsapp.io domain and shipped a working prototype to a small test group. Got useful signal on the save-and-share loop but never cracked the cold-start problem of social graphs — the thing you need to actually test whether a social-discovery app is fun. Shelved it when Navigate.AI started demanding full attention.",
      lessons:
        "Location-based social is a graveyard of well-designed apps. The product wasn’t the hard part; seeding the graph was. If I ran this back, I’d start with a single city, a single use case (date night, probably), and a closed invite list — not a general-purpose map overlay.",
    },
  },
  {
    slug: "navigate-ai",
    name: "Navigate.AI",
    logoInitials: "NA",
    coverGradient: "linear-gradient(135deg, #0F1E3D 0%, #2E4AA8 55%, #5EC6E5 100%)",
    coverEmoji: "🧭",
    hook: "Your career pivot, backed by real data — not AI guesses.",
    status: "Active",
    tags: ["Founder", "AI", "2025→"],
    externalUrl: "https://gonavigate.app",
    caseStudy: {
      problem:
        "LLMs made resume writing worse, not better. Every “AI resume tool” on the market spits out the same bland, impact-free bullets because the model has no idea whether the claim is true, whether the metric is defensible, or whether the phrasing actually lands with a recruiter. Career-changers — the people who need the most help — get the least signal. They don’t know which of their experiences translate, and generic AI can’t tell them.",
      whatIBuilt:
        "Navigate.AI scores every resume bullet on three dimensions — Impact, Context, and Structure — against a corpus of real, outcomes-graded writing. Instead of hallucinating new accomplishments, the product surfaces the weak spots in what you already wrote and guides you through placeholder-based enhancement: the user fills in the specifics, the tool tightens the craft. Co-founded with Laurenz; shipping the closed beta under navigate.ai and gonavigate.app.",
      outcome:
        "Closed beta running April 19 – May 3, 2026, targeting 50–100 signups with an activation-rate north star of ≥50%. Built on top of a framework that started life as a 2025 hackathon win (Resume Optimizer, ideation score 11/15). Early tester feedback is clustering around the same insight: “I didn’t realize how vague my own bullets were.”",
      lessons:
        "Still learning this one in real time. The biggest thing so far: people don’t want an AI that writes for them — they want one that calls them out. Honest feedback is a scarcer resource than generated text, and the product-market fit question is whether people will pay to be told their resume is weaker than they think.",
    },
  },
];
