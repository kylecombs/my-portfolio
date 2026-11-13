// Scripted tour of the Wobble Coffee Hydrogen storefront. Run: npm run capture wobble-coffee
// Needs the store's dev server: cd ~/Coffee-Brand-Shopify-Demo && npm run dev -- --port 3100
// Adds one bag to a cart and stops at the cart drawer. Nothing goes to checkout.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(new URL("../../public/wobble-coffee", import.meta.url));
const BASE = process.env.WOBBLE_URL ?? "http://localhost:3100";

// See the CAMP capture for why these flags: without them the screencast sends stretched 1x frames.
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

// Off camera: warm the routes (dev server compiles on first hit), then load home.
for (const path of ["/collections/all", "/products/hum-ethiopia-gedeb", "/finder", "/brew/pour-over"])
  await page.goto(BASE + path, { waitUntil: "load" });
await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(2500);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const main = page.locator("main");

rec.clip("01-home");
await h.moveTo({ x: 1200, y: 760 });
await rec.event("hero", page.locator("main section").first());
await h.wait(2600); // the wordmark wobbles and the stamp spins
await h.scrollTo(page.getByText("Our coffees", { exact: false }).first(), 140, 1600);
await rec.event("coffees", page.locator("main section").nth(2));
await h.wait(1800);

rec.clip("02-shop");
await h.click(page.locator("header").getByRole("link", { name: "Shop all" }), "shop-all", 0);
await page.waitForURL(/collections\/all/);
await h.wait(1200);
await h.click(main.locator("fieldset").filter({ hasText: /product type/i }).getByRole("link", { name: /^Coffee \(/ }), "filter", 0);
await page.waitForURL(/\?/);
await h.wait(800);
await rec.event("filtered", main.locator("a[href*='/products/']").first());
await h.wait(1000);

rec.clip("03-product");
const hum = main.locator("a[href*='/products/hum-ethiopia-gedeb']").first();
await h.scrollTo(hum, 300, 700);
await h.click(hum, "card", 0);
await page.waitForURL(/products\/hum/);
await h.wait(1500);
await rec.event("pdp", main.locator("h1").first());
await h.click(main.getByRole("button", { name: "2 lb" }), "size", 900);
await h.click(main.getByRole("button", { name: "Pour-over" }), "grind", 900);
await h.click(main.getByText("Subscribe & save"), "subscribe", 1400);

rec.clip("04-cart");
await h.click(main.getByRole("button", { name: /^(add to cart|subscribe ·)/i }), "add", 1800);
await h.click(page.locator("#cart-button"), "open-cart", 0);
await page.getByRole("dialog").waitFor();
await h.wait(800);
await rec.event("drawer", page.getByRole("dialog"));
await h.wait(2400);
await page.keyboard.press("Escape");
await h.wait(400);

rec.clip("05-finder");
await page.goto(BASE + "/finder", { waitUntil: "load" });
await h.wait(900);
await rec.event("finder", main.locator("form").first());
for (const [i, answer] of ["Pour-over or drip", "A splash", "Somewhere in between", "A little curious", "All day long"].entries()) {
  await h.click(main.locator("label").filter({ hasText: answer }), `q${i + 1}`, 550);
  await h.click(main.getByRole("button", { name: /next|see|match/i }).last(), undefined, 500);
}
await main.getByText("Your match").waitFor();
await rec.event("result", main.getByText("Your match"));
await h.moveTo(main.getByRole("button", { name: /add to cart/i }));
await h.wait(2200);

rec.clip("06-brew");
await page.goto(BASE + "/brew/pour-over", { waitUntil: "load" });
await h.wait(900);
await rec.event("brew", main.getByText("Ratio calculator"));
const coffee = main.getByLabel("Coffee (g)");
await h.click(coffee, "dose", 200);
await page.keyboard.press("ControlOrMeta+A");
for (const ch of "30") {
  await page.keyboard.type(ch);
  await h.wait(160);
}
await h.wait(1200);
await h.click(main.getByRole("button", { name: "Start" }), "start", 0);
await h.wait(4200);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev)) console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
