// Everything tweakable for the Wobble Coffee video. Regions are CSS px in the
// 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/wobble-coffee/events.json";

// Every beat is on screen for the same time, long enough to read its callout while
// watching; each beat's speed is fitted to its clip. The two finder beats run longer.
const BEAT = 6.5;
const events = capture.events as Record<string, Record<string, { t: number }>>;
/** Speed that plays `clip` from `start` (seconds, or an event label) to its end in `seconds`. */
function fit(clip: string, start: number | string, seconds = BEAT) {
  const s = typeof start === "number" ? start : events[clip][start].t;
  const duration = capture.clips.find((c) => c.id === clip)!.duration;
  return (duration - s) / seconds;
}

const productStart = events["03-product"].card.t - 0.3;
const FINDER = { x: 240, y: 130, w: 1440, h: 810 };

const config: VideoConfig = {
  id: "wobble-coffee",
  title: "Shopify Hydrogen Storefront",
  description: "A made-up Brooklyn coffee roaster, with brand, design and build all my own",
  role: "Solo project · design and development",
  logo: "wobble-coffee/logo.png",
  logoHeight: 150,
  tags: ["Shopify Hydrogen", "React Router", "Storefront API", "GSAP"],
  url: "", // runs locally; plain stage, no address bar
  // The store's own tokens (app/styles/tokens.css): apricot ground, espresso ink, tomato pop.
  colors: {
    background: "#FFD7A8",
    surface: "#FFFDF7",
    text: "#3B2A20",
    muted: "#7A5E4C",
    accent: "#FF6B4A",
  },
  fps: 30,
  titleSeconds: 3,
  outroSeconds: 2,
  posterAt: 18, // the product page, options picked
  beats: [
    {
      clip: "01-home",
      start: 0.4,
      speed: fit("01-home", 0.4),
      callout: {
        at: 0.4,
        label: "Brand",
        text: "Original branding, illustration and type, with a wordmark that wobbles.",
      },
      board: ["hero", { event: "coffees", offset: 0.8 }],
    },
    {
      clip: "02-shop",
      start: 0.4,
      speed: fit("02-shop", 0.4),
      zoom: [
        { at: 0, region: null },
        { at: { event: "filter", offset: -0.9 }, region: { x: 240, y: 380, w: 1300, h: 731 } },
      ],
      callout: {
        at: 0.4,
        label: "Filters",
        text: "Storefront API filters for type, roast and process, synced to the URL.",
      },
      board: { event: "filtered", offset: 0.5 },
    },
    {
      clip: "03-product",
      start: productStart,
      speed: fit("03-product", productStart),
      zoom: [
        { at: 0, region: null },
        { at: { event: "pdp", offset: 0.2 }, region: { x: 240, y: 190, w: 1440, h: 810 } }, // bag + options
      ],
      callout: {
        at: productStart,
        label: "Subscribe & save",
        text: "Pick a size and grind, or subscribe for 10% off. The bag label updates to match.",
      },
      board: ["pdp", { event: "subscribe", offset: 1 }],
    },
    {
      clip: "04-cart",
      speed: fit("04-cart", 0),
      zoom: [
        { at: 0, region: { x: 240, y: 270, w: 1440, h: 810 } }, // as low as the frame allows; the button sits at the fold
        { at: { event: "open-cart", offset: -0.6 }, region: null },
      ],
      callout: {
        at: 0,
        label: "Cart",
        text: "Optimistic add to cart, a drawer with quantity steppers and a free-shipping bar.",
      },
      board: [{ event: "add", offset: 0.8 }, { event: "drawer", offset: 1 }],
    },
    {
      clip: "05-finder",
      start: 0.6,
      speed: fit("05-finder", 0.6, 8.5),
      zoom: [{ at: 0, region: FINDER }],
      callout: {
        at: 0.6,
        label: "Coffee Finder",
        text: "Five questions score every coffee. The cup reacts to each answer you try.",
      },
      board: [{ event: "brew", offset: 6 }, { event: "milk", offset: 3 }],
    },
    {
      clip: "06-finder-more",
      speed: fit("06-finder-more", 0, 10),
      zoom: [{ at: 0, region: FINDER }],
      callout: {
        at: 0,
        label: "Mascot",
        text: "Every answer has its own pose, from berries to an all-day jitter. A match ends in a leap.",
      },
      board: [{ event: "adventure", offset: 4 }, { event: "result", offset: 1 }],
    },
    {
      clip: "07-brew",
      start: 0.4,
      speed: fit("07-brew", 0.4),
      zoom: [{ at: 0, region: { x: 240, y: 140, w: 1440, h: 810 } }], // title + calculator + timer
      callout: {
        at: 0.4,
        label: "Brew guides",
        text: "A dose-to-water calculator and a step-by-step brew timer.",
      },
      board: [{ event: "dose", offset: 1.5 }, { event: "start", offset: 3 }],
    },
  ],
  // Trying answers in the finder: the cup changes with every pick.
  loop: {
    beat: 4,
    from: { event: "brew", offset: 1 },
    seconds: 6,
    speed: 2,
    region: FINDER,
  },
  capture,
};

export default config;
