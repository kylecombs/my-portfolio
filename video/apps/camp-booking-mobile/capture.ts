// Scripted tour of the CAMP booking flow at a phone viewport. Run: npm run capture camp-booking-mobile
// Same flow as apps/camp-booking, minus the gallery (the mobile page has no thumbnails).
// Note: reaching checkout creates a real cart that holds 2 GA seats for ~10 min. Nothing is purchased.
import { chromium, devices } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(new URL("../../public/camp-booking-mobile", import.meta.url));
// A shorter-than-real phone so the handset fits under the callout in the 9:16 video.
export const VIEWPORT = { width: 390, height: 677 };

// See the CAMP capture for why these flags: without them the screencast sends stretched 1x frames.
const browser = await chromium.launch({
  channel: "chrome",
  args: [`--window-size=${VIEWPORT.width},${VIEWPORT.height}`, "--force-device-scale-factor=2"],
});
const context = await browser.newContext({
  userAgent: devices["iPhone 13"].userAgent,
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await installCursor(context, { touch: true });
const page = await context.newPage();
const visible = (l: ReturnType<typeof page.locator>) => l.locator("visible=true").first();

// Off camera: load, dismiss the newsletter popup, back to the top.
await page.goto("https://camp.com/new-york-city/blueys-house", { waitUntil: "load" });
await page
  .getByText("Maybe later")
  .click({ timeout: 15000 })
  .catch(() => console.warn("no popup"));
await page.waitForTimeout(1500);
await page.evaluate("scrollTo(0, 0)");

const rec = await startRecorder(page, OUT);
const h = human(page, rec);

rec.clip("01-product");
await h.wait(1200);
const title = visible(page.getByRole("heading", { name: /Bluey x CAMP/ }));
await h.scrollTo(title, 90, 1400);
await rec.event("product", title);
await h.wait(1800);

rec.clip("02-schedule");
await h.click(visible(page.getByRole("button", { name: /Get Tickets/ })), "get-tickets", 0);
await page.waitForURL(/booking\/schedule/);
await page.getByText("1. Select Date").waitFor();
await h.wait(800);
await h.scrollTo(page.getByText("1. Select Date"), 70, 900);
await rec.event("calendar", page.getByText("1. Select Date"));
await h.wait(1200);
const slot = page
  .locator("button")
  .filter({ hasText: /^\d{1,2}:\d{2}(AM|PM)/ })
  .first();
// About a week out keeps away from sold-out days; step forward if a day has no slots.
const days = page.locator("button:has-text('$'):enabled");
for (let n = 7; ; n++) {
  await h.click(days.nth(n), "date", 700);
  if (await slot.isVisible({ timeout: 3000 }).catch(() => false)) break;
}
await h.wait(600);
await h.scrollTo(page.getByText("2. Select Time"), 70);
await rec.event("times", page.getByText("2. Select Time"));
await h.wait(900);
await h.click(slot, "time", 900);

rec.clip("03-people");
const next = page.getByRole("button", { name: /Next: Number of People/ });
await h.scrollTo(next, 300, 700);
await h.click(next, "next", 0);
await page.waitForURL(/booking\/tickets/);
await h.wait(1000);
const ga = page
  .locator("div")
  .filter({ hasText: /General Admission/ })
  .filter({ has: page.getByRole("button", { name: "Increase quantity" }) })
  .last();
await h.scrollTo(ga, 160);
await rec.event("tickets", ga);
const plus = ga.getByRole("button", { name: "Increase quantity" });
await h.click(plus, "ga-1", 500);
await h.click(plus, "ga-2", 1100);

rec.clip("04-extras");
const add2cart = page.getByRole("button", { name: "Add to Cart" });
await add2cart.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
await h.wait(900);
await h.click(add2cart, "add-to-cart", 0);
await page.waitForURL(/\/book\//);
const add = (name: RegExp) =>
  page
    .locator("div")
    .filter({ hasText: name })
    .filter({ has: page.getByRole("button", { name: "+ Add" }) })
    .last()
    .getByRole("button", { name: "+ Add" });
await add(/Bluey Ears/).waitFor();
await h.scrollTo(page.getByText("Pre-purchase show-themed souvenirs!"), 80);
await rec.event("extras", page.getByText("Pre-purchase show-themed souvenirs!"));
await h.wait(1200);
await add(/Bluey Ears/).evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
await h.wait(800);
await h.click(add(/Bluey Ears/), "bluey-ears", 1200);
await add(/Bingo Ears/).evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
await h.wait(800);
await h.click(add(/Bingo Ears/), "bingo-ears", 1800);
const cont = page.getByRole("button", { name: /Continue to checkout/i });
await cont.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
await h.wait(1200);
await h.click(cont, "checkout", 0);
await page.waitForURL(/shop\.camp\.com/, { timeout: 30000 });
// Mobile checkout collapses the order summary; its visible total sits in the summary toggle.
await visible(page.getByText(/^\$\d+\.\d{2}$/)).waitFor({ timeout: 20000 });

rec.clip("05-checkout");
await rec.event("checkout-loaded");
await h.wait(1500);
await h.scrollTo(400, 0, 1400);
await h.wait(1500);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
