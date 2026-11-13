// Human-looking input for capture: a visible cursor, eased mouse paths and scrolling,
// typing with uneven delays, and a pause after each action so viewers can read the UI.
import type { BrowserContext, Locator, Page } from "playwright";
import type { Recorder } from "./recorder";

// Playwright doesn't render a cursor, so draw one that follows real mouse events.
const CURSOR = `(() => {
  const mount = () => {
    if (document.getElementById("__cursor")) return;
    const s = document.createElement("style");
    s.textContent = \`
      #__cursor { position: fixed; left: 0; top: 0; width: 22px; height: 22px; margin: -11px 0 0 -11px;
        border-radius: 50%; background: rgba(20,20,20,.82); border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,.3); pointer-events: none; z-index: 2147483647;
        opacity: 0; transition: opacity .2s, scale .12s; }
      #__cursor.down { scale: .8; }
      #__cursor .ring { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(20,20,20,.6);
        animation: __pulse .5s ease-out forwards; }
      @keyframes __pulse { to { inset: -18px; opacity: 0; } }\`;
    document.documentElement.append(s);
    const c = document.createElement("div");
    c.id = "__cursor";
    document.documentElement.append(c);
    addEventListener("mousemove", (e) => {
      c.style.translate = e.clientX + "px " + e.clientY + "px";
      c.style.opacity = "1";
    }, true);
    addEventListener("mousedown", () => {
      c.classList.add("down");
      const r = document.createElement("div");
      r.className = "ring";
      c.append(r);
      setTimeout(() => r.remove(), 600);
    }, true);
    addEventListener("mouseup", () => c.classList.remove("down"), true);
  };
  if (document.documentElement) mount();
  else addEventListener("DOMContentLoaded", mount);
})()`;

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function installCursor(context: BrowserContext) {
  await context.addInitScript(CURSOR);
}

export function human(page: Page, rec?: Recorder) {
  let pos = { x: 960, y: 540 };

  // A new document has no cursor until the mouse moves; show it where it was.
  page.on("domcontentloaded", () => {
    page.mouse
      .move(pos.x + 1, pos.y)
      .then(() => page.mouse.move(pos.x, pos.y))
      .catch(() => {});
  });

  /** `ms` overrides the distance-based duration, e.g. for fast moves between piano keys. */
  async function moveTo(target: Locator | { x: number; y: number }, ms?: number) {
    let to = target as { x: number; y: number };
    if ("boundingBox" in target) {
      const b = await target.boundingBox();
      if (!b) throw new Error(`moveTo: ${target} has no box`);
      // Land a little off dead-centre, like a hand would.
      to = {
        x: b.x + b.width * (0.45 + Math.random() * 0.1),
        y: b.y + b.height * (0.45 + Math.random() * 0.1),
      };
    }
    const from = pos;
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const steps = Math.max(1, Math.round((ms ?? Math.min(Math.max(dist / 1.6, 320), 850)) / 16));
    for (let i = 1; i <= steps; i++) {
      const k = ease(i / steps);
      await page.mouse.move(
        from.x + (to.x - from.x) * k,
        from.y + (to.y - from.y) * k
      );
      await wait(16);
    }
    pos = to;
  }

  return {
    wait,
    moveTo,
    /** Move to, click, log `label` (with the element's box) at the moment of the click, then pause. */
    async click(target: Locator, label?: string, pauseAfter = 700) {
      await target.waitFor({ state: "visible" });
      await moveTo(target);
      await wait(140);
      if (label) await rec?.event(label, target);
      await page.mouse.down();
      await wait(90);
      await page.mouse.up();
      await wait(pauseAfter);
    },
    async type(target: Locator, text: string, label?: string) {
      await this.click(target, label, 200);
      for (const ch of text) {
        await page.keyboard.type(ch);
        await wait(55 + Math.random() * 90);
      }
      await wait(500);
    },
    /** Eased scroll so `target` sits `offset` px below the top of the viewport (or to an absolute y). */
    async scrollTo(target: Locator | number, offset = 120, ms = 900) {
      const y =
        typeof target === "number"
          ? target
          : await target.evaluate(
              (el, o) => el.getBoundingClientRect().top + scrollY - o,
              offset
            );
      // A string, not a function: tsx's keepNames wrapping (__name) doesn't exist in the page.
      await page.evaluate(`new Promise((done) => {
        const y0 = scrollY, y = ${y}, ms = ${ms}, t0 = performance.now();
        const e = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
        const step = (now) => {
          const t = Math.min((now - t0) / ms, 1);
          scrollTo({ top: y0 + (y - y0) * e(t), behavior: "instant" }); // instant: CSS smooth scrolling would fight each step
          if (t < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
      })`);
      await wait(350);
    },
  };
}
