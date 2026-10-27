// Source: LinkedIn experience (linkedin.com/in/kyledavidcombs), Oct 2026.

export interface Job {
  role: string;
  company: string;
  type: string;
  dates: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface Project {
  title: string;
  context: string;
  year: string;
  description: string;
  tags: string[];
}

export const experience: Job[] = [
  {
    role: "Lead Front End Engineer",
    company: "CAMP",
    type: "Contract",
    dates: "Jan 2023 – Present",
    location: "New York · Remote",
    highlights: [
      "Lead frontend engineer on a two-person team, owning customer-facing web apps end to end in React and TypeScript",
      "Build and maintain the Ruby on Rails APIs behind reservations, ticketing, and e-commerce",
      "Built Shopify admin extensions and point-of-sale integrations for scheduling, reservations, and discounts",
      "Handle product management alongside engineering: specs, prioritization, and working with ops and marketing",
    ],
    skills: ["React", "TypeScript", "Ruby on Rails", "Shopify"],
  },
  {
    role: "Data Engineer",
    company: "ALEX AND ANI",
    type: "Contract",
    dates: "Oct 2025 – Present",
    location: "Remote",
    highlights: [
      "Build and maintain the analytics pipeline for a national jewelry and lifestyle brand: Fivetran, dbt, Snowflake, Looker",
      "Resolve discrepancies between Shopify and Snowflake order data so reported revenue matches the source systems",
      "Model sales and marketing data in dbt to power inventory, merchandising, and channel reporting",
      "Develop LookML views and explores that give business teams self-serve access to trusted metrics",
      "Migrated Fivetran and dbt connections to Snowflake key-pair authentication ahead of the enforcement deadline",
    ],
    skills: ["dbt", "Snowflake", "Fivetran", "Looker"],
  },
  {
    role: "Software Engineer",
    company: "Arx Research",
    type: "Contract",
    dates: "Mar 2023 – Jul 2023",
    location: "Remote",
    highlights: [
      "Built a developer tool for deploying web apps to IPFS and linking them to Arx’s NFC chips, so tapping a physical item opens its web experience",
      "Connected deployed apps to chips through Arx’s on-chain redirect protocol (ERS), so experiences update without reissuing hardware",
      "Let brand partners launch and update their own tap-to-open experiences without relying on Arx’s engineering team",
    ],
    skills: ["IPFS", "NFC", "Web3"],
  },
  {
    role: "Fullstack Engineer",
    company: "Rexby",
    type: "Full-time",
    dates: "Mar 2022 – Jan 2023",
    location: "Remote",
    highlights: [
      "Owned frontend development across the traveler-facing app and the creator tools influencers used to build and sell guides",
      "Built most of the creator application, including profile editing, guide authoring, and an interactive Google Maps editor",
      "Designed a video upload and transcoding pipeline on AWS (S3, Lambda, MediaConvert)",
      "Shipped quickly as part of a small, early-stage team following Techstars",
    ],
    skills: ["React", "Redux", "Node.js", "AWS"],
  },
  {
    role: "Software Engineering Teaching Fellow",
    company: "Fullstack Academy",
    type: "Full-time",
    dates: "Sep 2021 – Mar 2022",
    location: "New York City",
    highlights: [
      "Taught JavaScript and the PERN stack to a cohort of 60+ students",
      "Managed student projects from ideation to deployment as project manager, technical mentor, and code reviewer",
      "Mentored students one-on-one on JavaScript fundamentals, debugging, and problem-solving",
    ],
    skills: ["JavaScript", "TypeScript", "PERN"],
  },
  {
    role: "Preparator",
    company: "David Zwirner",
    type: "Full-time",
    dates: "Feb 2013 – Aug 2021",
    location: "New York",
    highlights: [
      "Worked directly with artists and artworks to realize complex exhibitions, handling the condition and preservation of works",
    ],
    skills: ["Exhibitions", "Art handling"],
  },
];

export const projects: Project[] = [
  {
    title: "Reservations & Ticketing",
    context: "CAMP",
    year: "2023–",
    description:
      "Customer-facing booking, ticketing, and e-commerce flows in React and TypeScript, backed by Rails APIs I build and maintain.",
    tags: ["React", "TypeScript", "Ruby on Rails"],
  },
  {
    title: "Shopify Admin & POS Extensions",
    context: "CAMP",
    year: "2023–",
    description:
      "Admin extensions and point-of-sale integrations that let staff manage scheduling, reservations, and discounts inside Shopify.",
    tags: ["Shopify", "React", "Ruby on Rails"],
  },
  {
    title: "Retail Analytics Pipeline",
    context: "ALEX AND ANI",
    year: "2025–",
    description:
      "End-to-end pipeline from Fivetran ingestion through dbt models in Snowflake to LookML explores, reconciled against Shopify so revenue numbers can be trusted.",
    tags: ["dbt", "Snowflake", "Fivetran", "Looker"],
  },
  {
    title: "Tap-to-Open Deploy Tool",
    context: "Arx Research",
    year: "2023",
    description:
      "Deploys web apps to IPFS and links them to NFC chips via an on-chain redirect protocol, so brands can update a physical item’s experience without new hardware.",
    tags: ["IPFS", "NFC", "ERS"],
  },
  {
    title: "Creator Tools & Map Editor",
    context: "Rexby",
    year: "2022",
    description:
      "Guide authoring, profile editing, and an interactive Google Maps editor for placing and organizing travel recommendations.",
    tags: ["React", "Redux", "Google Maps"],
  },
  {
    title: "Video Transcoding Pipeline",
    context: "Rexby",
    year: "2022",
    description:
      "Upload and transcoding pipeline on AWS so creators could add video to their profiles and guides.",
    tags: ["AWS S3", "Lambda", "MediaConvert"],
  },
  {
    title: "Browser FM Synthesizer",
    context: "Personal",
    year: "2021",
    description:
      "An FM synth that runs in the browser, built on the Web Audio API with a playable keyboard made in React and CSS.",
    tags: ["Web Audio API", "React", "CSS"],
  },
  {
    title: "Webfluence",
    context: "Fullstack Academy",
    year: "2021",
    description:
      "Interactive network visualization of politicians and their campaign donors, built with a team as a capstone project.",
    tags: ["React", "Redux", "Node.js", "Postgres", "Vis.js"],
  },
];
