// Scripted tour of the mock Arx IPFS deploy tool (mock/, made-up project, chips and CIDs). Run: npm run capture arx-ipfs
// The 2023 tool isn't runnable anymore, so the video records a replica of its flow.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const MOCK = fileURLToPath(new URL("./mock/", import.meta.url));
const OUT = fileURLToPath(new URL("../../public/arx-ipfs", import.meta.url));

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
await page.waitForTimeout(800);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const $ = (id: string) => page.locator("#" + id);

rec.clip("01-project");
await h.moveTo({ x: 900, y: 500 });
await rec.event("build", $("build"));
await h.wait(3000);
await h.moveTo($("deploy"));
await h.wait(1200);

rec.clip("02-pin");
await h.click($("deploy"), "deploy", 0);
await rec.event("pin", $("pin"));
await $("cid-box").waitFor();
await rec.event("cid", $("cid-box"));
await h.wait(3800);

rec.clip("03-link");
await h.click($("all"), "select", 1300);
await h.click($("linkbtn"), "link", 1600);
await rec.event("modal", page.locator(".modal"));
await h.click($("confirm"), "confirm", 0);
await page.locator(".scrim.open").waitFor({ state: "detached" }).catch(() => {});
await page.locator("#t5.set").waitFor();
await rec.event("linked", page.locator("#link table"));
await h.wait(3000);

rec.clip("04-tap");
await h.click($("tap"), "tap", 0);
await rec.event("resolve", page.locator(".phone"));
await page.locator(".app").waitFor();
await rec.event("app", page.locator(".phone"));
await h.wait(4500);

rec.clip("05-update");
await page.evaluate(() => (window as any).prepareUpdate());
await rec.event("v13", $("build"));
await h.moveTo($("auto-wrap"));
await h.wait(2200);
await h.click($("deploy"), "redeploy", 0);
await page.getByText("6 chips now open v1.3.0").waitFor();
await rec.event("updated", page.locator("#link table"));
await h.wait(3000);

await page.evaluate(() => (window as any).resetPhone());

rec.clip("06-retap");
await h.wait(400);
await h.click($("tap"), "retap", 0);
await page.locator(".app.v2").waitFor();
await rec.event("app2", page.locator(".phone"));
await h.wait(4500);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
