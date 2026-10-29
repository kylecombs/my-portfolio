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
import { cameraAt, timeline } from "./timeline";

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
