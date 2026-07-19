/**
 * TEAM CONTENT CHECKLIST
 * Replace the placeholder values below with your real team information.
 * For each member:
 * 1. Change name, role, bio, location, email, skills, and project highlights.
 * 2. Replace `/public/team/member-0X.svg` with a square portrait using the
 *    same filename. The UI automatically crops it into a circle.
 * 3. Keep each slug unique because it becomes the portfolio URL:
 *    `/team/member-01`, `/team/member-02`, and so on.
 */
export type TeamMember = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  image: string;
  location: string;
  email: string;
  intro: string;
  bio: string;
  skills: string[];
  projects: Array<{
    title: string;
    type: string;
    year: string;
  }>;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "aashish-chapagain",
    name: "Aashish Chapagain",
    initials: "AC",
    role: "Full Stack + AI/ML (Lead)",
    image: "/team/member1.webp",
    location: "Butwal, Nepal",
    email: "aashish@yarshabyte.com",
    intro: "Leads technical architecture, AI integrations, and full-stack system design for robust platforms.",
    bio: "Focused on solving complex problems with scalable code, machine learning capabilities, and efficient backend architectures.",
    skills: ["Full Stack", "AI/ML", "Architecture", "System Design"],
    projects: [],
  },
  {
    slug: "anmol-chhetri",
    name: "Anmol Chhetri",
    initials: "AC",
    role: "Digital Marketing (Lead)",
    image: "/team/member2.webp",
    location: "Butwal, Nepal",
    email: "anmol@yarshabyte.com",
    intro: "Drives brand growth, market positioning, and high-conversion digital marketing strategies.",
    bio: "Specializes in data-driven marketing, campaign execution, and scaling brand presence across multiple digital channels.",
    skills: ["Digital Marketing", "Strategy", "Campaigns", "Growth"],
    projects: [],
  },
  {
    slug: "anupam-baral",
    name: "Anupam Baral",
    initials: "AB",
    role: "Digital Marketing / Video Editing / Mobile App",
    image: "/team/member3.webp",
    location: "Butwal, Nepal",
    email: "anupam@yarshabyte.com",
    intro: "Brings ideas to life through engaging video content, marketing execution, and mobile app development.",
    bio: "A versatile creative working at the intersection of media production, digital outreach, and mobile experiences.",
    skills: ["Video Editing", "Mobile Apps", "Marketing", "Content"],
    projects: [],
  },
  {
    slug: "amrit-bhhatarai",
    name: "Amrit Bhhatarai",
    initials: "AB",
    role: "Backend and System Designing",
    image: "/team/member4.webp",
    location: "Butwal, Nepal",
    email: "amrit@yarshabyte.com",
    intro: "Architects secure, high-performance backends and efficient database systems.",
    bio: "Passionate about clean code, server optimization, and building the foundational logic that powers seamless digital products.",
    skills: ["Backend", "Systems", "Databases", "APIs"],
    projects: [],
  },
  {
    slug: "beeplap-gharti-magar",
    name: "Beeplap Gharti Magar",
    initials: "BG",
    role: "Full Stack + UI/UX + QA (Overall)",
    image: "/team/member5.webp",
    location: "Butwal, Nepal",
    email: "beeplap@yarshabyte.com",
    intro: "Oversees the entire product lifecycle from user experience and UI design to full-stack code and quality assurance.",
    bio: "Ensures every project meets the highest standard of design, performance, and reliability before it reaches the user.",
    skills: ["UI/UX", "Full Stack", "QA", "Product Design"],
    projects: [],
  },
  {
    slug: "dinesh-lamichhane",
    name: "Dinesh Lamichhane",
    initials: "DL",
    role: "Digital Marketing + Advisor",
    image: "/team/member6.webp",
    location: "Butwal, Nepal",
    email: "dinesh@yarshabyte.com",
    intro: "Provides strategic advisory and deep digital marketing expertise to align projects with business goals.",
    bio: "A seasoned advisor focusing on long-term strategy, market insights, and maximizing the impact of digital initiatives.",
    skills: ["Advisory", "Marketing", "Strategy", "Consulting"],
    projects: [],
  },
];
