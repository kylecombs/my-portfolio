// Scripted tour of the video upload flow in the mock Rexby creator tool (../rexby-creator/mock: made-up creator,
// Wikimedia Commons photos and video). Run: npm run capture rexby-video.
// The 2022 app needs its retired GraphQL API and AWS stack, so the video records a replica; the upload and
// processing steps are animated in the page, nothing is sent anywhere.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const MOCK = fileURLToPath(new URL("../rexby-creator/mock/", import.meta.url));
const OUT = fileURLToPath(new URL("../../public/rexby-video", import.meta.url));

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
// Warm the map tiles around the spot the tour edits, then reload to a clean guide.
await page.evaluate(`go("spot"); map.setView(SPOTS[3].ll, 11, { animate: false })`);
await page.waitForTimeout(1800);
await page.waitForLoadState("networkidle");
await page.reload();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const $ = (id: string) => page.locator("#" + id);
const card = page.locator('.card[data-id="seljalandsfoss"]');

rec.clip("01-edit");
await h.moveTo({ x: 1100, y: 560 });
await rec.event("grid", $("spotgrid"));
await h.wait(900);
await h.moveTo(card.locator(".ph"));
await h.wait(700);
await h.click(card.locator(".edit"), "edit", 0);
await rec.event("editor", $("spot"));
await h.wait(1600);

rec.clip("02-upload");
await h.click($("addmedia"), "add-media", 700);
await rec.event("types", page.locator(".modal"));
await h.click($("upvideo"), "upload-video", 800);
await rec.event("upload-modal", page.locator(".modal"));
await h.click($("browse"), "browse", 900);
await rec.event("file", page.locator(".file"));
await h.click($("upgo"), "upload", 0);
await page.locator("#prog.done").waitFor();
await rec.event("uploaded", page.locator(".modal"));

rec.clip("03-process");
await page.locator("#st0.run").waitFor();
await rec.event("transcode", $("steps"));
await page.locator("#st2.ok").waitFor();
await rec.event("processed", $("steps"));
await $("vtile").waitFor();
await rec.event("tile", $("vtile"));
await h.wait(1800);

rec.clip("04-cover");
await h.click($("coverbtn"), "cover", 0);
await page.locator('#cpick [data-c="2"]').waitFor();
await rec.event("frames", $("cpick"));
await h.wait(700);
await h.click(page.locator('#cpick [data-c="4"]'), "hover-pick", 400);
await h.click(page.locator('#cpick [data-c="2"]'), "pick", 700);
await h.click($("ccontinue"), "continue", 0);
await rec.event("covered", $("vtile"));
await h.wait(1600);

rec.clip("05-save");
await h.scrollTo($("save"), 640);
await h.wait(300);
await h.click($("save"), "save", 0);
await page.locator(".card.new").waitFor();
await rec.event("saved", card);
await h.wait(2200);

rec.clip("06-play");
await h.click(card.locator("h3"), "open", 0);
await $("pv").waitFor();
await rec.event("preview", $("pv"));
// Sync for the config's inset: page video seconds at the "preview" event.
console.log("pv.currentTime at preview:", await page.evaluate(`document.getElementById("pv").currentTime`));
await h.moveTo({ x: 1500, y: 700 });
await h.wait(4200);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
