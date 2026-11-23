import { spring } from "remotion";
import type { At, Region, VideoConfig } from "../types";

export interface Camera {
  k: number; // zoom
  tx: number; // translate, in capture CSS px
  ty: number;
}

/** Seconds into a clip for an `At`. */
export function resolveAt(c: VideoConfig, clip: string, at: At): number {
  if (typeof at === "number") return at;
  const name = typeof at === "string" ? at : at.event;
  const e = c.capture.events[clip]?.[name];
  if (!e)
    throw new Error(
      `${c.id}: no event "${name}" in clip ${clip}; re-run capture?`
    );
  return e.t + (typeof at === "string" ? 0 : at.offset);
}

export function timeline(c: VideoConfig) {
  let start = 0;
  const beats = c.beats.map((b) => {
    const clip = c.capture.clips.find((x) => x.id === b.clip);
    if (!clip) throw new Error(`${c.id}: no clip "${b.clip}" in events.json`);
    const speed = b.speed ?? 1;
    const trimStart = b.start === undefined ? 0 : resolveAt(c, b.clip, b.start);
    const end =
      b.end === undefined
        ? clip.duration
        : Math.min(resolveAt(c, b.clip, b.end), clip.duration);
    const frames = Math.round(((end - trimStart) / speed) * c.fps);
    /** Clip-relative `At` -> frame within this beat. */
    const frameOf = (at: At) =>
      Math.round(((resolveAt(c, b.clip, at) - trimStart) / speed) * c.fps);
    const boards =
      b.board !== undefined
        ? [b.board].flat()
        : [b.callout ? b.callout.at : (trimStart + end) / 2];
    // Storyboard screenshots: public/<id>/storyboard/<clip>.jpg, then <clip>-2.jpg, ...
    const shots = boards.map((at, k) => ({
      time: resolveAt(c, b.clip, at), // seconds into the clip
      file: k ? `${b.clip}-${k + 1}.jpg` : `${b.clip}.jpg`,
    }));
    const beat = {
      ...b,
      shots,
      file: clip.file,
      speed,
      trimStart,
      frames,
      start,
      frameOf,
    };
    start += frames;
    return beat;
  });
  const titleFrames = Math.round(c.titleSeconds * c.fps);
  const noticeFrames = Math.round((c.notice?.seconds ?? 0) * c.fps);
  const outroFrames = Math.round(c.outroSeconds * c.fps);
  return {
    beats,
    stageFrames: start,
    titleFrames,
    noticeFrames,
    outroFrames,
    total: titleFrames + noticeFrames + start + outroFrames,
  };
}

/** Camera showing `region` (null = the whole page) on a screen of `aspect`; a screen narrower than the capture crops its sides. */
export function cameraFor(
  c: VideoConfig,
  region: Region | null,
  aspect?: number
): Camera {
  const { width: W, height: H } = c.capture.viewport;
  const S = aspect ? W / aspect : H; // screen height, in capture px
  if (!region && S === H) return { k: 1, tx: 0, ty: 0 };
  const r = region ?? { x: 0, y: 0, w: W, h: H };
  const k = Math.max(S / H, Math.min(W / r.w, S / r.h)); // never zoom out past filling the screen
  const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
  return {
    k,
    tx: clamp(W / 2 - (r.x + r.w / 2) * k, W - W * k),
    ty: clamp(S / 2 - (r.y + r.h / 2) * k, S - H * k),
  };
}

function zoomKeys(
  c: VideoConfig,
  t: ReturnType<typeof timeline>,
  aspect?: number
) {
  return t.beats
    .flatMap((b) =>
      (b.zoom ?? []).map((z) => ({
        frame: b.start + b.frameOf(z.at),
        cam: cameraFor(c, z.region, aspect),
      }))
    )
    .sort((a, b) => a.frame - b.frame);
}

/** Where the camera comes to rest for stage frame `f` (the storyboard's view, ignoring springs). */
export function restingCameraAt(
  c: VideoConfig,
  t: ReturnType<typeof timeline>,
  f: number,
  aspect?: number
): Camera {
  return (
    zoomKeys(c, t, aspect).findLast((k) => k.frame <= f)?.cam ??
    cameraFor(c, null, aspect)
  );
}

/** Camera at stage frame `f`: each zoom keyframe springs from wherever the camera was. */
export function cameraAt(
  c: VideoConfig,
  t: ReturnType<typeof timeline>,
  f: number,
  aspect?: number
): Camera {
  const keys = zoomKeys(c, t, aspect);
  let cam: Camera = cameraFor(c, null, aspect);
  for (const key of keys) {
    if (key.frame > f) break;
    const p = spring({
      frame: f - key.frame,
      fps: c.fps,
      config: { damping: 200 },
      durationInFrames: 36,
    });
    cam = {
      k: cam.k + (key.cam.k - cam.k) * p,
      tx: cam.tx + (key.cam.tx - cam.tx) * p,
      ty: cam.ty + (key.cam.ty - cam.ty) * p,
    };
  }
  return cam;
}
