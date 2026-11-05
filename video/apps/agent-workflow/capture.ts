// Scripted tour of the agent coding workflow's dashboard. Run: npm run capture agent-workflow
// Records the dashboard copy in mock/ (logo removed) against made-up tickets served by mock/server.ts.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { startRecorder } from "../../src/capture/recorder";
import { startMockFactory } from "./mock/server";

const OUT = fileURLToPath(new URL("../../public/agent-workflow", import.meta.url));
const BASE = "http://127.0.0.1:8123/";
const SPEC_JOB = "031-eng-405-save-cart-for-later";
const PR_JOB = "026-eng-390-checkout-address-validation";

const server = await startMockFactory();
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--window-size=1920,1080", "--force-device-scale-factor=2"],
});
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
await installCursor(context);
const page = await context.newPage();
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(BASE + "dashboard.html");
await page.locator(`.card[data-id="${SPEC_JOB}"]`).waitFor();
await page.waitForTimeout(800);

const rec = await startRecorder(page, OUT);
const h = human(page, rec);
const card = (id: string) => page.locator(`.card[data-id="${id}"]`);
const tab = (name: string) => page.getByRole("tab", { name, exact: true });
/** Eased wheel scroll of whatever panel is under the cursor (the task page's panels scroll, not the window). */
async function wheel(dy: number, ms = 900) {
  const steps = Math.round(ms / 16);
  let done = 0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, k = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const to = Math.round(dy * k);
    await page.mouse.wheel(0, to - done);
    done = to;
    await h.wait(16);
  }
  await h.wait(350);
}

rec.clip("01-board");
await rec.event("board", page.locator("#board"));
await h.moveTo({ x: 1200, y: 700 });
await h.wait(2500);
await h.moveTo(card("028-eng-398-delivery-estimates"));
await rec.event("working", page.locator(".col").nth(2));
await h.wait(2400);
await h.moveTo(card("027-eng-394-session-store-redis"));
await rec.event("human", card("027-eng-394-session-store-redis"));
await h.wait(2400);

rec.clip("02-signoff");
await h.click(card(SPEC_JOB), "open-spec", 300);
await page.locator("#actions .criteria").waitFor();
await rec.event("criteria", page.locator("#actions"));
await h.moveTo(page.locator("#actions .criteria li").nth(1));
await h.wait(3200);
await h.click(page.getByRole("button", { name: "Approve spec" }), "approve", 500);
await h.click(page.getByRole("button", { name: "Yes, approve spec" }), "confirm", 300);
await page.locator(".badge", { hasText: "Queued" }).first().waitFor();
await rec.event("queued", page.locator("#d-summary"));
await h.wait(2000);

rec.clip("03-building");
await h.click(page.getByRole("link", { name: "Board" }), "board-link", 200);
await card(SPEC_JOB).waitFor();
await page.locator(".col").nth(2).locator(`.card[data-id="${SPEC_JOB}"]`).waitFor({ timeout: 10000 });
await rec.event("moved", card(SPEC_JOB));
await h.moveTo(card(SPEC_JOB));
await h.wait(4500);

rec.clip("04-workflow");
await h.click(card(PR_JOB), "open-pr", 400);
await page.locator("#summary-view h2").first().waitFor();
await h.click(tab("Workflow"), "workflow", 200);
await rec.event("graph", page.locator("#flow"));
await h.wait(2600);
await h.moveTo(page.locator("#c-design"));
await rec.event("loops", page.locator("#c-checks"));
await h.wait(3600);

rec.clip("05-reviews");
await h.click(tab("Docs"), "docs", 300);
await h.click(page.locator("#tabs button", { hasText: "design-1/review-ui.md" }), "changes", 3200);
await rec.event("blocking", page.locator("#doc"));
await h.click(page.locator("#tabs button", { hasText: "design-2/review-ui.md" }), "pass", 1000);
await page.locator("#doc .shots img").first().waitFor();
await h.moveTo({ x: 700, y: 640 });
await wheel(340);
await rec.event("shots", page.locator("#doc .shots"));
await h.wait(3000);

rec.clip("06-diff");
await h.click(tab("Diff"), "diff", 300);
await page.locator("#diff-view .d2h-file-wrapper").first().waitFor();
await rec.event("files", page.locator("#diff-view .d2h-file-list-wrapper"));
await h.wait(2600);
await h.moveTo({ x: 700, y: 700 });
await wheel(520, 1400);
await rec.event("code", page.locator("#diff-view"));
await h.wait(1000);
await h.click(tab("Summary"), "summary", 400);
await rec.event("decision", page.locator("#summary-view"));
await h.moveTo(page.getByRole("link", { name: /View PR/ }));
await h.wait(3500);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
server.close();
