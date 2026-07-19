export const heroAdjectives = [
  "Focused",
  "Creative",
  "Practical",
  "Growth-ready",
  "Modern",
  "Reliable",
] as const;

export const serviceListItems = [
  { label: "Website design & development", href: "/contact?service=websites" },
  { label: "Portfolio creation", href: "/contact?service=portfolio" },
  { label: "Poster & graphic design", href: "/contact?service=graphics" },
  { label: "Video & reels editing", href: "/contact?service=video" },
  { label: "Branding & digital identity", href: "/contact?service=branding" },
  { label: "Digital setup & launch", href: "/contact?service=setup" },
  { label: "Social media creatives", href: "/contact?service=graphics" },
  { label: "Business email setup", href: "/contact?service=setup" },
  { label: "Google Business Profile", href: "/contact?service=setup" },
  { label: "Ongoing website support", href: "/contact" },
] as const;

export const workflowSteps = [
  {
    number: "01",
    title: ["PROJECT", "STRATEGY"],
    description:
      "Every project starts with clarity. We map goals, audience, and scope with your team so the build stays focused, practical, and aligned with how your business actually works in Nepal.",
  },
  {
    number: "02",
    title: ["DESIGN", "& MOTION"],
    description:
      "We shape layouts, type, and motion that feel premium without getting complicated. Visual direction is built to present well on mobile, load fast, and stay easy to extend later.",
  },
  {
    number: "03",
    title: ["SMOOTH", "DEVELOPMENT"],
    description:
      "Clean structure, responsive pages, and reliable handoff. From contact flows to portfolio sections, every part is built to work smoothly across devices and stay maintainable.",
  },
  {
    number: "04",
    title: ["LAUNCH", "MARKETING"],
    description:
      "Launch is more than going live. We help you publish with the right setup profiles, email, social assets, and content structure so people understand your offer quickly.",
  },
  {
    number: "05",
    title: ["ONGOING", "SUPPORT"],
    description:
      "Your site keeps evolving. We stay available for updates, fixes, and small improvements so your digital presence stays current without starting from scratch every time.",
  },
  {
    number: "06",
    title: ["FUTURE", "EVOLUTION"],
    description:
      "We plan for what comes next new pages, campaigns, reels, or brand refreshes. The goal is a digital base you can keep building on as your business grows.",
  },
] as const;

export const resultCases = [
  {
    name: "Arvind Pandey",
    stat: "126",
    suffix: "%",
    prefix: "+",
    metric: "Engagement",
    image: "/work/arvindpandey.webp",
    imageAlt: "Arvind Pandey portfolio website",
  },
  {
    name: "Avenue Butwal",
    stat: "224",
    suffix: "%",
    prefix: "+",
    metric: "Sessions",
    image: "/work/avenue.webp",
    imageAlt: "Avenue Butwal education consultancy website",
  },
  {
    name: "Greenstar Suppliers",
    stat: "62",
    suffix: "%",
    prefix: "+",
    metric: "Conversions",
    image: "/work/green.webp",
    imageAlt: "Greenstar Suppliers website",
  },
] as const;
