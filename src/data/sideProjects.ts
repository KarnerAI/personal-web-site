import type { SideProject } from "@/types";

// PLACEHOLDER DATA — flagged in DevBanner.
// Six tiles to populate the Option C bento grid (public/sideprojects-comparison.html#c).
// Real project list to be filled in by Hussain during content phase.
export const sideProjects: SideProject[] = [
  {
    name: "Claude Commuter",
    description:
      "Daily agent that drafts my NYC subway commute plan, accounting for weekend service changes and weather.",
    techStack: ["Claude Code", "Vercel Cron", "MTA API"],
    liveUrl: "#",
    githubUrl: "#",
    size: "feature",
  },
  {
    name: "Palette Lock",
    description:
      "A tiny tool that generates a locked design system from one seed color and two reference photos.",
    techStack: ["Next.js", "TypeScript", "CSS vars"],
    liveUrl: "#",
    githubUrl: "#",
    size: "tall",
  },
  {
    name: "Founder Letters",
    description:
      "Weekly one-page emails to early-stage founders I used to meet. Written as personal letters, not newsletters.",
    techStack: ["Resend", "MDX"],
    liveUrl: "#",
    size: "wide",
  },
  {
    name: "Mentor Match",
    description:
      "Matches high-school mentees in my youth program with alumni based on interest graphs, not just majors.",
    techStack: ["Python", "SvelteKit"],
    githubUrl: "#",
    size: "wide",
  },
  {
    name: "Run of Show",
    description:
      "Event day-of playbook generator for small festivals. Replaces the 15-tab Google Sheet.",
    techStack: ["Remix", "Supabase"],
    liveUrl: "#",
    size: "sq",
  },
  {
    name: "Kanji Diner",
    description:
      "Anki-style deck that teaches Japanese menu kanji with real photos from Tokyo izakayas.",
    techStack: ["iOS", "SwiftUI"],
    size: "sq",
  },
];
