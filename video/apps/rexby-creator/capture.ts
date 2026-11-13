// Scripted tour of the mock Rexby creator tool (mock/, made-up creator, Wikimedia Commons photos).
// Run: npm run capture rexby-creator. The 2022 app needs its retired GraphQL API, so the video records a replica.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const MOCK = fileURLToPath(new URL("./mock/", import.meta.url));
const OUT = fileURLToPath(new URL("../../public/rexby-creator", import.meta.url));

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
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`file://${MOCK}index.html`);
await page.evaluate(() => document.fonts.ready);
// Warm the map tiles for every view so none load on camera.
// Includes the spot's close-up and both days' routes, which the tour flies to.
const idle = () => page.waitForTimeout(1800).then(() => page.waitForLoadState("networkidle"));
for (const v of ["spot", "itin", "mapview", "guide"]) {
  await page.evaluate(`go("${v}")`);
  await idle();
  if (v === "spot") {
    await page.evaluate("map.setView(NEW_SPOT.ll, 11, { animate: false })");
    await idle();
  }
  if (v === "itin") {
    for (const d of [["thingvellir", "strokkur", "gullfoss"], ["seljalandsfoss", "skogafoss", "reynisfjara"]]) {
      await page.evaluate(`days[0] = ${JSON.stringify(d)}; drawRoute(true)`);
      await idle();
    }
    await page.evaluate("days = [[]]; day = 0");
  }
}
await page.waitForTimeout(800);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const $ = (id: string) => page.locator("#" + id);
const tile = (id: string) => page.locator(`.tile[data-id="${id}"]`);

rec.clip("01-guide");
await h.moveTo({ x: 1100, y: 560 });
await rec.event("grid", $("spotgrid"));
await h.wait(1200);
await h.moveTo(page.locator('.card[data-id="seljalandsfoss"]'));
await h.wait(1400);
await h.moveTo($("addspot"));
await h.wait(500);

rec.clip("02-spot");
await h.click($("addspot"), "add", 500);
await rec.event("form", $("spot"));
await h.type($("place"), "Fjaðrár", "search");
await rec.event("results", $("results"));
await h.wait(500);
await h.click($("r0"), "place", 2200);
await rec.event("pin", page.locator("#map .pin"));
await h.click($("googlephotos"), "google", 900);
await rec.event("photos", page.locator(".modal"));
for (const [i, p] of ["fjadrargljufur", "fjadra-2", "fjadra-3"].entries())
  await h.click(page.locator(`.gpick [data-p="${p}"]`), `photo-${i + 1}`, 300);
await h.click($("gadd"), "added", 1400);

rec.clip("03-details");
await h.type($("title"), "Moss-green canyon rim walk", "title");
await h.click($("catbtn"), "category", 500);
await h.click(page.locator("#catmenu div", { hasText: "Hike" }), "hike", 900);
await h.scrollTo($("desc"), 420);
await h.type($("desc"), "A short rim walk above a 100 m deep canyon. Go before 10am.", "desc");
await h.type($("aff"), "rxby.link/fjadra-hike", "aff");
await h.click($("save"), "save", 0);
await page.locator(".card.new").waitFor();
await rec.event("saved", $("spotgrid"));
await h.wait(2400);

rec.clip("04-itinerary");
await h.click($("tab-itins"), "itins", 900);
await h.click($("newitin"), "new-itin", 500);
await rec.event("builder", $("itin"));
await h.type($("iname"), "3 days on the South Coast", "name");
for (const [i, id] of ["thingvellir", "strokkur", "gullfoss"].entries())
  await h.click(tile(id), `day1-${i + 1}`, 900);
await h.click($("addday"), "day2", 900);
for (const [i, id] of ["seljalandsfoss", "skogafoss", "reynisfjara"].entries())
  await h.click(tile(id), `day2-${i + 1}`, 900);
await rec.event("route", page.locator("#map"));
await h.wait(800);

rec.clip("05-price");
await h.click($("addprice"), "price", 600);
await rec.event("price-modal", page.locator(".modal"));
await h.type($("pinput"), "29", "amount");
await h.click($("pcontinue"), "continue", 900);
await h.click($("share"), "share", 0);
await page.locator(".itcard.new").waitFor();
await rec.event("shared", $("itingrid"));
await h.wait(2400);

rec.clip("06-map");
await h.click($("mapbtn"), "map", 1600);
await rec.event("mapview", page.locator("#map"));
await h.click(page.locator('.catpin[data-pin="jokulsarlon"]'), "marker", 1400);
await h.click($("embedbtn"), "embed", 900);
await rec.event("embed-box", $("embed"));
await h.click($("copy"), "copy", 2200);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
