// Storyboard: one still per beat, from screenshots, without rendering the video.
// Usage: npm run storyboard -- <app-id> [--reshoot]
// Screenshots live in public/<id>/storyboard/<clip>.jpg. Missing ones (or all, with --reshoot)
// are grabbed from the captured clips at each beat's `board` moment; drop in your own to override.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import type { VideoConfig } from "../src/types";
import { panelCount } from "../src/remotion/Storyboard";
import { timeline } from "../src/remotion/timeline";

const [id, flag] = process.argv.slice(2);
if (!id) throw new Error("usage: npm run storyboard -- <app-id> [--reshoot]");
const c: VideoConfig = (await import(`../apps/${id}/video.config.ts`)).default;
const run = (cmd: string, args: string[]) =>
  execFileSync(cmd, args, { stdio: "inherit" });

const shots = `public/${id}/storyboard`;
mkdirSync(shots, { recursive: true });
for (const b of timeline(c).beats)
  for (const s of b.shots) {
    const shot = `${shots}/${s.file}`;
    if (existsSync(shot) && flag !== "--reshoot") continue;
    const clip = `public/${id}/clips/${b.file}`;
    if (!existsSync(clip))
      throw new Error(
        `${shot} missing and no clip to grab it from; add a screenshot or run capture`
      );
    run("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-ss",
      String(s.time),
      "-i",
      clip,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      shot,
    ]);
  }

const out = `out/${id}/storyboard`;
rmSync(out, { recursive: true, force: true });
run("npx", [
  "remotion",
  "render",
  "src/remotion/Root.tsx",
  `${id}-storyboard`,
  out,
  "--sequence",
  `--frames=0-${panelCount(c) - 1}`,
  "--image-format=jpeg",
  "--jpeg-quality=90",
  "--log=error",
]);

// Contact sheet, two panels across.
const panels = readdirSync(out)
  .filter((f) => f.endsWith(".jpeg"))
  .sort();
const rows = Math.ceil(panels.length / 2);
run("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-framerate",
  "1",
  "-pattern_type",
  "glob",
  "-i",
  `${out}/*.jpeg`,
  "-vf",
  `scale=960:-1,tile=2x${rows}:margin=24:padding=24:color=0xE9E6DF`,
  "-frames:v",
  "1",
  "-q:v",
  "3",
  `out/${id}/storyboard.jpg`,
]);
console.log(
  `${panels.length} panels in ${out}/, contact sheet at out/${id}/storyboard.jpg`
);
