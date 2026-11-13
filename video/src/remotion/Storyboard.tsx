import {
  AbsoluteFill,
  Freeze,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { VideoConfig } from "../types";
import { scenes } from "./scenes";
import {
  BrowserFrame,
  Callout,
  fontFamily,
  NoticeCard,
  Outro,
  TitleCard,
} from "./template";
import { cameraFor, restingCameraAt, timeline } from "./timeline";

/** Notes strip under each 1920x1080 panel. */
export const CAPTION = 72;

/** Frame every panel is frozen at, so springs have settled. */
const SETTLED = 60;

/** Panels: title, notice (if any), one per beat screenshot, outro. */
export const panelCount = (c: VideoConfig) =>
  timeline(c).beats.reduce((n, b) => n + b.shots.length, 0) + (c.notice ? 3 : 2);
/** Remotion clamps frames to the composition, so it runs past SETTLED; only the first panelCount frames are rendered. */
export const storyboardFrames = (c: VideoConfig) => panelCount(c) + SETTLED;

/** One still per frame: the template with each beat's screenshot in place of its clip, animations settled. */
export function Storyboard({ c }: { c: VideoConfig }) {
  const i = useCurrentFrame();
  const t = timeline(c);
  const { width: W, height: H } = c.capture.viewport;
  const secs = (frames: number) => `${(frames / c.fps).toFixed(1)}s`;
  const shots = t.beats.flatMap((b, n) => b.shots.map((s) => ({ b, n, s })));
  const first = c.notice ? 2 : 1; // panel index of the first beat shot
  const shot = shots[i - first];

  let panel, caption;
  if (i === 0) {
    panel = <TitleCard c={c} />;
    caption = `Title · ${secs(t.titleFrames)}`;
  } else if (i < first) {
    panel = <NoticeCard c={c} />;
    caption = `Notice · ${secs(t.noticeFrames)}`;
  } else if (!shot) {
    panel = <Outro c={c} />;
    caption = `Outro · ${secs(t.outroFrames)}`;
  } else {
    const { b, n, s } = shot;
    const Scene = scenes[c.id];
    const cam = restingCameraAt(c, t, b.start + b.frameOf(s.time));
    panel = (
      <>
        <BrowserFrame
          c={c}
          url={b.url ?? c.url}
          cam={Scene ? cameraFor(c, null) : cam}
          enter={1}
        >
          {Scene ? (
            <Scene c={c} frame={b.start + b.frameOf(s.time)} cam={cam} />
          ) : (
            <Img
              src={staticFile(`${c.id}/storyboard/${s.file}`)}
              style={{ width: W, height: H }}
            />
          )}
        </BrowserFrame>
        {b.callout && (
          <Callout
            c={c}
            index={n}
            label={b.callout.label}
            text={b.callout.text}
            frames={1e6} // never fades out
          />
        )}
      </>
    );
    caption = `${String(n + 1).padStart(2, "0")} · ${b.clip} · ${secs(b.frames)} at ${b.speed}× · shot at ${s.time.toFixed(1)}s`;
  }

  return (
    <AbsoluteFill
      style={{
        background: c.colors.background,
        color: c.colors.text,
        fontFamily,
      }}
    >
      <div style={{ position: "relative", height: 1080, overflow: "hidden" }}>
        <Freeze frame={SETTLED}>{panel}</Freeze>
      </div>
      <div
        style={{
          height: CAPTION,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          fontSize: 26,
          color: c.colors.muted,
          background: c.colors.surface,
          borderTop: "1px solid rgba(20,32,26,0.08)",
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
}
