import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { VideoConfig } from "../types";
import { cameraFor, resolveAt, timeline } from "./timeline";

export const LOOP_FADE = 15;

/** Full-bleed cut of one beat. The tail crossfades into the footage just before `from`, so the last frame flows into the first. */
export function Loop({ c }: { c: VideoConfig }) {
  const frame = useCurrentFrame();
  const b = timeline(c).beats[c.loop.beat];
  const frames = Math.round(c.loop.seconds * c.fps);
  const from = Math.round(resolveAt(c, b.clip, c.loop.from) * c.fps); // source frames
  const speed = c.loop.speed ?? b.speed;
  const lead = Math.round(LOOP_FADE * speed);
  if (from < lead)
    throw new Error(
      `${c.id}: loop.from must be at least ${lead} frames into ${b.clip}`
    );
  const cam = cameraFor(c, c.loop.region);
  const { width: W, height: H } = c.capture.viewport;
  const video = (trimBefore: number) => (
    <OffthreadVideo
      src={staticFile(`${c.id}/clips/${b.file}`)}
      trimBefore={trimBefore}
      playbackRate={speed}
      muted
      style={{ position: "absolute", width: W, height: H }}
    />
  );

  return (
    <AbsoluteFill
      style={{ background: c.colors.background, overflow: "hidden" }}
    >
      <div
        style={{
          width: W,
          height: H,
          transformOrigin: "0 0",
          transform: `scale(${1920 / W}) translate(${cam.tx}px, ${cam.ty}px) scale(${cam.k})`,
        }}
      >
        {video(from)}
        <Sequence from={frames - LOOP_FADE} layout="none">
          <div
            style={{
              opacity: interpolate(
                frame,
                [frames - LOOP_FADE, frames - 1],
                [0, 1]
              ),
            }}
          >
            {video(from - lead)}
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
}
