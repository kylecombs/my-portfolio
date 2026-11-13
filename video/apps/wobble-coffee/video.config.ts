// Everything tweakable for the Wobble Coffee video. Regions are CSS px in the
// 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/wobble-coffee/events.json";

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
  titleSeconds: 1.8,
  outroSeconds: 2,
  posterAt: 14,
  beats: [
    {
      clip: "01-home",
      start: 0.4,
      speed: 1.2,
      callout: {
        at: "hero",
        label: "Brand",
        text: "Original branding, illustration and type, with a wordmark that wobbles.",
      },
      board: ["hero", { event: "coffees", offset: 0.8 }],
    },
    {
      clip: "02-shop",
      start: 0.8,
      speed: 1.1,
      zoom: [
        { at: 0, region: null },
        { at: { event: "filter", offset: -0.9 }, region: { x: 240, y: 380, w: 1300, h: 731 } },
      ],
      callout: {
        at: "filter",
        label: "Filters",
        text: "Storefront API filters for type, roast and process, synced to the URL.",
      },
      board: { event: "filtered", offset: 0.5 },
    },
    {
      clip: "03-product",
      start: 1.2,
      speed: 1.3,
      zoom: [
        { at: 0, region: null },
        { at: { event: "pdp", offset: 0.2 }, region: { x: 240, y: 190, w: 1440, h: 810 } }, // bag + options
      ],
      callout: {
        at: "size",
        label: "Subscribe & save",
        text: "Pick a size and grind, or subscribe for 10% off. The bag label updates to match.",
      },
      board: ["pdp", { event: "subscribe", offset: 1 }],
    },
    {
      clip: "04-cart",
      speed: 1.3,
      zoom: [
        { at: 0, region: { x: 240, y: 270, w: 1440, h: 810 } }, // as low as the frame allows; the button sits at the fold
        { at: { event: "open-cart", offset: -0.6 }, region: null },
      ],
      callout: {
        at: "add",
        label: "Cart",
        text: "Optimistic add to cart, a drawer with quantity steppers and a free-shipping bar.",
      },
      board: [{ event: "add", offset: 0.8 }, { event: "drawer", offset: 1 }],
    },
    {
      clip: "05-finder",
      start: 0.6,
      speed: 2,
      zoom: [{ at: 0, region: { x: 240, y: 130, w: 1440, h: 810 } }],
      callout: {
        at: "q1",
        label: "Coffee Finder",
        text: "Five questions score every coffee. The cup reacts to each answer.",
      },
      board: ["q3", { event: "result", offset: 1.5 }],
    },
    {
      clip: "06-brew",
      start: 0.4,
      speed: 1.2,
      zoom: [{ at: 0, region: { x: 240, y: 140, w: 1440, h: 810 } }], // title + calculator + timer
      callout: {
        at: "brew",
        label: "Brew guides",
        text: "A dose-to-water calculator and a step-by-step brew timer.",
      },
      board: [{ event: "dose", offset: 1.5 }, { event: "start", offset: 3 }],
    },
  ],
  // Answering the finder: the cup changes with every pick.
  loop: {
    beat: 4,
    from: "q2",
    seconds: 6,
    speed: 2,
    region: { x: 240, y: 130, w: 1440, h: 810 },
  },
  capture,
};

export default config;
