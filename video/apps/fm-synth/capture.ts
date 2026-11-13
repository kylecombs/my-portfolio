// Scripted tour of the Browser FM Synthesizer. Run: npm run capture fm-synth
// The synth is mouse-only and monophonic (Tone.js FMSynth), so every note is a click.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { human, installCursor } from "../../src/capture/human";
import { AUDIO_TAP, startRecorder } from "../../src/capture/recorder";

const OUT = fileURLToPath(new URL("../../public/fm-synth", import.meta.url));
const URL_ = "https://fmsynth.netlify.app/";
// The app's slider/pitch-wheel handlers map raw clientY with constants tuned for a shorter
// window; lifting the synth 68px lines them up with the cursor at 1920x1080.
const LIFT = 68;

const browser = await chromium.launch({
  channel: "chrome",
  args: [
    "--window-size=1920,1080",
    "--force-device-scale-factor=2",
    "--autoplay-policy=no-user-gesture-required", // Tone's AudioContext starts without a gesture
  ],
});
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await installCursor(ctx);
// Tone wires itself to the speakers on load, before startRecorder could tap it.
await ctx.addInitScript(AUDIO_TAP);
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "networkidle" });
await page.addStyleTag({ content: `#root { transform: translateY(-${LIFT}px); }` });
await page.waitForTimeout(1500);

const rec = await startRecorder(page, OUT, { audio: true });
const h = human(page, rec);

const keyEl = (note: string) => page.locator(`#keyboard li[note="${note}"]`);
/** A point on the key that isn't covered by a black key. */
async function keyAt(note: string) {
  const b = (await keyEl(note).boundingBox())!;
  return { x: b.x + b.width / 2, y: b.y + b.height * (note.includes("#") ? 0.4 : 0.8) };
}
/** Play notes as [note, seconds held] pairs, hopping quickly between keys. */
async function play(notes: [string, number][], label?: string) {
  for (const [i, [n, held]] of notes.entries()) {
    await h.moveTo(await keyAt(n), i ? 90 : undefined);
    if (label && i === 0) await rec.event(label, keyEl(n));
    await page.mouse.down();
    await h.wait(held * 1000);
    await page.mouse.up();
  }
}
const preset = (n: number) => page.locator(`#buttons-container .button[presetnum="${n}"]`);
const display = page.locator("#patch-display");

rec.clip("01-keys");
await h.moveTo({ x: 900, y: 760 });
await h.wait(500);
// Marimba (preset 1) is loaded.
await play(
  [["C4", 0.18], ["E4", 0.18], ["G4", 0.18], ["C5", 0.4], ["G4", 0.18], ["E4", 0.18], ["D4", 0.18], ["G3", 0.5]],
  "play"
);
await h.wait(300);
// Hold the button and sweep: the app plays each key the cursor enters.
await h.moveTo(await keyAt("C3"));
await rec.event("glide", keyEl("C3"));
await page.mouse.down();
await h.moveTo(await keyAt("C5"), 1300);
await h.wait(250);
await page.mouse.up();
await h.wait(900);

rec.clip("02-presets");
for (const [n, label, riff] of [
  [3, "kalimba", [["E4", 0.2], ["G4", 0.2], ["B4", 0.2], ["C5", 0.6]]],
  [5, "sawz", [["A3", 0.25], ["C4", 0.25], ["E4", 0.25], ["A4", 0.7]]],
  [6, "bass", [["E3", 0.2], ["E3", 0.15], ["G3", 0.2], ["A3", 0.2], ["B3", 0.15], ["A3", 0.5]]],
] as [number, string, [string, number][]][]) {
  await h.click(preset(n), label, 250);
  await rec.event(`${label}-display`, display);
  await play(riff);
  await h.wait(400);
}

rec.clip("03-octave");
const oct = page.locator(".slider.octave");
const mark = (t: string) => page.locator(".octave-mark", { hasText: t });
await h.moveTo(oct);
await rec.event("octave", oct);
await page.mouse.down();
const plus1 = (await mark("+1").boundingBox())!;
await h.moveTo({ x: (await oct.boundingBox())!.x + 17, y: plus1.y + plus1.height / 2 }, 500);
await page.mouse.up(); // still over #synth, which ends the drag
await h.wait(300);
await play([["E3", 0.2], ["E3", 0.15], ["G3", 0.2], ["A3", 0.2], ["B3", 0.15], ["A3", 0.5]], "octave-play");
await h.wait(500);

rec.clip("04-bend");
await h.click(preset(2), "bell", 400); // bell: long decay, so a held note rings through the bend
// The mouse can't hold a key and drag the wheel at once (MIDI input can); press the key in-page.
const press = (type: "mousedown" | "mouseup") =>
  keyEl("E4").evaluate((el, t) => el.dispatchEvent(new MouseEvent(t, { bubbles: true })), type);
const knob = page.locator("#pitchbend .knob");
await h.moveTo(knob);
await press("mousedown");
await rec.event("held", keyEl("E4"));
await h.wait(500);
const k = (await knob.boundingBox())!;
const kx = k.x + k.width / 2, ky = k.y + k.height / 2;
await rec.event("bend", knob);
await page.mouse.down();
await h.moveTo({ x: kx, y: ky - 24 }, 700); // up ~8 semitones
await h.wait(400);
await h.moveTo({ x: kx, y: ky + 20 }, 900); // down past the original pitch
await h.wait(300);
await h.moveTo({ x: kx, y: ky }, 500);
await page.mouse.up(); // the wheel springs back to centre
await rec.event("bend-end", knob);
await h.wait(600);
await press("mouseup");
await h.moveTo({ x: 1100, y: 760 });
await h.wait(1200);

const log = await rec.stop();
console.log(log.clips.map((c) => `${c.id}: ${c.duration}s`).join("\n"));
for (const [clip, ev] of Object.entries(log.events))
  for (const [label, e] of Object.entries(ev))
    console.log(`  ${clip} ${label} @ ${e.t}s`, e.box ?? "");
await browser.close();
