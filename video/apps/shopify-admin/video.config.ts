// Everything tweakable for the CAMP Shopify admin video. The capture records the Polaris mock in mock/
// (made-up data). Regions are CSS px in the 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/shopify-admin/events.json";

const MODAL = { x: 160, y: 130, w: 1600, h: 900 }; // Update Time Slots modal (CSS y ~146-1010 with the add-on list open)
const ADDONS = { x: 560, y: 150, w: 1300, h: 731 }; // Addons label + card

const config: VideoConfig = {
  id: "shopify-admin",
  title: "Shopify Admin & POS Extensions",
  description: "Reservations, add-ons and birthday parties, run inside Shopify",
  role: "Full-stack engineer",
  logo: "shopify-admin/logo.png",
  tags: ["Shopify", "Shopify Functions", "React", "Ruby on Rails"],
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
  notice: { text: "No sensitive data is shown in this demo. All data is mocked.", seconds: 2.5 },
  outroSeconds: 2,
  posterAt: 23, // includes the 2.5s notice
  beats: [
    {
      clip: "01-slots",
      start: 0.6,
      speed: 1.2,
      zoom: [
        { at: 0, region: null },
        { at: { event: "select-1", offset: -1 }, region: { x: 530, y: 280, w: 1300, h: 731 } },
      ],
      callout: {
        at: "table",
        label: "Time slots",
        text: "Every activity time slot across stores, with live prices, bookings and cancellations.",
      },
    },
    {
      clip: "02-update",
      speed: 1.4,
      zoom: [
        { at: { event: "update", offset: 0.3 }, region: MODAL },
        { at: { event: "save", offset: 0.4 }, region: { x: 530, y: 200, w: 1360, h: 765 } },
      ],
      board: ["price", { event: "addons", offset: 1 }, "updated"],
      callout: {
        at: "modal",
        label: "Update",
        text: "Select slots, then change prices, bundles and add-ons in one pass.",
      },
    },
    {
      clip: "03-addons",
      speed: 1.4,
      zoom: [
        { at: "edit-type", region: null },
        { at: { event: "addons", offset: -0.2 }, region: ADDONS },
        { at: { event: "addon-modal", offset: -0.2 }, region: { x: 300, y: 200, w: 1320, h: 742 } },
        { at: { event: "addon-save", offset: 0.3 }, region: ADDONS },
      ],
      board: ["addons", "location"],
      callout: {
        at: "addons",
        label: "Addons",
        text: "Shopify products sold with each booking, switched on or off per location.",
      },
    },
    {
      clip: "04-bundles",
      zoom: [{ at: { event: "bundles", offset: -0.4 }, region: { x: 560, y: 349, w: 1300, h: 731 } }],
      callout: {
        at: "bundles",
        label: "Ticket Bundles",
        text: "Tickets packaged with add-on slots, ordered by drag and drop.",
      },
    },
    {
      clip: "05-leads",
      speed: 1.1,
      zoom: [
        { at: "celebrations", region: null },
        { at: { event: "leads", offset: 0.8 }, region: { x: 530, y: 150, w: 1380, h: 776 } },
      ],
      callout: {
        at: { event: "leads", offset: 0.2 },
        label: "Celebration Leads",
        text: "Birthday party inquiries land here, each with its status at a glance.",
      },
    },
    {
      clip: "06-lead",
      speed: 1.3,
      end: { event: "invoiced", offset: 1.4 },
      zoom: [
        { at: 0, region: { x: 580, y: 80, w: 1300, h: 731 } },
        { at: { event: "invoices", offset: -0.4 }, region: { x: 450, y: 240, w: 1100, h: 619 } }, // invoices card (CSS y ~451-649)
        { at: { event: "invoiced", offset: -0.7 }, region: { x: 580, y: 60, w: 1300, h: 731 } },
      ],
      board: ["track", { event: "invoiced", offset: 0.6 }],
      callout: {
        at: { event: "lead-page", offset: 0.4 },
        label: "Track invoice",
        text: "Link the Shopify order and the lead moves to Customer Invoiced.",
      },
    },
  ],
  // Filling in the Update Time Slots modal.
  loop: {
    beat: 1,
    from: { event: "reason", offset: -0.4 },
    seconds: 6,
    region: MODAL,
  },
  capture,
};

export default config;
