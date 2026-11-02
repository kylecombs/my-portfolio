import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { VideoConfig } from "../types";
import {
  BrowserFrame,
  Callout,
  Fade,
  fontFamily,
  Outro,
  TitleCard,
  useEnter,
} from "./template";
import { cameraAt, resolveAt, timeline } from "./timeline";

type TimedBeat = ReturnType<typeof timeline>["beats"][number];

/** The beat's inset video over its clip, in sync, plus the redrawn player controls. */
function Inset({ c, b }: { c: VideoConfig; b: TimedBeat }) {
  const frame = useCurrentFrame(); // within the beat
  const inset = b.inset!;
  const from = inset.from === undefined ? 0 : b.frameOf(inset.from);
  const to = inset.to === undefined ? b.frames : b.frameOf(inset.to);
  const clipFrom =
    inset.from === undefined ? b.trimStart : resolveAt(c, b.clip, inset.from);
  const sourceFrom = clipFrom + inset.sourceAt; // source seconds at `from`
  const { x, y, w, h } = inset.box;
  const t = sourceFrom + ((frame - from) / c.fps) * b.speed;
  const p = inset.controls ? Math.min(1, t / inset.controls.duration) : 0;
  return (
    <Sequence from={from} durationInFrames={to - from} layout="none">
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: inset.radius ?? 0,
        }}
      >
        <OffthreadVideo
          src={staticFile(inset.src)}
          trimBefore={Math.round(sourceFrom * c.fps)}
          playbackRate={b.speed}
          muted
          style={{
            width: w,
            height: h,
            objectFit: "cover",
            filter: inset.filter,
          }}
        />
        {inset.controls && (
          // Matches the CAMP gallery player: pause bars, then a 4px track with a 12px knob.
          <div
            style={{ position: "absolute", left: 0, right: 0, bottom: 28.5 }}
          >
            {[26.5, 33.5].map((l) => (
              <div
                key={l}
                style={{
                  position: "absolute",
                  left: l,
                  bottom: -5,
                  width: 3,
                  height: 10.5,
                  background: "#fff",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 60,
                right: 16,
                bottom: -2,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(to right, #fff ${p * 100}%, rgba(255,255,255,0.5) ${p * 100}%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 60 + p * (w - 76 - 12),
                bottom: -6,
                width: 12,
                height: 12,
                borderRadius: 6,
                background: "#fff",
              }}
            />
          </div>
        )}
      </div>
    </Sequence>
  );
}

function Stage({ c, t }: { c: VideoConfig; t: ReturnType<typeof timeline> }) {
  const frame = useCurrentFrame();
  const cam = cameraAt(c, t, frame);
  const enter = useEnter(0, c.fps);
  const { width: W, height: H } = c.capture.viewport;
  const beat = t.beats.findLast((b) => b.start <= frame) ?? t.beats[0];

  return (
    <AbsoluteFill>
      <BrowserFrame c={c} url={beat.url ?? c.url} cam={cam} enter={enter}>
        {t.beats.map((b) => (
          <Sequence
            key={b.clip}
            from={b.start}
            durationInFrames={b.frames}
            layout="none"
          >
            <OffthreadVideo
              src={staticFile(`${c.id}/clips/${b.file}`)}
              trimBefore={Math.round(b.trimStart * c.fps)}
              playbackRate={b.speed}
              muted
              style={{ position: "absolute", width: W, height: H }}
            />
            {b.inset && <Inset c={c} b={b} />}
          </Sequence>
        ))}
      </BrowserFrame>

      {t.beats.map((b, i) => {
        if (!b.callout) return null;
        const from = b.start + b.frameOf(b.callout.at);
        const until =
          b.start +
          (b.callout.out === undefined
            ? b.frames - 4
            : b.frameOf(b.callout.out));
        return (
          <Sequence
            key={b.clip}
            from={from}
            durationInFrames={until - from}
            layout="none"
          >
            <Callout
              c={c}
              index={i}
              label={b.callout.label}
              text={b.callout.text}
              frames={until - from}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

export function Main({ c }: { c: VideoConfig }) {
  const t = timeline(c);
  return (
    <AbsoluteFill
      style={{
        background: c.colors.background,
        color: c.colors.text,
        fontFamily,
      }}
    >
      <Sequence durationInFrames={t.titleFrames}>
        <Fade frames={t.titleFrames}>
          <TitleCard c={c} />
        </Fade>
      </Sequence>
      <Sequence from={t.titleFrames} durationInFrames={t.stageFrames}>
        <Fade frames={t.stageFrames} out={12}>
          <Stage c={c} t={t} />
        </Fade>
      </Sequence>
      <Sequence
        from={t.titleFrames + t.stageFrames}
        durationInFrames={t.outroFrames}
      >
        <Outro c={c} />
      </Sequence>
    </AbsoluteFill>
  );
}
