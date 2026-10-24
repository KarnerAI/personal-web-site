import type { CareerRole } from "@/types";

// Pulled from Hussain's 2026 resume; laid out per the theme B v7 mockup
// (design-variants/2026-10-20-fullpage-productui-v7.html). Wording here wins
// over the mockup's (Series-A, co-founded). Verify copy before ship.
export const careerRoles: CareerRole[] = [
  {
    company: "Anheuser-Busch InBev",
    logo: "AB",
    logoSrc: "/logos/ab-inbev-tile.webp", // 176px copy; ab-inbev.png stays for the mockups
    startDate: "Jul 2012",
    endDate: "Jul 2018",
    startMonth: "2012-07",
    endMonth: "2018-07",
    yearsLabel: "2012 - 2018",
    tagline: "Ops & People Excellence",
    kpi: { lead: "45+", rest: "strategy workshops with VPs and Sr. Directors" },
    role: "Ops & People Excellence",
    location: "Newark, NJ → New York, NY",
    whyIWasThere:
      "First chapter out of UMass. Wanted to learn how a Fortune Global 500 company actually runs, from the brewhouse floor up to HR strategy.",
    heroBullet:
      "Led senior executives through **45+** strategy workshops to identify business pain points, set strategic priorities, and turn them into a unified roadmap to achieve business objectives and KPIs.",
    subBullets: [
      "Reduced HR master-data error rates from **7% to 1%** across 20,000 employees by building and designing an internal people product used by 125 HR Business Partners.",
      "Led 33 unionized operations staff across 3 shifts in a 450,000-case warehouse, improving pallet moves per hour by **9%** and exceeding on-time loading KPI targets by utilizing Lean Six Sigma principles.",
      "Led 22 operators producing 2.5M cans daily and improved extract loss KPI performance, delivering **$800K** in annual savings and helping Newark rank 1st among 12 North American breweries.",
    ],
    roles: [
      { title: "Operational Excellence Manager, North America, People COE", dates: "May 2016 - Jul 2018", loc: "New York, NY" },
      { title: "Process Improvement Engineer, North America", dates: "Sep 2014 - May 2016", loc: "New York, NY" },
      { title: "Group Manager, Logistics & Warehouse Ops", dates: "Aug 2013 - Sep 2014", loc: "Newark, NJ" },
      { title: "Group Manager, Brewhouse Operations", dates: "Jul 2012 - Aug 2013", loc: "Newark, NJ" },
    ],
  },
  {
    company: "KarnerBlu",
    logo: "KB",
    logoSrc: "/logos/karnerblu-logo-tile.webp", // full hexagon + butterfly + base from Logo-1.2.png, padded to a 256px square so nothing is cropped (karnerblu-mark-tile.webp stays for the mockups)
    startDate: "Jul 2018",
    endDate: "Sep 2020",
    startMonth: "2018-07",
    endMonth: "2020-09",
    yearsLabel: "2018 - 2020",
    tagline: "Founder Mode",
    kpi: { lead: "+30%", rest: "resource efficiency at Fortune 500s" },
    role: "Product Consultant · Co-Founder",
    location: "Remote + on-site",
    clients: [
      { name: "Unilever", logoSrc: "/logos/unilever.png" },
      { name: "Staples", logoSrc: "/logos/staples.png" },
    ],
    whyIWasThere:
      "Co-founded my own consultancy to work directly with Fortune 500s on execution systems. Faster loops, my own call sheet.",
    heroBullet:
      "Boosted resource-allocation efficiency **+30%** at Fortune 500 clients via a value-based project prioritization framework.",
    subBullets: [
      "Designed and launched a PMO across **7 departments** of Staples\u2019 corporate People team, giving executives one view of project status, governance, and delivery.",
      "Led a team of offshore designers to redesign **11** World Class Manufacturing posters and a custom logo for Unilever\u2019s Chicago plant ahead of a global audit, bringing lean principles to the shop floor.",
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
    yearsLabel: "2020 - 2022",
    tagline: "Startup Operator",
    kpi: { lead: "10× ARR", rest: "$500K → $5M, 8 markets" },
    role: "City Ops → Sr. Manager, Product Strategy & Ops",
    location: "New York, NY · 8 markets",
    whyIWasThere:
      "Series-A micromobility. Traded consulting decks for real P&L ownership and a team in the trenches.",
    heroBullet:
      "Scaled B2C subscription ARR **10×** ($500K → $5M) across 8 markets through 0-to-1 product launches, pricing strategy, lifecycle optimization, and full P&L ownership.",
    subBullets: [
      "Generated **$400K** in incremental revenue by launching a new eCommerce product, defining KPIs and go-to-market, and improving product offerings and rent-to-own conversion.",
      "Led cross-functional team of **5 direct / 40+ indirect** across 8 markets. Aligned OKRs to revenue and retention goals.",
      "Launched 4 North American markets; **+25%** onboarding efficiency through market analysis and cross-functional execution.",
      "As the 5th U.S. hire: **+22%** MoM WAU by redesigning subscription offerings; booking-to-subscription conversion 43% → 73% via A/B testing.",
      "Reduced e-bike theft **20%** with a new insurance product. Ranked 1st of 30 in the global data champions program (COO award).",
    ],
    roles: [
      { title: "Sr. Manager, Product Strategy & Operations", dates: "Aug 2021 - Nov 2022", loc: "New York, NY" },
      { title: "City Operations Mgr & Interim PM, B2B", dates: "Sep 2020 - Aug 2021", loc: "New York, NY" },
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
    yearsLabel: "2023 - Present",
    tagline: "Turnaround at Scale",
    kpi: { lead: "$14M", rest: "revenue, +60% YoY" },
    role: "Manager, Product Management, Global",
    location: "New York, NY · Global",
    whyIWasThere:
      "Signed three months before WeWork filed for bankruptcy. Friends said don't, headlines said worse. I believed in the people, the brand, and the rare shot at being part of a real turnaround.",
    heroBullet:
      "**$14M** revenue (+60% YoY) owning a global product portfolio. Helped deliver WeWork’s first profitable quarter across select product segments.",
    subBullets: [
      "Global Stripe payments: **$800K MRR** across 13 countries. Defined billing architecture for a scalable, compliant payments system.",
      "**$12M** annual revenue + 10% utilization lift across 315 locations via Gemini-powered pricing & inventory benchmarking.",
      "On-demand office workflows: **37%** YoY booking growth (50K vs 36K), +66% YoY credit spend through funnel optimization.",
      "LATAM on-demand private offices: identified unmet demand, secured COO buy-in, piloted in Mexico, scaled to **150 offices** and 900 incremental Q4 2025 bookings.",
    ],
  },
];
