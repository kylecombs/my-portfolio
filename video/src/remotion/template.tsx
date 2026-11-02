// The shared look of every app's video: title card, browser window, callout column, outro.
// Main (the video) and Storyboard (one still per beat) both render from here.
import { loadFont } from "@remotion/google-fonts/Inter";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { VideoConfig } from "../types";
import type { Camera } from "./timeline";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// Layout on the 1920x1080 canvas: browser frame on the right, callout column on the left.
export const FRAME = { x: 424, width: 1408, bar: 44 };
const SCREEN_H = (FRAME.width * 9) / 16; // 792
const FRAME_Y = (1080 - SCREEN_H - FRAME.bar) / 2;
const COLUMN = { x: 96, width: FRAME.x - 96 - 60 };

/** 0 -> 1 spring starting at `from`. */
export function useEnter(from: number, fps: number, damping = 200) {
  const frame = useCurrentFrame();
  return spring({ frame: frame - from, fps, config: { damping } });
}

function Rise({
  at,
  fps,
  children,
  style,
}: {
  at: number;
  fps: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const p = useEnter(at, fps);
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {children}
    </div>
  );
}

export function Fade({
  frames,
  out = 10,
  children,
}: {
  frames: number;
  out?: number;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [frames - out, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

export function TitleCard({ c }: { c: VideoConfig }) {
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", paddingLeft: 160, paddingRight: 160 }}
    >
      <Rise at={4} fps={c.fps}>
        {c.logo ? (
          <Img
            src={staticFile(c.logo)}
            style={{ height: 168, display: "block", marginBottom: 64 }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 4,
              background: c.colors.accent,
              marginBottom: 36,
            }}
          />
        )}
      </Rise>
      <Rise
        at={8}
        fps={c.fps}
        style={{
          fontSize: 104,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.02,
        }}
      >
        {c.title}
      </Rise>
      <Rise
        at={14}
        fps={c.fps}
        style={{
          fontSize: 36,
          color: c.colors.muted,
          marginTop: 28,
          maxWidth: 1100,
        }}
      >
        {c.description}
      </Rise>
    </AbsoluteFill>
  );
}

export function Outro({ c }: { c: VideoConfig }) {
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 160 }}>
      <Rise
        at={4}
        fps={c.fps}
        style={{ fontSize: 80, fontWeight: 600, letterSpacing: "-0.03em" }}
      >
        {c.title}
      </Rise>
      <Rise
        at={9}
        fps={c.fps}
        style={{ fontSize: 32, color: c.colors.muted, marginTop: 18 }}
      >
        {c.role}
      </Rise>
      <Rise
        at={14}
        fps={c.fps}
        style={{ display: "flex", gap: 14, marginTop: 44 }}
      >
        {c.tags.map((t) => (
          <div
            key={t}
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: c.colors.accent,
              border: `1.5px solid ${c.colors.accent}`,
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            {t}
          </div>
        ))}
      </Rise>
    </AbsoluteFill>
  );
}

export function Callout({
  c,
  index,
  label,
  text,
  frames,
}: {
  c: VideoConfig;
  index: number;
  label: string;
  text: string;
  frames: number;
}) {
  const frame = useCurrentFrame();
  const p = useEnter(0, c.fps);
  const out = interpolate(frame, [frames - 10, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: COLUMN.x,
        width: COLUMN.width,
        top: FRAME_Y + 120,
        opacity: p * out,
        transform: `translateY(${(1 - p) * 16 - (1 - out) * 8}px)`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: c.colors.accent,
          letterSpacing: "0.12em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          width: 32,
          height: 3,
          background: c.colors.accent,
          margin: "16px 0 22px",
        }}
      />
      <div
        style={{
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 23,
          color: c.colors.muted,
          marginTop: 16,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Browser window showing `children` (laid out at the capture viewport size) through the camera. */
export function BrowserFrame({
  c,
  url,
  cam,
  enter,
  children,
}: {
  c: VideoConfig;
  url: string;
  cam: Camera;
  enter: number;
  children: ReactNode;
}) {
  const { width: W, height: H } = c.capture.viewport;
  return (
    <div
      style={{
        position: "absolute",
        left: FRAME.x,
        top: FRAME_Y,
        width: FRAME.width,
        borderRadius: 14,
        overflow: "hidden",
        background: c.colors.surface,
        boxShadow:
          "0 40px 90px rgba(20,32,26,0.14), 0 6px 18px rgba(20,32,26,0.06)",
        outline: "1px solid rgba(20,32,26,0.07)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 40}px) scale(${0.98 + 0.02 * enter})`,
      }}
    >
      <div
        style={{
          height: FRAME.bar,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: "#E3E0D9",
            }}
          />
        ))}
        <div
          style={{
            margin: "0 auto",
            width: 560,
            height: 28,
            borderRadius: 8,
            background: c.colors.background,
            color: c.colors.muted,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {url}
        </div>
        <div style={{ width: 52 }} />
      </div>
      <div
        style={{
          width: FRAME.width,
          height: SCREEN_H,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: W,
            height: H,
            transformOrigin: "0 0",
            transform: `scale(${FRAME.width / W}) translate(${cam.tx}px, ${cam.ty}px) scale(${cam.k})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
