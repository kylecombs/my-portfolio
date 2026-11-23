// The Wobble Coffee tour recorded at a phone viewport, for the site's mobile cut (composition wobble-coffee-mobile).
// Copy, colors and logo come from apps/wobble-coffee. The handset shows the whole 390x677 viewport, so no zooms.
import type { VideoConfig } from "../../src/types";
import desktop from "../wobble-coffee/video.config";
import capture from "../../public/wobble-coffee-mobile/events.json";

const BEAT = 6.5;
const events = capture.events as Record<string, Record<string, { t: number }>>;
/** Speed that plays `clip` from `start` (seconds, or an event label) to its end in `seconds`. */
function fit(clip: string, start: number | string, seconds = BEAT) {
  const s = typeof start === "number" ? start : events[clip][start].t;
  const duration = capture.clips.find((c) => c.id === clip)!.duration;
  return (duration - s) / seconds;
}
const copy = (label: string) => desktop.beats.find((b) => b.callout?.label === label)!.callout!;
const productStart = events["03-product"].card.t - 0.3;

const config: VideoConfig = {
  ...desktop,
  id: "wobble-coffee-mobile",
  device: "phone",
  posterAt: 18, // the product page, options picked
  beats: [
    { clip: "01-home", start: 0.4, speed: fit("01-home", 0.4), callout: { ...copy("Brand"), at: 0.4 } },
    {
      clip: "02-shop",
      start: 0.4,
      speed: fit("02-shop", 0.4),
      callout: { ...copy("Filters"), at: 0.4 },
    },
    {
      clip: "03-product",
      start: productStart,
      speed: fit("03-product", productStart),
      callout: { ...copy("Subscribe & save"), at: productStart },
    },
    { clip: "04-cart", speed: fit("04-cart", 0), callout: { ...copy("Cart"), at: 0 } },
    {
      clip: "05-finder",
      start: 0.6,
      speed: fit("05-finder", 0.6, 8.5),
      callout: { ...copy("Coffee Finder"), at: 0.6 },
    },
    {
      clip: "06-finder-more",
      speed: fit("06-finder-more", 0, 12),
      callout: { ...copy("Mascot"), at: 0 },
    },
    { clip: "07-brew", start: 0.4, speed: fit("07-brew", 0.4), callout: { ...copy("Brew guides"), at: 0.4 } },
  ],
  // Unused (phone cuts have no hover loop); required by the type.
  loop: { beat: 4, from: "brew", seconds: 4, region: null },
  capture,
};

export default config;
