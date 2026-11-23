// Scripted tour of the Wobble Coffee storefront at a phone viewport. Run: npm run capture wobble-coffee-mobile
// Needs the store's dev server: cd ~/Coffee-Brand-Shopify-Demo && npm run dev -- --port 3100
// Same beats as apps/wobble-coffee, through the mobile menu and inline filters. Nothing goes to checkout.
import { chromium, devices } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(new URL("../../public/wobble-coffee-mobile", import.meta.url));
const BASE = process.env.WOBBLE_URL ?? "http://localhost:3100";
const VIEWPORT = { width: 390, height: 677 }; // matches apps/camp-booking-mobile

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

// Off camera: warm the routes (dev server compiles on first hit), then load home.
for (const path of ["/collections/all", "/products/hum-ethiopia-gedeb", "/finder", "/brew/pour-over"])
  await page.goto(BASE + path, { waitUntil: "load" });
await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(2500);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const main = page.locator("main");

rec.clip("01-home");
await rec.event("hero", main.locator("section").first());
await h.wait(1800);
await h.scrollTo(page.getByText("Our coffees", { exact: false }).first(), 90, 2200);
await rec.event("coffees", page.getByText("Our coffees", { exact: false }).first());
await h.wait(1500);

rec.clip("02-shop");
await h.click(page.getByRole("banner").getByRole("button", { name: "Menu" }), "menu", 700);
await h.click(page.getByRole("dialog").getByRole("link", { name: /Shop all/ }), "shop-all", 0);
await page.waitForURL(/collections\/all/);
await h.wait(1000);
await h.click(main.getByRole("button", { name: "Filters" }), "filters", 900);
// The filters open inline above the grid; Product type sits just under the fold.
const coffeeFilter = main.locator("a").filter({ hasText: /^Coffee\s*\(\d+ products\)$/ }).locator("visible=true").first();
await h.scrollTo(coffeeFilter, 330, 800);
await h.click(coffeeFilter, "filter", 0);
await page.waitForURL(/\?/);
await h.wait(900);
await rec.event("filtered", main.locator("a[href*='/products/']").first());
await h.scrollTo(main.locator("a[href*='/products/']").first(), 120, 900);
await h.wait(1200);

rec.clip("03-product");
const hum = main.locator("a[href*='/products/hum-ethiopia-gedeb']").first();
await h.scrollTo(hum, 160, 900);
await h.click(hum, "card", 0);
await page.waitForURL(/products\/hum/);
await h.wait(1200);
await rec.event("pdp", main.locator("h1").first());
await h.scrollTo(main.getByRole("button", { name: "2 lb" }), 120, 1000);
await h.click(main.getByRole("button", { name: "2 lb" }), "size", 900);
await h.click(main.getByRole("button", { name: "Pour-over" }), "grind", 900);
await h.click(main.getByText("Subscribe & save"), "subscribe", 1400);

rec.clip("04-cart");
await h.click(main.getByRole("button", { name: /^(add to cart|subscribe ·)/i }), "add", 1600);
// The add opens the drawer by itself here; tapping the cart button then would close it.
if (!(await page.getByRole("dialog").isVisible())) await h.click(page.locator("#cart-button"), "open-cart", 0);
await page.getByRole("dialog").waitFor();
await h.wait(800);
await rec.event("drawer", page.getByRole("dialog"));
await h.wait(2400);
await page.keyboard.press("Escape");
await h.wait(400);

// The cup and all five options don't fit on a phone screen, so each question sits with the cup
// at the top and tries the options that fit under it (DOM order 1, 3, then 2, the one kept).
const question = page.getByText(/Question \d of 5/i).first();
const QUIZ = ["brew", "milk", "flavor", "adventure", "caffeine"];
async function answer(id: string) {
  await h.scrollTo(question, 334, 600);
  await rec.event(id, main.locator("form").first());
  const options = main.locator("form label");
  for (const i of [0, 2, 1]) await h.click(options.nth(i), undefined, 750);
  await h.click(main.getByRole("button", { name: /next|see|match/i }).last(), undefined, 600);
}

rec.clip("05-finder");
await page.goto(BASE + "/finder", { waitUntil: "load" });
await h.wait(900);
await rec.event("finder", main.locator("form").first());
for (const q of QUIZ.slice(0, 2)) await answer(q);

rec.clip("06-finder-more");
for (const q of QUIZ.slice(2)) await answer(q);
await main.getByText("Your match").waitFor();
await h.scrollTo(main.getByText("Your match"), 200, 900);
await rec.event("result", main.getByText("Your match"));
await h.wait(2200);

rec.clip("07-brew");
await page.goto(BASE + "/brew/pour-over", { waitUntil: "load" });
await h.wait(900);
await h.scrollTo(main.getByText("Ratio calculator"), 40, 900);
await rec.event("brew", main.getByText("Ratio calculator"));
const coffee = main.getByLabel("Coffee (g)");
await h.click(coffee, "dose", 200);
await page.keyboard.press("ControlOrMeta+A");
for (const ch of "30") {
  await page.keyboard.type(ch);
  await h.wait(160);
}
await page.keyboard.press("Enter").catch(() => {});
await h.wait(1000);
const start = main.getByRole("button", { name: "Start" });
await h.scrollTo(page.getByText("Brew timer", { exact: false }).first(), 40, 1000);
await h.click(start, "start", 0);
await h.wait(3200);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev)) console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
