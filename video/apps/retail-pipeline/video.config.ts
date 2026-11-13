// Everything tweakable for the retail analytics pipeline video. There's no screen recording
// (the app and its data are internal): each beat is a moment of the animated diagram in scene.tsx.
// Regions are px in the scene's 3200x1800 viewport (content drawn SHIFT_Y = 100 lower); `at` strings are the events below.
import type { VideoConfig } from "../../src/types";

const clip = (id: string, duration: number) => ({ id, file: "", duration });

// The dbt graph with its layer labels; the camera rests here for transform and new models.
const DBT = { x: 1400, y: 440, w: 1000, h: 900 };

const config: VideoConfig = {
  id: "retail-pipeline",
  title: "Retail Analytics Pipeline",
  description: "Trusted sales and ad data for a national jewelry brand",
  role: "Analytics engineer",
  logo: "retail-pipeline/wordmark.svg", // from alexandani.com
  logoHeight: 56,
  tags: ["dbt", "Snowflake", "Fivetran", "Looker"],
  url: "", // plain stage, no address bar
  colors: {
    background: "#F7F5F0",
    surface: "#FFFFFF",
    text: "#14201A",
    muted: "#5E6A63",
    accent: "#0F3325",
  },
  fps: 30,
  titleSeconds: 1.8,
  outroSeconds: 2,
  posterAt: 34.8, // 6c: charts drawn, teams in
  beats: [
    {
      clip: "01-sources",
      zoom: [{ at: 0, region: { x: 40, y: 483, w: 1300, h: 731 } }], // source cards centered
      board: 4.5,
      callout: {
        at: 0.3,
        label: "Five sources",
        text: "Shopify, Amazon and three ad platforms, each shaping its data differently.",
      },
    },
    {
      clip: "02-ingest",
      zoom: [{ at: 0, region: { x: 640, y: 520, w: 1060, h: 596 } }],
      board: 4.0,
      callout: {
        at: 0.3,
        label: "One warehouse",
        text: "Fivetran syncs every source into Snowflake on a schedule.",
      },
    },
    {
      clip: "03-transform",
      zoom: [{ at: 0, region: DBT }],
      board: 4.5,
      callout: {
        at: 0.3,
        label: "37 dbt models",
        text: "Raw tables are cleaned, combined and made business-ready.",
      },
    },
    {
      clip: "04-fixes",
      zoom: [
        { at: 0, region: { x: 1380, y: 100, w: 900, h: 506 } },
        { at: "out", region: DBT },
      ],
      board: [1.2, 4.8],
      callout: {
        at: 0.3,
        label: "Numbers that reconcile",
        text: "Refunds match orders, duplicate SKUs merge, and ad clicks count once.",
      },
    },
    {
      clip: "05-features",
      board: 4.5,
      callout: {
        at: 0.3,
        label: "New models",
        text: "Wholesale partner reporting, merchandising fields, and repeat purchase and lifetime value.",
      },
    },
    {
      clip: "06-explores",
      zoom: [
        { at: 0, region: { x: 2360, y: 621, w: 840, h: 472 } },
        { at: "pullback", region: null },
      ],
      board: [1.1, { event: "charts", offset: 0.5 }, 5.0, 7.8],
      callout: {
        at: 0.3,
        label: "Every team self-serves",
        text: "Merchandising, marketing and leadership pull trusted numbers from 8 Looker explores.",
      },
    },
  ],
  // The whole pipeline, settled, with dots flowing: 5s is two dot laps, so it loops seamlessly.
  loop: { beat: 5, from: 7.8, seconds: 5, region: null },
  capture: {
    viewport: { width: 3200, height: 1800 },
    clips: [
      // About 3 words a second for the callout, plus time for the diagram's own labels and motion.
      clip("01-sources", 5.5),
      clip("02-ingest", 5),
      clip("03-transform", 5.5),
      clip("04-fixes", 6.5),
      clip("05-features", 5.5),
      clip("06-explores", 8),
    ],
    events: {
      "04-fixes": { out: { t: 5.9 } },
      "06-explores": {
        cards: { t: 0.2 },
        charts: { t: 1.4 },
        teams: { t: 3.4 },
        pullback: { t: 6.0 },
      },
    },
  },
};

export default config;
