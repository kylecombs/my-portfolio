// Everything tweakable for the Rexby creator tool video. The capture records the replica in mock/ (made-up creator,
// Wikimedia Commons photos, Esri map tiles). Regions are CSS px in the 1920x1080 capture viewport; `at` strings are
// event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/rexby-creator/events.json";

const FORM = { x: 0, y: 72, w: 1440, h: 810 }; // spot form + the map pin (pin x ~1330)
const GRID = { x: 470, y: 80, w: 1420, h: 799 }; // guide tabs + first card rows

const config: VideoConfig = {
  id: "rexby-creator",
  title: "Creator Tools & Map Editor",
  description: "Travel creators turn their tips into guides they can sell",
  role: "Fullstack engineer",
  logo: "rexby-creator/logo.svg",
  logoHeight: 120,
  tags: ["Next.js", "TypeScript", "GraphQL", "Google Maps"],
  url: "", // plain stage, no address bar
  colors: {
    background: "#EEF5F7",
    surface: "#FFFFFF",
    text: "#14142B",
    muted: "#6E7191",
    accent: "#1282A6",
  },
  fps: 30,
  titleSeconds: 3.3,
  outroSeconds: 2,
  posterAt: 33.5, // itinerary with the day 2 route drawn
  beats: [
    {
      clip: "01-guide",
      start: 0.3,
      speed: 1.1,
      zoom: [
        { at: 0, region: null },
        { at: { event: "grid", offset: 0.6 }, region: GRID },
      ],
      callout: {
        at: "grid",
        label: "Guide",
        text: "A creator's profile, price and every spot they recommend, in one place.",
      },
    },
    {
      clip: "02-spot",
      start: 0.3,
      speed: 1.6,
      zoom: [
        { at: { event: "add", offset: 0.4 }, region: FORM },
        { at: { event: "google", offset: 0.2 }, region: { x: 400, y: 200, w: 1120, h: 630 } }, // photos modal
        { at: { event: "added", offset: 0.3 }, region: FORM },
      ],
      board: ["results", "pin", "photo-3"],
      callout: {
        at: "search",
        label: "Add spot",
        text: "Search a place to pin it on the map, then upload photos or pick from Google's suggestions.",
      },
    },
    {
      clip: "03-details",
      start: 0.8,
      end: { event: "saved", offset: 1.6 },
      speed: 2.2,
      zoom: [
        { at: 0, region: { x: 0, y: 300, w: 1200, h: 675 } },
        { at: { event: "save", offset: 0.4 }, region: null },
        { at: { event: "saved", offset: 0.2 }, region: GRID },
      ],
      board: ["hike", "aff", { event: "saved", offset: 1 }],
      callout: {
        at: "title",
        label: "Details",
        text: "Category, tips and an affiliate link, so travelers can book from the guide.",
      },
    },
    {
      clip: "04-itinerary",
      start: { event: "builder", offset: -0.3 },
      speed: 1.9,
      zoom: [{ at: { event: "builder", offset: -0.3 }, region: null }],
      board: ["name", "day1-3", "route"],
      callout: {
        at: "day1-1",
        label: "Create the Itinerary",
        text: "Pick spots day by day and the route draws itself on the map.",
      },
    },
    {
      clip: "05-price",
      speed: 1.5,
      zoom: [
        { at: { event: "price", offset: 0.3 }, region: { x: 480, y: 270, w: 960, h: 540 } },
        { at: { event: "continue", offset: 0.2 }, region: null },
        { at: { event: "shared", offset: 0 }, region: GRID },
      ],
      board: ["amount", { event: "shared", offset: 1 }],
      callout: {
        at: "price-modal",
        label: "Add Price",
        text: "Set a price, hit Share, and the itinerary is for sale on the guide.",
      },
    },
    {
      clip: "06-map",
      speed: 1.4,
      zoom: [
        { at: 0, region: GRID },
        { at: { event: "map", offset: 0.2 }, region: null },
        { at: { event: "embed", offset: 0.2 }, region: { x: 1000, y: 72, w: 920, h: 518 } },
      ],
      board: ["marker", "copy"],
      callout: {
        at: "mapview",
        label: "Map view",
        text: "Every spot on one map, with an embed code for the creator's own site.",
      },
    },
  ],
  // Building day 1: picking spots as the route draws.
  loop: {
    beat: 3,
    from: { event: "day1-1", offset: -0.4 },
    seconds: 6,
    region: null,
  },
  capture,
};

export default config;
