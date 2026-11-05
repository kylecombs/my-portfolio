// Everything tweakable for the Arx IPFS deploy video. The capture records the mock in mock/ (made-up project,
// chips and CIDs). Regions are CSS px in the 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/arx-ipfs/events.json";

const DEPLOY = { x: 260, y: 100, w: 1120, h: 630 }; // Build + Pin cards
const TABLE = { x: 245, y: 435, w: 1150, h: 647 }; // Link chips card (x 280-1360, y 543-975), centered
const PHONE = { x: 569, y: 160, w: 1351, h: 760 }; // phone preview

const config: VideoConfig = {
  id: "arx-ipfs",
  title: "IPFS Deploy for NFC Chips",
  description: "Deploy a web app to IPFS and point physical items at it",
  role: "Software engineer",
  logo: "arx-ipfs/logo.svg",
  logoHeight: 120,
  tags: ["IPFS", "NFC", "ERS", "Web3"],
  url: "", // plain stage, no address bar
  colors: {
    background: "#F1F5F3",
    surface: "#FFFFFF",
    text: "#0C0C0C",
    muted: "#6B7470",
    accent: "#1F7A06",
  },
  fps: 30,
  titleSeconds: 1.8,
  outroSeconds: 2,
  posterAt: 30.1, // the phone showing the opened app
  beats: [
    {
      clip: "01-project",
      zoom: [
        { at: 0, region: null },
        { at: { event: "build", offset: 1 }, region: DEPLOY },
      ],
      callout: {
        at: { event: "build", offset: 0.4 },
        label: "Build",
        text: "A brand's tap-to-open web app, built and ready to ship.",
      },
    },
    {
      clip: "02-pin",
      zoom: [{ at: 0, region: DEPLOY }],
      callout: {
        at: "deploy",
        label: "Deploy to IPFS",
        text: "The build is uploaded and pinned, and comes back as a content address.",
      },
      board: "cid",
    },
    {
      clip: "03-link",
      zoom: [
        { at: 0, region: TABLE },
        { at: { event: "link", offset: 0.3 }, region: null },
        { at: { event: "linked", offset: -1 }, region: TABLE },
      ],
      callout: {
        at: "select",
        label: "Link chips",
        text: "Pick the chips, sign once, and each one's ERS record points at the new build.",
      },
      board: ["modal", { event: "linked", offset: 0.6 }],
    },
    {
      clip: "04-tap",
      zoom: [{ at: 0, region: PHONE }],
      callout: {
        at: "tap",
        label: "Tap",
        text: "A phone reads the chip, ERS resolves it on-chain, and the app opens. No app to install.",
      },
      board: [{ event: "resolve", offset: 2.5 }, { event: "app", offset: 0.6 }],
    },
    {
      clip: "05-update",
      zoom: [
        { at: 0, region: DEPLOY },
        { at: { event: "updated", offset: -1.2 }, region: TABLE },
      ],
      callout: {
        at: "v13",
        label: "Redeploy",
        text: "A new version updates every linked chip's record in the same step.",
      },
      board: [{ event: "redeploy", offset: 0.5 }, "updated"],
    },
    {
      clip: "06-retap",
      zoom: [{ at: 0, region: PHONE }],
      callout: {
        at: "retap",
        label: "Same tag, new experience",
        text: "The jacket already on the shelf opens the new drop. No hardware reissued.",
      },
      board: { event: "app2", offset: 0.6 },
    },
  ],
  // Tap → resolve → app opening on the phone.
  loop: {
    beat: 3,
    from: "tap",
    seconds: 5,
    region: PHONE,
  },
  capture,
};

export default config;
