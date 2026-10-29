// Scripted tour of the CAMP booking flow. Run: npm run capture camp-booking
// Note: reaching checkout creates a real cart that holds 2 GA seats for ~10 min. Nothing is purchased.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(
  new URL("../../public/camp-booking", import.meta.url)
);

// "chrome" rather than bundled Chromium: the gallery video is H.264/HLS, which Chromium can't play.
// Without these, Chrome's screencast sends 1x frames of only the top 1920x993, which the recorder stretched.
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--window-size=1920,1080", "--force-device-scale-factor=2"],
});
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});
await installCursor(context);
const page = await context.newPage();

// Off camera: load, dismiss the newsletter popup, back to the top.
await page.goto("https://camp.com/new-york-city/blueys-house", {
  waitUntil: "load",
});
await page
  .getByText("Maybe later")
  .click({ timeout: 15000 })
  .catch(() => console.warn("no popup"));
await page.waitForTimeout(1500);
await page.evaluate("scrollTo(0, 0)");

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const thumbs = page.locator("button.rounded-full.overflow-hidden");

rec.clip("01-gallery");
await h.moveTo({ x: 1100, y: 640 });
await h.wait(500);
await h.scrollTo(page.locator("text=Tickets Selling Fast").first(), 150);
await rec.event("scrolled", thumbs.first());
for (const i of [1, 2, 3]) await h.click(thumbs.nth(i), `thumb-${i + 1}`, 1000);

rec.clip("02-video");
await h.click(thumbs.nth(4), "play", 0);
await h.wait(5000);

rec.clip("03-schedule");
await h.click(
  page.getByRole("button", { name: /Get Tickets/ }).first(),
  "get-tickets",
  0
);
await page.waitForURL(/booking\/schedule/);
await page.getByText("1. Select Date").waitFor();
await rec.event("schedule");
await h.wait(2000); // hold zoomed out on the columns, then zoom into the calendar
const slot = page
  .locator("button")
  .filter({ hasText: /^\d{1,2}:\d{2}(AM|PM)/ })
  .first();
// About a week out keeps away from sold-out days; step forward if a day has no slots.
const days = page.locator("button:has-text('$'):enabled");
for (let n = 7; ; n++) {
  await h.click(days.nth(n), "date", 600);
  if (await slot.isVisible({ timeout: 3000 }).catch(() => false)) break;
}
await h.wait(1000); // room for the camera to zoom back out before the scroll
await h.scrollTo(page.getByText("2. Select Time"), 160);
await rec.event("times", page.getByText("2. Select Time"));
await h.wait(1000); // and to zoom in on the slots before the click
await h.click(slot, "time", 900);

rec.clip("04-people");
await h.click(
  page.getByRole("button", { name: /Next: Number of People/ }),
  "next",
  0
);
await page.waitForURL(/booking\/tickets/);
await h.wait(1000);
const ga = page
  .locator("div")
  .filter({ hasText: /General Admission/ })
  .filter({ has: page.getByRole("button", { name: "Increase quantity" }) })
  .last();
await h.scrollTo(ga, 300);
const plus = ga.getByRole("button", { name: "Increase quantity" });
await h.click(plus, "ga-1", 500);
await h.click(plus, "ga-2", 1100);

rec.clip("05-extras");
await h.click(
  page.getByRole("button", { name: "Add to Cart" }),
  "add-to-cart",
  0
);
await page.waitForURL(/\/book\//);
const add = (name: RegExp) =>
  page
    .locator("div")
    .filter({ hasText: name })
    .filter({ has: page.getByRole("button", { name: "+ Add" }) })
    .last()
    .getByRole("button", { name: "+ Add" });
await add(/Bluey Ears/).waitFor();
// Center the add-ons card (~825px tall) in the viewport; its heading sits ~40px below the card top.
await h.scrollTo(page.getByText("Pre-purchase show-themed souvenirs!"), 170);
await h.wait(1600); // long enough dwell for the hover loop
await h.click(add(/Bluey Ears/), "bluey-ears", 1200);
await h.click(add(/Bingo Ears/), "bingo-ears", 2600);
const cont = page.getByRole("button", { name: /Continue to checkout/i });
// Native smooth scroll: h.scrollTo stops short here and Playwright's click then jumps the page.
await cont.evaluate((el) =>
  el.scrollIntoView({ behavior: "smooth", block: "center" })
);
await h.wait(1200);
await h.click(cont, "checkout", 0);
await page.waitForURL(/shop\.camp\.com/, { timeout: 30000 });
// Shopify paints skeletons first (sometimes for 7s+); the next clip starts once the total renders,
// so the wait stays at the tail of 05-extras where the config cuts it.
await page
  .getByText(/^\$\d+\.\d{2}$/)
  .last()
  .waitFor({ timeout: 20000 });

rec.clip("06-checkout");
await rec.event("checkout-loaded");
await h.moveTo({ x: 1700, y: 760 });
await h.wait(2500);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
