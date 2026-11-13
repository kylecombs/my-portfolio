// All site copy lives here. Experience source: LinkedIn (linkedin.com/in/kyledavidcombs), Oct 2026.
//
// Placeholders: any string wrapped in [brackets] is a TODO that renders as
// visible text, so it can't ship unnoticed. Links whose href is a placeholder
// render as plain text instead of a link (see isPlaceholder).

export interface Job {
  role: string;
  company: string;
  type: string;
  dates: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface ProjectMedia {
  type: "video" | "image";
  src: string;
  /** Still frame: shown before a video loads and instead of it under reduced motion. */
  poster: string;
  /** Collapsed-card still, when it should differ from the poster. */
  thumb?: string;
  alt: string;
  /** The video has sound: it still starts muted, with a mute/unmute button. */
  audio?: boolean;
}

export interface Project {
  title: string;
  context: string;
  year?: string;
  /** Problem and result are set for every selected project; older archive entries only have `built`. */
  problem?: string;
  built: string;
  result?: string;
  tags: string[];
  link?: { label: string; href: string };
  media?: ProjectMedia[];
}

export interface Service {
  title: string;
  description: string;
  tags: string[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface ContactLink {
  label: string;
  handle: string;
  href: string;
}

export function isPlaceholder(value: string) {
  return value.startsWith("[");
}

// Stand-in images until real project media is recorded.
// Keyed by Job.company / Project.context; entries without a logo render name only.
export const companyLogos: Record<string, string> = {
  CAMP: "/assets/logos/camp.svg",
  "ALEX AND ANI": "/assets/logos/alex-and-ani.png",
  "Arx Research": "/assets/logos/arx.svg",
  Rexby: "/assets/logos/rexby.svg",
};

export const availability = "Accepting new clients in 2027";

export const hero = {
  label: "Fullstack & Product Engineer",
  intro:
    "I’m a fullstack engineer who helps teams ship polished products: React frontends, Node and Rails APIs, Shopify apps, and data pipelines. I bring engineering, design, and product thinking to every project, and I work on contract in whatever shape fits, from a single project to an ongoing role on your team, so you get senior help without a full-time hire.",
};

export const services: Service[] = [
  {
    title: "Product frontends",
    description:
      "React and TypeScript apps that are fast, accessible and carefully designed, from rough idea or Figma file to production.",
    tags: ["React", "TypeScript", "Next.js", "Remix", "Tailwind CSS"],
  },
  {
    title: "Shopify",
    description:
      "Admin and POS extensions, custom apps, and Hydrogen storefronts, plus the integrations that connect Shopify to the rest of your business.",
    tags: ["Shopify", "Hydrogen", "Admin & POS extensions", "GraphQL"],
  },
  {
    title: "Backends & APIs",
    description:
      "Ruby on Rails and Node APIs, third-party integrations, and the unglamorous plumbing that keeps products running.",
    tags: ["Ruby on Rails", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Data & analytics",
    description:
      "Fivetran → dbt → Snowflake → Looker pipelines, reconciled against source systems so everyone trusts the numbers.",
    tags: ["dbt", "Snowflake", "Fivetran", "Looker / LookML", "SQL"],
  },
  {
    title: "AI workflows for dev teams",
    description:
      "Coding agents wired into your tickets, sandboxes and review process, so your team ships more without giving up control.",
    tags: ["Claude Agent SDK", "Linear", "Docker", "TypeScript"],
  },
];

export const howIWork: Principle[] = [
  {
    title: "The support you need.",
    description:
      "Contract work made to fit your needs. Available on a project basis or as an embedded member of your team, with experience to own real work without the cost of a full-time hire.",
  },
  {
    title: "Inside your tools.",
    description:
      "I work in your Slack, Linear or Jira, and GitHub, and I join meetings when that helps. Adaptable to fit into your business rhythms.",
  },
  {
    title: "Product-minded.",
    description:
      "If there’s no spec, I’ll write one. If the scope is wrong, I’ll say so early.",
  },
  {
    title: "Eastern time, async-friendly.",
    description:
      "Clear written updates, so you always know where things stand.",
  },
];

// *text* renders as <em>
export const about: { paragraphs: string[]; facts: Fact[] } = {
  paragraphs: [
    "I’m a fullstack engineer leading frontend at *CAMP* and building the analytics pipeline for *ALEX AND ANI*. I’m currently accepting new clients.",
    "I came to software from the art world. After receiving my BFA, I spent eight years as a preparator at David Zwirner, installing complex exhibitions and caring for the artworks in them. It taught me to sweat the details people only notice when they’re wrong.",
    "Since then I’ve shipped React frontends, Node and Rails APIs, AWS media pipelines and dbt/Snowflake warehouses, usually as one of two or three engineers who own the whole product. I’m based in Brooklyn and work remotely.",
  ],
  facts: [
    { label: "Based", value: "Brooklyn · Remote" },
    { label: "Working", value: "Contract, remote" },
    { label: "Focus", value: "Frontend, Shopify, Node and Rails APIs, data pipelines" },
    { label: "Currently", value: "CAMP · ALEX AND ANI" },
  ],
};

export const experienceLinks = {
  linkedin: "https://www.linkedin.com/in/kyledavidcombs/",
  // TODO: add the PDF to /public and set its path, e.g. "/kyle-combs-resume.pdf"
  resume: "[TODO: résumé file path]",
};

export const contact = {
  intro:
    "I’m currently booking contract work for 2027. Tell me a little about your team, what you’re building, and where you’re stuck. I’ll reply within one business day.",
  booking: {
    label: "Book a 15-min intro call",
    // The "30min" slug is Calendly's default; the event itself is 15 minutes.
    href: "https://calendly.com/kylecombsdev/30min",
  },
  links: [
    // TODO: switch to a domain email, e.g. hello@kylecombs.com
    {
      label: "Email",
      handle: "kylecombsdev@gmail.com",
      href: "mailto:kylecombsdev@gmail.com",
    },
    {
      label: "LinkedIn",
      handle: "in/kyledavidcombs",
      href: "https://www.linkedin.com/in/kyledavidcombs/",
    },
    {
      label: "GitHub",
      handle: "@kylecombs",
      href: "https://github.com/kylecombs",
    },
  ] satisfies ContactLink[],
};

export const experience: Job[] = [
  {
    role: "Lead Frontend Engineer",
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

/** Number of projects shown in Selected Work on the home page; the rest appear on /projects. */
export const selectedWorkCount = 8;

// TODO: add `media` (short screen-capture video + poster) to each project as it's recorded
export const projects: Project[] = [
  {
    title: "Experience Booking Flow",
    context: "CAMP",
    year: "2023–Present",
    problem:
      "The online booking flow is CAMP’s primary source of revenue and needed a UX rework and optimization. It handles thousands of reservations a month across 10 stores nationwide.",
    built:
      "I’ve owned the booking flow for years. I added upsells so families can buy products, souvenirs and extra activities while they book, with Shopify inventory synced per location, and made sure peak-day rushes can’t overbook a session. This year I helped spec the flow and rebuilt it as a streamlined multi-step checkout in React and TypeScript, on Rails APIs.",
    // TODO: swap "add-on sales grew" for the real upsell lift once it's pulled
    result:
      "After the relaunch, conversion climbed as much as 90% year over year, add-on sales grew, and the checkout’s Lighthouse score rose 20 points.",
    tags: ["React", "TypeScript", "Ruby on Rails", "Shopify"],
    // Generated by video/ (npm run export -- camp-booking)
    media: [
      {
        type: "video",
        src: "/assets/projects/camp-booking/web-1080.mp4",
        poster: "/assets/projects/camp-booking/poster.jpg",
        thumb: "/assets/projects/camp-booking/thumb.jpg",
        alt: "Booking a Bluey’s House visit: picking a date and time, adding two tickets and souvenir ears, then reaching checkout",
      },
    ],
  },
  {
    title: "Shopify Admin & POS Extensions",
    context: "CAMP",
    year: "2023–Present",
    problem:
      "Store teams managed reservations in a separate, self-hosted scheduling app that didn’t talk to the Shopify inventory and point of sale they used every day.",
    built:
      "We moved scheduling into Shopify itself: an embedded admin app and POS extensions where staff build activities and time slots, check customers in, reschedule and refund bookings, and manage add-ons, ticket bundles and activity content. I wrote custom discounts and promos with Shopify Functions and built a birthday party pipeline that turns online inquiries into leads staff can book and invoice, all kept in sync with the Rails backend.",
    result:
      "Every team, from store staff to marketing and growth, now manages reservations, activities, add-ons and birthday parties in one place.",
    tags: ["Shopify", "Shopify Functions", "React", "Ruby on Rails"],
    // Generated by video/ (npm run export -- shopify-admin); records a Polaris mock with made-up data
    media: [
      {
        type: "video",
        src: "/assets/projects/shopify-admin/web-1080.mp4",
        poster: "/assets/projects/shopify-admin/poster.jpg",
        thumb: "/assets/projects/shopify-admin/thumb.jpg",
        alt: "The CAMP app inside Shopify admin: bulk-updating time slot prices, turning an add-on off at one store, ticket bundles, and tracking an invoice on a birthday party lead",
      },
    ],
  },
  {
    title: "Retail Analytics Pipeline",
    context: "ALEX AND ANI",
    year: "2025–Present",
    problem:
      "A national jewelry brand selling online, wholesale and on Amazon needed sales and ad data from Shopify, Meta, Google, Amazon and Bing it could trust in one place.",
    built:
      "I took over the Fivetran, dbt, Snowflake and Looker stack and now own it. I’ve fixed refund discrepancies, ad metrics over-reporting and duplicated products and SKUs, and added wholesale partner reporting, merchandising fields, and repeat purchase and lifetime value analysis.",
    result:
      "Merchandising, marketing and leadership pull their own trusted numbers from 8 Looker explores built on 37 dbt models.",
    tags: ["dbt", "Snowflake", "Fivetran", "Looker"],
    // Generated by video/ (npm run export -- retail-pipeline)
    media: [
      {
        type: "video",
        src: "/assets/projects/retail-pipeline/web-1080.mp4",
        poster: "/assets/projects/retail-pipeline/poster.jpg",
        thumb: "/assets/projects/retail-pipeline/thumb.jpg",
        alt: "Animated diagram of the pipeline: five sales and ad sources sync through Fivetran into Snowflake, dbt models clean and reconcile the data, and Looker charts serve merchandising, marketing and leadership",
      },
    ],
  },
  {
    title: "IPFS Deploy for NFC Chips",
    context: "Arx Research",
    year: "2023",
    problem:
      "Brands using Arx’s NFC chips needed to launch and update the web experience behind a physical item without Arx’s engineers.",
    built:
      "A tool that deploys web apps to IPFS and links them to NFC chips through Arx’s on-chain redirect protocol (ERS).",
    result:
      "Brand partners could update a physical item’s experience without reissuing hardware.",
    tags: ["IPFS", "NFC", "ERS"],
    media: [
      {
        type: "video",
        src: "/assets/projects/arx-ipfs/web-1080.mp4",
        poster: "/assets/projects/arx-ipfs/poster.jpg",
        thumb: "/assets/projects/arx-ipfs/thumb.jpg",
        alt: "A replica of the deploy tool: pinning a web app to IPFS, linking six NFC hang tags to it through ERS, tapping one to open the app, then redeploying so the same tag opens a new version",
      },
    ],
  },
  {
    title: "Creator Tools & Map Editor",
    context: "Rexby",
    year: "2022",
    problem:
      "Travel influencers needed a way to turn their recommendations into guides travelers would pay for.",
    built:
      "Most of the creator app: profile editing, day-by-day itinerary authoring with photos, video and affiliate booking links, and an interactive Google Maps editor for pinning and organizing recommendations. I also wrote the GraphQL resolvers behind it and set up Cypress tests in CI.",
    result:
      "Creators could build, price and publish their own guides without help from Rexby’s team.",
    tags: ["Next.js", "TypeScript", "GraphQL", "Google Maps", "Cypress"],
    // Generated by video/ (npm run export -- rexby-creator), from a replica of the 2022 app
    media: [
      {
        type: "video",
        src: "/assets/projects/rexby-creator/web-1080.mp4",
        poster: "/assets/projects/rexby-creator/poster.jpg",
        thumb: "/assets/projects/rexby-creator/thumb.jpg",
        alt: "Building a South Iceland guide: adding a canyon spot with photos and an affiliate link, planning a two-day itinerary on the map, pricing it, and copying the map embed code",
      },
    ],
  },
  {
    title: "Video Upload Pipeline",
    context: "Rexby",
    year: "2022",
    problem:
      "Creators wanted video in their guides, but raw phone uploads were too heavy to stream well on mobile.",
    built:
      "An upload pipeline on AWS: videos go straight to S3, a Lambda hands them to MediaConvert for streaming formats, and the results play in creator profiles, guides and a mobile video grid.",
    result:
      "Video became a core part of creator profiles and guides, playing smoothly on any device.",
    tags: ["AWS S3", "Lambda", "MediaConvert"],
    // Generated by video/ (npm run export -- rexby-video), from a replica of the 2022 app
    media: [
      {
        type: "video",
        src: "/assets/projects/rexby-video/web-1080.mp4",
        poster: "/assets/projects/rexby-video/poster.jpg",
        thumb: "/assets/projects/rexby-video/thumb.jpg",
        alt: "Adding a phone video of Seljalandsfoss to a guide spot: uploading to S3, processing into streaming formats, picking a cover frame, and watching it play in the traveler view",
      },
    ],
  },
  {
    title: "Agent Coding Workflow",
    // TODO: confirm label and year
    context: "[Personal project · 2026]",
    problem:
      "Teams want AI coding agents but can’t let them push unreviewed code.",
    built:
      "A Python orchestrator that turns a one-line request or Linear ticket into a reviewed pull request. Claude agents write the spec, code and tests in a sandboxed Docker container, automated checks gate every round, and design, code and security reviewers must all pass before a PR opens. A human approves every spec and merges every PR.",
    result:
      "Dozens of merged PRs and thousands of lines of production code so far, saving hundreds of hours of developer time.",
    tags: ["Python", "Claude Code", "Linear", "Docker", "Playwright"],
    // Generated by video/ (npm run export -- agent-workflow); records the dashboard with mock tickets
    media: [
      {
        type: "video",
        src: "/assets/projects/agent-workflow/web-1080.mp4",
        poster: "/assets/projects/agent-workflow/poster.jpg",
        thumb: "/assets/projects/agent-workflow/thumb.jpg",
        alt: "The agent workflow dashboard: tickets moving across the board, signing off a spec, a job's workflow graph with its loop-backs, a design review with screenshots, and the pull request's diff and decision",
      },
    ],
  },
  {
    title: "ORA",
    // TODO: confirm label and year
    context: "[Personal project · 2026]",
    problem:
      "Modular synthesis usually means expensive hardware or desktop software, and it’s hard to make music with someone else in real time.",
    built:
      "A browser-based modular synth: patch modules together on a canvas and hear them instantly, with SuperCollider compiled to WebAssembly running all audio in the browser. Several people can edit one patch live while only the patch state syncs between them, and a built-in Claude assistant helps build patches.",
    result:
      "Live and free to try: 80+ synth modules, real-time multiplayer patching and an AI patch assistant, all in a browser tab with nothing to install.",
    tags: ["React", "WebAssembly", "SuperCollider", "WebSockets", "Claude API"],
    // Generated by video/ (npm run export -- ora)
    media: [
      {
        type: "video",
        src: "/assets/projects/ora/web-1080.mp4",
        poster: "/assets/projects/ora/poster.jpg",
        thumb: "/assets/projects/ora/thumb.jpg",
        alt: "Patching in ORA: booting the engine, cabling a saw oscillator to the output and a scope, loading a patch and moving its sliders, then a second person joining the room and editing live",
        audio: true,
      },
    ],
    link: { label: "Try it", href: "https://ora-fm.fly.dev/" },
  },
  {
    title: "Wobble Coffee Co.",
    // TODO: confirm label and year
    context: "[Personal project · 2026]",
    problem:
      "I wanted a Shopify showcase that goes past a theme: a full headless storefront with a brand of its own.",
    built:
      "A fictional Brooklyn roaster, from the brand, illustrations and bag art to a Shopify Hydrogen storefront on the Storefront API. It has URL-synced collection filters, product pages with size, grind and subscribe-and-save options, an optimistic cart, a five-question coffee finder, brew guides with a ratio calculator and timer, and a stockists map. A seed script loads the catalog, metafields and selling plans into Shopify, and an offline fixture store lets it run and test with no credentials.",
    result:
      "A complete storefront, tested with unit tests, Playwright and Lighthouse budgets, with every piece of branding and design done by me.",
    tags: ["Shopify Hydrogen", "React Router", "Storefront API", "GSAP", "Tailwind"],
    // Generated by video/ (npm run export -- wobble-coffee); records the store running locally
    media: [
      {
        type: "video",
        src: "/assets/projects/wobble-coffee/web-1080.mp4",
        poster: "/assets/projects/wobble-coffee/poster.jpg",
        thumb: "/assets/projects/wobble-coffee/thumb.jpg",
        alt: "Shopping the Wobble Coffee store: the wobbling wordmark, filtering the shop to coffee, choosing a size, grind and subscription for Hum, adding it to the cart, answering the coffee finder, and starting the pour-over brew timer",
      },
    ],
  },
  // Archive: shown on /projects only
  {
    title: "Browser FM Synthesizer",
    context: "Personal",
    year: "2021",
    built:
      "An FM synth that runs in the browser, built on the Web Audio API with a playable keyboard made in React and CSS.",
    tags: ["Web Audio API", "React", "CSS"],
    media: [
      {
        type: "video",
        src: "/assets/projects/fm-synth/web-1080.mp4",
        poster: "/assets/projects/fm-synth/poster.jpg",
        thumb: "/assets/projects/fm-synth/thumb.jpg",
        alt: "Playing the FM synth: a marimba melody and a glissando, switching presets to kalimba, sawz and slap bass, raising the octave slider, then bending a held bell note with the pitch wheel",
        audio: true,
      },
    ],
    link: { label: "Try it", href: "https://fmsynth.netlify.app/" },
  },
];
