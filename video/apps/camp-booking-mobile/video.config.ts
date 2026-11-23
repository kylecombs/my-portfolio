// The CAMP booking flow recorded at a phone viewport, for the site's mobile cut (composition camp-booking-mobile).
// Copy, colors and logo come from apps/camp-booking. The handset shows the whole 390x677 viewport, so no zooms.
import type { VideoConfig } from "../../src/types";
import desktop from "../camp-booking/video.config";
import capture from "../../public/camp-booking-mobile/events.json";

const copy = (label: string) => desktop.beats.find((b) => b.callout?.label === label)!.callout!;

const config: VideoConfig = {
  ...desktop,
  id: "camp-booking-mobile",
  device: "phone",
  posterAt: 13, // picking a date
  beats: [
    {
      clip: "01-product",
      start: 0.3,
      speed: 0.8,
      callout: {
        at: 0.3,
        label: "Product page",
        text: "Photos and info up front, with a Get Tickets button right under the gallery.",
      },
    },
    {
      clip: "02-schedule",
      url: "camp.com/new-york-city/activities/bluey-x-camp/booking/schedule",
      speed: 1.4,
      callout: { ...copy("Date & time"), at: 0.4 },
    },
    {
      clip: "03-people",
      speed: 1,
      callout: { ...copy("Ticket Select"), at: 0.3 },
    },
    {
      clip: "04-extras",
      start: { event: "add-to-cart", offset: -0.4 },
      end: { event: "checkout", offset: 0.4 },
      speed: 2,
      callout: { ...copy("Add-ons"), at: { event: "add-to-cart", offset: -0.2 } },
    },
    {
      clip: "05-checkout",
      speed: 0.8,
      callout: { ...copy("Checkout"), at: 0.2 },
    },
  ],
  // Unused (phone cuts have no hover loop); required by the type.
  loop: { beat: 3, from: "bluey-ears", seconds: 4, region: null },
  capture,
};

export default config;
