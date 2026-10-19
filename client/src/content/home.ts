export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  availability: "Available for select projects",
  lines: ["I build digital", "products that"],
  highlight: "mean something.",
  intro:
    "I’m Umar Farouq — a software engineer and product-minded builder turning thoughtful ideas into useful, dependable experiences on the web.",
  primaryCta: { label: "Explore my work", href: "#work" },
  secondaryCta: { label: "More about me", href: "#about" },
  visual: {
    top: "Independently built / 001",
    caption: "Systems thinking",
    title: "Ideas → Interfaces → Impact",
  },
} as const;

export interface Metric {
  value: string;
  label: string;
  accent?: boolean;
}

export const METRICS: readonly Metric[] = [
  { value: "More soon", label: "New work is on the way", accent: true },
  { value: "Full-stack", label: "From data to interface" },
  { value: "Building", label: "With purpose, not just hype" },
];

export const METRICS_HINT = { label: "Scroll to explore", href: "#work" } as const;

export const WORK = {
  eyebrow: "Selected work / 2024—2026",
  title: "A few things I’ve built.",
  description:
    "Real problems. Considered solutions. A little obsession with the details.",
  emptyMessage: "New projects are on the way.",
} as const;

export interface Principle {
  title: string;
  body: string;
}

export const ABOUT = {
  eyebrow: "A little about how I work",
  titleLines: ["Engineering is the tool.", "Impact is the point."],
  body: "I care about the space between a good idea and a product people can rely on. That means understanding the problem, making deliberate technical choices, and sweating the details that make software feel right.",
  principles: [
    {
      title: "Product thinking",
      body: "Start with the why. Build for a real person.",
    },
    {
      title: "Engineering rigor",
      body: "Simple architecture. Clear boundaries. Reliable systems.",
    },
    {
      title: "Details matter",
      body: "Accessible, responsive, considered experiences.",
    },
  ] satisfies readonly Principle[],
} as const;

export const TOOLKIT = {
  eyebrow: "Tools I reach for",
  title: "A practical toolkit.",
  items: [
    "TYPESCRIPT",
    "NEXT.JS",
    "REACT",
    "NODE JS",
    "EXPRESS",
    "POSTGRESQL",
    "DRIZZLE ORM",
    "REDIS",
    "DOCKER",
    "REST APIs",
    "GRAPHQL",
  ],
} as const;

export const CONTACT = {
  eyebrow: "Have a good problem?",
  titleLines: ["Let’s make", "something useful."],
  body: "Open to thoughtful collaborations, product ideas and engineering conversations.",
  cta: "Start a conversation",
} as const;

export const FOOTER_NOTE = "Designed with intention. Built with care.";