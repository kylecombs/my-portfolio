// Scripted tour of the mock CAMP admin app (mock/, made-up data). Run: npm run capture shopify-admin
// The real app only runs embedded in a signed-in Shopify admin, so the video records a Polaris replica.
import { chromium } from "playwright";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";

const MOCK = fileURLToPath(new URL("./mock/", import.meta.url));
const OUT = fileURLToPath(new URL("../../public/shopify-admin", import.meta.url));

buildSync({
  entryPoints: [MOCK + "App.tsx"],
  bundle: true,
  outdir: MOCK + "dist",
  jsx: "automatic",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

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
await page.goto(`file://${MOCK}index.html#slots`);
await page.getByText("Bluey x CAMP: Bluey's House").waitFor();

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const row = (i: number) => page.locator(".Polaris-DataTable__TableRow").nth(i);
const modal = page.locator(".Polaris-Modal-Dialog__Modal");

rec.clip("01-slots");
await h.moveTo({ x: 1300, y: 600 });
await rec.event("table", page.locator(".Polaris-DataTable").first());
await h.wait(1800);
// The three 5th Avenue rows.
for (const [n, i] of [0, 3, 6].entries())
  await h.click(row(i).locator(".Polaris-Checkbox"), `select-${n + 1}`, 450);
await h.wait(600);

rec.clip("02-update");
await h.click(page.getByRole("button", { name: "Update", exact: true }), "update", 900);
await rec.event("modal", modal);
await h.type(modal.getByLabel("Internal reason for update"), "Holiday weekend pricing", "reason");
await h.type(modal.getByLabel("Child Price", { exact: true }), "49", "price");
await h.click(modal.locator(".Polaris-Checkbox").filter({ has: page.getByLabel("Change addons") }), "addons", 1200);
await h.click(modal.getByRole("button", { name: /^Update 3 Time Slots$/ }), "save", 1600);
await rec.event("updated", row(0));
await h.wait(800);

rec.clip("03-addons");
await h.click(page.getByRole("button", { name: "Edit Activity Type" }), "edit-type", 600);
await page.getByText("Edit Activity Type").first().waitFor();
await h.wait(500);
await h.scrollTo(page.locator("#addons"), 230);
await rec.event("addons", page.locator("#addons"));
await h.wait(1200);
const plush = page.locator("#addons .Polaris-DataTable__TableRow").nth(2);
await h.click(plush.getByRole("button", { name: "Edit" }), "edit-addon", 900);
await rec.event("addon-modal", modal);
await h.click(modal.locator(".Polaris-Checkbox").filter({ has: page.getByLabel("Washington D.C.") }), "location", 900);
await h.click(modal.getByRole("button", { name: "Save" }), "addon-save", 1400);

rec.clip("04-bundles");
await h.scrollTo(page.locator("#bundles"), 260);
await rec.event("bundles", page.locator("#bundles"));
await h.moveTo(page.locator("#bundles .Polaris-DataTable__TableRow").first());
await h.wait(2200);

rec.clip("05-leads");
await h.click(page.getByRole("button", { name: "Celebrations" }), "celebrations", 400);
await page.getByText("Celebration Leads").waitFor();
await rec.event("leads", page.locator(".Polaris-DataTable"));
await h.wait(2000);
await h.click(page.getByRole("button", { name: "Jamie" }), "lead", 300);

rec.clip("06-lead");
await page.getByText("Edit Celebration Lead").waitFor();
await rec.event("lead-page");
await h.wait(1500);
await h.scrollTo(page.locator("#invoices"), 330);
await rec.event("invoices", page.locator("#invoices"));
await h.type(page.getByLabel(/track additional invoices/), "#1187", "order");
await h.click(page.getByRole("button", { name: "Track invoice" }), "track", 800);
await h.scrollTo(0, 0, 800);
await rec.event("invoiced", page.getByText("Edit Celebration Lead"));
await h.wait(2000);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
