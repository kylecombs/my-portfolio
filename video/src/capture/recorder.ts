// Records a page via CDP screencast (sharper than Playwright's ~1 Mbps recordVideo),
// marks clip boundaries and key moments, then cuts one mp4 per clip with ffmpeg.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Locator, Page } from "playwright";

export interface CaptureEvent {
  t: number; // seconds from the start of its clip
  box?: { x: number; y: number; w: number; h: number }; // element in CSS px, if one was given
}

export interface CaptureLog {
  viewport: { width: number; height: number };
  clips: { id: string; file: string; duration: number }[];
  events: Record<string, Record<string, CaptureEvent>>;
}

const FPS = 30;

export async function startRecorder(page: Page, outDir: string) {
  const framesDir = join(outDir, ".frames");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  mkdirSync(join(outDir, "clips"), { recursive: true });

  const viewport = page.viewportSize()!;
  const frames: { file: string; t: number }[] = [];
  const marks: { id: string; t: number }[] = [];
  const events: {
    clip: string;
    label: string;
    t: number;
    box?: CaptureEvent["box"];
  }[] = [];
  const now = () => Date.now() / 1000; // same clock as screencast metadata.timestamp

  const cdp = await page.context().newCDPSession(page);
  let stopped = false;
  cdp.on("Page.screencastFrame", (f) => {
    if (stopped) return; // frames still in flight after stop() would land in a deleted dir
    const file = join(
      framesDir,
      `${String(frames.length).padStart(6, "0")}.jpg`
    );
    writeFileSync(file, Buffer.from(f.data, "base64"));
    frames.push({ file, t: f.metadata.timestamp ?? now() });
    cdp
      .send("Page.screencastFrameAck", { sessionId: f.sessionId })
      .catch(() => {});
  });
  const start = () =>
    cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 92,
      maxWidth: viewport.width * 2,
      maxHeight: viewport.height * 2,
    });
  await start();
  // Cross-site navigations can swap the renderer and silently end the screencast.
  page.on("load", () => start().catch(() => {}));

  return {
    clip(id: string) {
      marks.push({ id, t: now() });
    },
    async event(label: string, target?: Locator) {
      const b = target ? await target.boundingBox() : null;
      const box = b
        ? {
            x: Math.round(b.x),
            y: Math.round(b.y),
            w: Math.round(b.width),
            h: Math.round(b.height),
          }
        : undefined;
      events.push({ clip: marks.at(-1)!.id, label, t: now(), box });
    },
    async stop() {
      const end = now();
      stopped = true;
      await cdp.send("Page.stopScreencast");
      const log: CaptureLog = { viewport, clips: [], events: {} };

      marks.forEach((m, i) => {
        const until = marks[i + 1]?.t ?? end;
        // The frame on screen when the clip starts, plus every frame painted during it.
        const first = Math.max(
          0,
          frames.findLastIndex((f) => f.t <= m.t)
        );
        const seg = frames
          .slice(first)
          .filter((f, j) => j === 0 || f.t < until);
        const lines = seg.flatMap((f, j) => {
          const from = j === 0 ? m.t : f.t;
          const to = seg[j + 1]?.t ?? until;
          return [`file '${f.file}'`, `duration ${(to - from).toFixed(4)}`];
        });
        lines.push(`file '${seg.at(-1)!.file}'`); // concat demuxer drops the last duration otherwise
        const list = join(framesDir, `${m.id}.txt`);
        writeFileSync(list, lines.join("\n"));

        const file = `${m.id}.mp4`;
        execFileSync("ffmpeg", [
          "-y",
          "-loglevel",
          "error",
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          list,
          "-vf",
          `fps=${FPS},scale=${viewport.width * 2}:${viewport.height * 2}:flags=lanczos`,
          "-t",
          (until - m.t).toFixed(3),
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "14",
          "-pix_fmt",
          "yuv420p",
          join(outDir, "clips", file),
        ]);
        log.clips.push({ id: m.id, file, duration: +(until - m.t).toFixed(3) });
        log.events[m.id] = {};
      });

      for (const e of events) {
        const clipStart = marks.find((m) => m.id === e.clip)!.t;
        log.events[e.clip][e.label] = {
          t: +(e.t - clipStart).toFixed(3),
          box: e.box,
        };
      }
      writeFileSync(join(outDir, "events.json"), JSON.stringify(log, null, 2));
      rmSync(framesDir, { recursive: true, force: true });
      return log;
    },
  };
}

export type Recorder = Awaited<ReturnType<typeof startRecorder>>;
