import type { CareerRole } from "@/types";

// Pulled from Hussain's 2026 resume. Matches the data used in the approved
// career-comparison mockup (public/career-comparison.html, Variant C).
// Verify copy before ship.
export const careerRoles: CareerRole[] = [
  {
    company: "Anheuser-Busch InBev",
    logo: "AB",
    logoSrc: "/logos/ab-inbev.png",
    startDate: "Jul 2012",
    endDate: "Jul 2018",
    startMonth: "2012-07",
    endMonth: "2018-07",
    yearsLabel: "2012 – 2018",
    role: "Operations → Operational Excellence",
    location: "Newark, NJ → New York, NY",
    whyIWasThere:
      "First chapter out of UMass. Wanted to learn how a global Fortune 100 actually runs — from the brewhouse floor up to HR strategy.",
    heroBullet:
      "Reduced people-data error rates 7% → 1% across 20,000 employees by re-engineering the master-data platform used by 125+ HR partners.",
    subBullets: [
      "Led 45+ executive workshops that converted pain points into a unified 1-year strategy roadmap aligned to corporate KPIs.",
      "Earlier brewhouse ops: #1 of 12 breweries on KPI leaderboard; $800K/year savings; led 22-operator team brewing 2.5M cans daily.",
      "Logistics & warehouse ops: +9% pallet moves/hour across a 450K-case warehouse and 33 union operators on 3 shifts.",
    ],
    roles: [
      { title: "Group Manager, Brewhouse Operations", dates: "Jul 2012 – Aug 2013", loc: "Newark, NJ" },
      { title: "Group Manager, Logistics & Warehouse Ops", dates: "Aug 2013 – Sep 2014", loc: "Newark, NJ" },
      { title: "Process Improvement Engineer, North America", dates: "Sep 2014 – May 2016", loc: "New York, NY" },
      { title: "Operational Excellence Manager, People COE", dates: "May 2016 – Jul 2018", loc: "New York, NY" },
    ],
  },
  {
    company: "KarnerBlu",
    logo: "KB",
    logoSrc: "/logos/karnerblu.png", // drop the file at public/logos/karnerblu.png (icon-only version works best for the small chip)
    startDate: "Jul 2018",
    endDate: "Sep 2020",
    startMonth: "2018-07",
    endMonth: "2020-09",
    yearsLabel: "2018 – 2020",
    role: "Product Consultant · Co-Founder",
    location: "Remote · Staples, Unilever",
    whyIWasThere:
      "Co-founded my own consultancy to work directly with Fortune 500s on execution systems — faster loops, my own call sheet.",
    heroBullet:
      "Boosted resource-allocation efficiency +30% at Fortune 500 clients via a value-based project prioritization framework.",
    subBullets: [
      "Built an execution operating system across 7 departments — translating stakeholder needs into workflows, cadences, and KPI reporting.",
      "Clients included Staples and Unilever. Remote + on-site hybrid.",
    ],
  },
  {
    company: "Zoomo",
    logo: "ZM",
    logoDomain: "ridezoomo.com",
    startDate: "Sep 2020",
    endDate: "Nov 2022",
    startMonth: "2020-09",
    endMonth: "2022-11",
    yearsLabel: "2020 – 2022",
    role: "City Ops → Sr. Manager, Product Strategy & Ops",
    location: "New York, NY · 8 markets",
    whyIWasThere:
      "Series-B micromobility. Traded consulting decks for real P&L ownership and a team in the trenches.",
    heroBullet:
      "Scaled B2C subscription ARR 10× ($500K → $5M) across 8 markets through pricing strategy, lifecycle optimization, and full P&L ownership.",
    subBullets: [
      "As the 5th U.S. hire: +22% MoM WAU by redesigning subscription offerings; booking-to-subscription conversion 43% → 73% via A/B testing.",
      "Led cross-functional team of 5 direct / 40+ indirect across 8 markets. Aligned OKRs to revenue and retention goals.",
      "Launched 4 North American markets; +25% onboarding efficiency through market analysis and cross-functional execution.",
      "Reduced e-bike theft 20% with a new insurance product — 1st of 30 in the global data champions program (COO award).",
    ],
    roles: [
      { title: "City Operations Mgr & Interim PM, B2B", dates: "Sep 2020 – Aug 2021", loc: "New York, NY" },
      { title: "Sr. Manager, Product Strategy & Operations", dates: "Aug 2021 – Nov 2022", loc: "New York, NY" },
    ],
  },
  {
    company: "WeWork",
    logo: "WW",
    logoDomain: "wework.com",
    startDate: "Jul 2023",
    endDate: "Present",
    startMonth: "2023-07",
    endMonth: "Present",
    yearsLabel: "2023 – Present",
    role: "Manager, Product Management, Global",
    location: "New York, NY · 13 countries",
    whyIWasThere:
      "Global product ownership at scale — 13 countries, multi-market pricing, and payments infrastructure. Biggest surface area of my career.",
    heroBullet:
      "$14M revenue (+60% YoY) owning the global parking vertical across 13 countries — helped deliver WeWork’s first profitable quarter.",
    subBullets: [
      "Global Stripe payments: $800K MRR across 13 countries. Defined billing architecture for a scalable, compliant payments system.",
      "$12M annual revenue + 10% utilization lift across 315 locations via Gemini-powered pricing & inventory benchmarking.",
      "On-demand office workflows: 37% YoY booking growth (50K vs 36K), +66% YoY credit spend through funnel optimization.",
      "LATAM on-demand private offices: identified unmet demand, secured COO buy-in, piloted in Mexico, scaled to 150 offices and 900 incremental Q4 2025 bookings.",
    ],
  },
];

// Proportional timeline math lives in the component — epoch = first role's startMonth,
// end = TODAY (2026-04 for this build).
export const TIMELINE_EPOCH_YEAR = 2012;
export const TIMELINE_EPOCH_MONTH = 7;
export const TIMELINE_TODAY = { year: 2026, month: 4 } as const;
