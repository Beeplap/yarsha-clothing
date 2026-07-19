import {
  BadgeCheck,
  Clapperboard,
  Code2,
  MailCheck,
  Palette,
  PenTool,
} from "lucide-react";

export const services = [
  {
    slug: "websites",
    category: "Build",
    title: "Website Design & Development",
    description:
      "Business websites, landing pages, portfolio websites, e-commerce basics, plus domain and hosting setup.",
    outcome: "A polished web presence ready to share with customers.",
    timeline: "10-21 days",
    stat: "01 launch system",
    deliverables: [
      "Responsive page design",
      "Conversion-ready content flow",
      "Contact and WhatsApp actions",
      "Domain and hosting guidance",
    ],
    accent: "from-sky via-blue to-accent",
    featured: true,
    icon: Code2,
  },
  {
    slug: "portfolio",
    category: "Build",
    title: "Portfolio Creation",
    description:
      "Personal, student, creator, and professional CV-style websites with clear proof of work.",
    outcome: "A premium profile that helps people trust your skills quickly.",
    timeline: "5-12 days",
    stat: "Proof-first profile",
    deliverables: [
      "Case-study structure",
      "CV and profile sections",
      "Project gallery",
      "Social/contact handoff",
    ],
    accent: "from-blue via-sky to-accent",
    icon: BadgeCheck,
  },
  {
    slug: "graphics",
    category: "Create",
    title: "Poster & Graphic Design",
    description:
      "Social media posters, banners, ads, event posters, and brand visuals for regular campaigns.",
    outcome: "Scroll-stopping creatives shaped for local audiences.",
    timeline: "2-5 days",
    stat: "Campaign-ready visuals",
    deliverables: [
      "Posters and banners",
      "Offer-focused ad creatives",
      "Event visual direction",
      "Export sizes for social",
    ],
    accent: "from-accent via-blue to-sky",
    icon: PenTool,
  },
  {
    slug: "video",
    category: "Create",
    title: "Video & Reels Editing",
    description:
      "Short-form reels, business promos, event edits, cinematic cuts, and ad creatives.",
    outcome: "Clean edits that help offers feel sharper and more memorable.",
    timeline: "3-7 days",
    stat: "Motion-led stories",
    deliverables: [
      "Reels and promos",
      "Captions and pacing",
      "Music and sound polish",
      "Social-ready exports",
    ],
    accent: "from-navy via-blue to-sky",
    icon: Clapperboard,
  },
  {
    slug: "branding",
    category: "Shape",
    title: "Branding & Digital Identity",
    description:
      "Logo direction, color system, typography, brand kit, and online visual consistency.",
    outcome: "A practical identity system your team can actually use.",
    timeline: "7-14 days",
    stat: "Brand kit included",
    deliverables: [
      "Logo direction",
      "Color and type system",
      "Social visual rules",
      "Reusable brand assets",
    ],
    accent: "from-sky via-blue to-navy",
    icon: Palette,
  },
  {
    slug: "setup",
    category: "Launch",
    title: "Digital Setup",
    description:
      "Google Business Profile, business email, social media page setup, and launch support.",
    outcome: "The essential setup pieces handled without confusion.",
    timeline: "2-6 days",
    stat: "Launch support",
    deliverables: [
      "Google Business Profile",
      "Business email setup",
      "Social page setup",
      "Launch checklist",
    ],
    accent: "from-accent via-sky to-blue",
    icon: MailCheck,
  },
];

export const servicesIntro = {
  eyebrow: "Services",
  title: "Digital services that make Nepali businesses look credible fast.",
  description:
    "Pick one focused service or combine them into a launch-ready online presence for your shop, consultancy, creator brand, or local company.",
};

export const serviceHighlights = [
  "Mobile-first delivery",
  "Business-ready copy flow",
  "Local market context",
  "Launch support included",
];
