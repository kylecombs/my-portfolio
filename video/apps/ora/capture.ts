// Scripted tour of ORA. Run: npm run capture ora
// A second browser context plays the collaborator; only the host page is recorded.
import { chromium, type Page } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(new URL("../../public/ora", import.meta.url));
// smeared-arp from ~/Documents/ORA-patches. No Scope: one loaded from a file draws nothing (ORA bug).
const PATCH = fileURLToPath(new URL("./patch.json", import.meta.url));
const URL_ = "https://ora-fm.fly.dev/";

const browser = await chromium.launch({
  channel: "chrome",
  args: [
    "--window-size=1920,1080",
    "--force-device-scale-factor=2",
    "--autoplay-policy=no-user-gesture-required", // for the recorder's audio mixer
  ],
});
const viewport = { width: 1920, height: 1080 };
const hostCtx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
await installCursor(hostCtx);
const page = await hostCtx.newPage();
// The collaborator boots off camera so joining later is instant.
const peer = await (await browser.newContext({ viewport })).newPage();

const engine = (p: Page) => p.getByText("ENGINE RUNNING").waitFor({ timeout: 60000 });
const btn = (p: Page, title: string) => p.getByTitle(title, { exact: true }).first();
const node = (p: Page, label: string) =>
  p
    .locator("[data-node-id]")
    .filter({ has: p.locator(".node-type-label", { hasText: new RegExp(`^${label}$`, "i") }) })
    .last();
const slider = (p: Page, nodeLabel: string, param: string) =>
  node(p, nodeLabel)
    .locator(".node-param")
    .filter({ has: p.locator(".param-label", { hasText: new RegExp(`^${param}$`, "i") }) })
    .locator("input[type=range]");

await peer.goto(URL_, { waitUntil: "load" });
await btn(peer, "BOOT").click();
await engine(peer);
await page.goto(URL_, { waitUntil: "load" });
await page.waitForTimeout(1500);

const rec = await startRecorder(page, OUT, { audio: true });
const h = human(page, rec);
const hp = human(peer);

/** Drag a range slider from its thumb to `to` (0-1 of the track). */
async function drag(hh: typeof h, p: Page, s: ReturnType<typeof slider>, to: number, label?: string) {
  const b = (await s.boundingBox())!;
  const [v, min, max] = await s.evaluate((el: HTMLInputElement) => [+el.value, +el.min, +el.max]);
  const y = b.y + b.height / 2;
  await hh.moveTo({ x: b.x + ((v - min) / (max - min)) * b.width, y });
  if (label) await rec.event(label, s);
  await p.mouse.down();
  await hh.moveTo({ x: b.x + to * b.width, y });
  await p.mouse.up();
}

/** Drag a module by its header to put its top-left near (x, y). */
async function place(label: string, x: number, y: number, ev: string) {
  const head = node(page, label).locator(".node-header");
  const b = (await head.boundingBox())!;
  await h.moveTo({ x: b.x + 60, y: b.y + b.height / 2 });
  await rec.event(ev, head);
  await page.mouse.down();
  await h.moveTo({ x: x + 60, y: y + b.height / 2 });
  await page.mouse.up();
  await h.wait(300);
}

const port = (label: string, aria: string) =>
  node(page, label).getByLabel(aria, { exact: true });

rec.clip("01-boot");
await h.moveTo({ x: 700, y: 400 });
await h.wait(600);
await h.click(btn(page, "BOOT"), "boot", 0);
await engine(page);
await rec.event("running");
await h.wait(1200);

rec.clip("02-modules");
await h.click(btn(page, "Modules"), "modules", 500);
const search = page.getByPlaceholder("Search modules…");
await h.type(search, "saw", "search");
await h.click(page.getByText("Saw Osc", { exact: true }), "add-saw", 500);
await place("Saw Osc", 420, 430, "drag-saw");
await search.fill("");
await h.type(search, "scope");
await h.click(page.getByText("Scope", { exact: true }).first(), "add-scope", 500);
await place("Scope", 1180, 430, "drag-scope");
await h.click(btn(page, "Modules"), "close", 300);
await h.click(port("Saw Osc", "out output"), "cable-1", 300);
await h.click(port("Output", "L audio input"), "patched-1", 500);
await h.click(port("Saw Osc", "out output"), "cable-2", 300);
await h.click(port("Scope", "in audio input"), "patched-2", 1500);

rec.clip("03-patch");
const chooser = page.waitForEvent("filechooser");
await h.click(btn(page, "Load"), "load", 0);
await (await chooser).setFiles(PATCH);
await node(page, "Grain Smear").waitFor();
await rec.event("patch");
await h.wait(2500);
await drag(h, page, slider(page, "Buchla 259", "symm"), 0.75, "tweak");
await h.wait(500);
await drag(h, page, slider(page, "Grain Smear", "scatter"), 0.8, "tweak-2");
await h.wait(1500);

rec.clip("04-collab");
await h.click(btn(page, "Collaborate"), "collab", 500);
await h.click(page.getByText("New room", { exact: true }), "room", 0);
await page.getByText(/^live$/i).waitFor();
const room = new URL(page.url()).searchParams.get("room")!;
await h.moveTo({ x: 1500, y: 700 });
await h.wait(800);
// The collaborator joins; their room replaces their empty canvas with the host's patch.
await btn(peer, "Collaborate").click();
await peer.getByPlaceholder("warm-drone-914").fill(room);
await peer.getByRole("button", { name: "Join", exact: true }).click();
await page.getByText(/Session · 2/i).waitFor();
await rec.event("joined");
await node(peer, "Grain Smear").waitFor();
await peer.getByTitle(/^Session/).first().click(); // close their panel so it doesn't cover the canvas
await hp.moveTo({ x: 1300, y: 900 });
await hp.wait(1200);
await drag(hp, peer, slider(peer, "Buchla 259", "ratio"), 0.55, "peer-tweak");
await hp.wait(600);
await drag(hp, peer, slider(peer, "Grain Smear", "density"), 0.6, "peer-tweak-2");
await hp.moveTo({ x: 1050, y: 960 });
await h.wait(2000);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
