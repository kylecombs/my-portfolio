import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const dump = async (tag) => {
  await p.screenshot({ path: `${out}/s-${tag}.png` });
  const d = await p.evaluate(`[...document.querySelectorAll('button,a,[role=button],input')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>=0&&r.top<1080}).map(e=>{const r=e.getBoundingClientRect();return (e.tagName+' '+(e.innerText||e.value||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,40)+' @'+Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' .'+(e.className||'').toString().slice(0,50))})`);
  console.log(`\n== ${tag} ${p.url()}\n` + d.join("\n"));
};
await p.goto("https://camp.com/new-york-city/blueys-house", { waitUntil: "load" });
await p.waitForTimeout(6000);
await p.getByText("Maybe later").click().catch(e => console.log("no popup", e.message));
await p.waitForTimeout(1000);
await p.mouse.wheel(0, 500); await p.waitForTimeout(1500);
await p.locator("button.rounded-full.overflow-hidden").nth(4).click(); await p.waitForTimeout(2500); await dump("video"); await p.getByRole("button",{name:/Get Tickets/}).first().click(); await p.waitForTimeout(4000); await p.locator("button:has-text(\"$\"):enabled").nth(8).click(); await p.waitForTimeout(3000); await p.mouse.wheel(0,600); await p.waitForTimeout(1500); await dump("date"); await p.locator("button").filter({hasText:/^\d{1,2}:\d{2}(AM|PM)/}).first().click(); await p.waitForTimeout(1500); await dump("time"); await p.getByRole("button",{name:/Next: Number of People/}).click(); await p.waitForTimeout(4000); await dump("people"); const ga = p.locator("div").filter({hasText:/General Admission/i}).filter({has: p.getByRole("button",{name:"Increase quantity"})}).last(); await ga.scrollIntoViewIfNeeded(); await dump("ga"); const inc = ga.getByRole("button",{name:"Increase quantity"}); await inc.click(); await p.waitForTimeout(700); await inc.click(); await p.waitForTimeout(1500); await dump("ga2"); await p.getByRole("button",{name:/add to cart/i}).click(); await p.waitForTimeout(5000); await dump("extras"); for (const n of [/Bluey Ears/, /Bingo Ears/]) { const card = p.locator("div").filter({hasText:n}).filter({has: p.getByRole("button",{name:"+ Add"})}).last(); await card.getByRole("button",{name:"+ Add"}).click(); await p.waitForTimeout(2000); } await dump("ears"); await p.getByRole("button",{name:/Continue to checkout/i}).click(); await p.waitForTimeout(6000); await dump("checkout");
await b.close();
