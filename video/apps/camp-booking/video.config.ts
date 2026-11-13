// Everything tweakable for the CAMP booking flow video. Regions are CSS px in the
// 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/camp-booking/events.json";

// Schedule page's summary + calendar columns (CSS y ~323-1024), centered with a small margin.
const COLUMNS = { x: 285, y: 240, w: 1351, h: 760 };

// The gallery's Mux video, laid over the capture where it plays (box measured from the 02-video clip).
// Fetch: ffmpeg -i https://stream.mux.com/y4C01eeYAbMm1TEJDQdOV1azUvEQ9coN3xblVQP5O006w.m3u8 -map 0:v:0 -c copy public/camp-booking/clips/gallery-source.mp4
const GALLERY_VIDEO = {
  src: "camp-booking/clips/gallery-source.mp4",
  box: { x: 300, y: 138, w: 708, h: 531 },
  radius: 10,
  filter: "brightness(1.09)", // the capture renders it ~9% brighter (fit against the old render's frames)
  controls: { duration: 16.93 },
};

// Both columns with the add-ons card (CSS y ~147-906) centered.
const EXTRAS = { x: 160, y: 77, w: 1600, h: 900 };

const config: VideoConfig = {
  id: "camp-booking",
  title: "Experience Booking Flow",
  description: "Multi-step checkout for CAMP’s immersive experiences",
  role: "Full-stack engineer",
  logo: "camp-booking/logo.png",
  tags: ["React", "TypeScript", "Ruby on Rails", "Shopify"],
  url: "camp.com/new-york-city/blueys-house",
  colors: {
    background: "#F7F5F0",
    surface: "#FFFFFF",
    text: "#14201A",
    muted: "#5E6A63",
    accent: "#0F3325",
  },
  fps: 30,
  titleSeconds: 3,
  outroSeconds: 2,
  posterAt: 39, // shifted by the longer title card and Ticket Select beat
  beats: [
    {
      clip: "01-gallery",
      start: 0.4,
      speed: 1.15,
      zoom: [
        {
          at: { event: "scrolled", offset: -0.6 },
          region: { x: 270, y: 61, w: 1380, h: 776 },
        },
      ],
      callout: {
        at: "scrolled",
        label: "Product page",
        text: "Photos, video and info up front, with a Get Tickets CTA.",
      },
    },
    {
      clip: "02-video",
      zoom: [
        {
          at: { event: "play", offset: 0.2 },
          region: { x: 67, y: 74, w: 1173, h: 660 }, // gallery video centered
        },
      ],
      callout: {
        at: { event: "play", offset: 0.4 },
        label: "Video in the gallery",
        text: "A short video shows families the experience before they buy.",
      },
      // The screencast drops frames while the page plays video; draw the source over it once it has slid in.
      inset: { ...GALLERY_VIDEO, from: 1.8, sourceAt: -0.92 },
    },
    {
      clip: "03-schedule",
      url: "camp.com/new-york-city/activities/bluey-x-camp/booking/schedule",
      speed: 1.15,
      inset: { ...GALLERY_VIDEO, to: 2.0, sourceAt: 4.97 }, // until the page navigates
      zoom: [
        { at: "get-tickets", region: null },
        // Zoomed out on the columns as the schedule page appears, then into the calendar.
        { at: { event: "schedule", offset: -0.1 }, region: COLUMNS },
        {
          at: { event: "date", offset: -1.2 },
          region: { x: 822, y: 389, w: 806, h: 453 }, // the calendar around the clicked date
        },
        // Back out before the page scrolls, so the camera and the scroll don't move at once.
        { at: { event: "date", offset: 0.3 }, region: COLUMNS },
        {
          at: { event: "times", offset: 0.1 },
          region: { x: 310, y: 6, w: 1300, h: 731 }, // both columns down to Next, above the footer (CSS y ~737)
        },
      ],
      board: [
        { event: "schedule", offset: 0.9 },
        "date",
        { event: "date", offset: 0.7 },
        "time",
      ],
      callout: {
        at: { event: "schedule", offset: 0.3 },
        label: "Date & time",
        text: "A live calendar shows each day’s price, with deals and special ticket types highlighted.",
      },
    },
    {
      clip: "04-people",
      url: "camp.com/new-york-city/activities/bluey-x-camp/booking/tickets",
      speed: 0.8, // slowed so the callout has time to be read
      zoom: [
        {
          at: { event: "ga-1", offset: -1.2 },
          region: { x: 295, y: 0, w: 1330, h: 748 },
        },
      ],
      callout: {
        at: { event: "ga-1", offset: -0.6 },
        label: "Ticket Select",
        text: "Choose from several ticket types, including bundles with merch and activity add-ons.",
      },
    },
    {
      clip: "05-extras",
      url: "camp.com/book",
      speed: 1.3,
      // Cut right after the checkout click; the Shopify load wait is in the tail.
      end: { event: "checkout", offset: 0.4 },
      board: [
        { event: "bluey-ears", offset: -1 },
        { event: "checkout", offset: -0.1 },
      ],
      zoom: [
        {
          at: { event: "bluey-ears", offset: -2 },
          region: EXTRAS,
        },
        // After the scroll, ease down so the Continue button (y ~984-1032) is in frame for the click.
        {
          at: { event: "checkout", offset: -1 },
          region: { x: 160, y: 150, w: 1600, h: 900 },
        },
      ],
      callout: {
        at: { event: "bluey-ears", offset: -1 },
        label: "Add-ons",
        text: "Souvenirs go in the cart in one tap, with Shopify inventory synced for each location.",
      },
    },
    {
      clip: "06-checkout",
      url: "shop.camp.com/checkouts",
      speed: 0.5, // short static clip; slowed so the callout has time to be read
      zoom: [{ at: 0.3, region: { x: 310, y: 26, w: 1300, h: 731 } }],
      callout: {
        at: 0.5,
        label: "Checkout",
        text: "The cart and its seat hold carry straight through to Shopify checkout.",
      },
    },
  ],
  // Window between the Extras page settling and the scroll to checkout.
  loop: {
    beat: 4,
    from: { event: "bluey-ears", offset: -1.4 },
    seconds: 6,
    speed: 0.95,
    region: EXTRAS,
  },
  capture,
};

export default config;
